import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.module.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/loaders/RGBELoader.js';
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  DepthOfFieldEffect,
  NoiseEffect,
  BlendFunction
} from 'https://cdn.jsdelivr.net/npm/postprocessing@6.33.3/build/postprocessing.esm.js';

let WebGPURendererModule = null;
if (typeof navigator !== 'undefined' && navigator.gpu) {
  try {
    WebGPURendererModule = await import('https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/renderers/WebGPURenderer.js');
  } catch (error) {
    console.warn('[LiquidRenderer] WebGPU module unavailable, falling back to WebGL2.', error);
  }
}

const HDRI_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr';
const MAX_FPS_SAMPLES = 180;
const PERFORMANCE_THRESHOLD = 30;
const shaderBaseUrl = new URL('../shaders/', import.meta.url);

window.THREE = window.THREE || THREE;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(from, to, alpha) {
  return from + (to - from) * alpha;
}

const ShaderCache = {
  promise: null,
  async load() {
    if (!this.promise) {
      const vertexUrl = new URL('glassVertex.glsl', shaderBaseUrl);
      const fragmentUrl = new URL('glassFragment.glsl', shaderBaseUrl);
      this.promise = Promise.all([
        fetch(vertexUrl).then((response) => {
          if (!response.ok) throw new Error('Unable to load glassVertex.glsl');
          return response.text();
        }),
        fetch(fragmentUrl).then((response) => {
          if (!response.ok) throw new Error('Unable to load glassFragment.glsl');
          return response.text();
        })
      ]).then(([vertex, fragment]) => ({ vertex, fragment }));
    }
    return this.promise;
  }
};

const EnvironmentCache = {
  texture: null,
  promise: null,
  async get(renderer) {
    if (this.texture) return this.texture;
    if (!this.promise) {
      this.promise = new Promise((resolve, reject) => {
        const loader = new RGBELoader();
        loader.setDataType(THREE.UnsignedByteType);
        loader.load(
          HDRI_URL,
          (texture) => {
            const pmrem = new THREE.PMREMGenerator(renderer);
            pmrem.compileEquirectangularShader();
            const envMap = pmrem.fromEquirectangular(texture).texture;
            envMap.mapping = THREE.CubeReflectionMapping;
            texture.dispose();
            pmrem.dispose();
            this.texture = envMap;
            resolve(envMap);
          },
          undefined,
          (error) => reject(error)
        );
      }).catch((error) => {
        console.warn('[LiquidRenderer] Unable to load HDRI environment map', error);
        return null;
      });
    }
    const env = await this.promise;
    return env;
  }
};

class AudioController {
  constructor() {
    this.context = null;
    this.analyser = null;
    this.data = null;
    this.level = 0;
    this.enabled = false;
  }

  async init() {
    if (this.enabled) return true;
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false }, video: false });
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.context.createMediaStreamSource(stream);
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      this.data = new Uint8Array(this.analyser.frequencyBinCount);
      source.connect(this.analyser);
      this.enabled = true;
      return true;
    } catch (error) {
      console.warn('[LiquidRenderer] Audio input unavailable', error);
      return false;
    }
  }

  update() {
    if (!this.enabled || !this.analyser || !this.data) return 0;
    this.analyser.getByteFrequencyData(this.data);
    let total = 0;
    for (let i = 0; i < this.data.length; i += 1) {
      total += this.data[i];
    }
    const average = total / (this.data.length * 255);
    this.level = lerp(this.level, average, 0.25);
    return this.level;
  }
}

class PointerCursor {
  constructor() {
    this.node = document.querySelector('.liquid-cursor');
    if (!this.node) {
      this.node = document.createElement('div');
      this.node.className = 'liquid-cursor';
      document.body.appendChild(this.node);
    }
  }

  updatePosition(x, y) {
    if (!this.node) return;
    this.node.style.left = `${x}px`;
    this.node.style.top = `${y}px`;
  }

  setVisible(visible) {
    if (!this.node) return;
    this.node.style.opacity = visible ? '1' : '0';
  }
}

class GlassScene {
  constructor(element, config, shaders) {
    this.element = element;
    this.config = { ...config };
    this.shaders = shaders;
    this.canvas = null;
    this.renderer = null;
    this.webgpuRenderer = null;
    this.scene = null;
    this.camera = null;
    this.composer = null;
    this.bloomEffect = null;
    this.dofEffect = null;
    this.clock = new THREE.Clock();
    this.uniforms = null;
    this.material = null;
    this.animationId = null;
    this.audio = new AudioController();
    this.cursor = new PointerCursor();
    this.pointer = new THREE.Vector2(0.5, 0.5);
    this.pointerStrength = 0;
    this.scrollTarget = 0;
    this.scrollValue = 0;
    this.performanceSamples = [];
    this.lowPowerMode = false;
    this.particles = null;
    this.htmlSurfaces = [];
    this.surfaceGroup = null;
    this.cursorMesh = null;
    this.envMap = null;
    this.size = { width: 1, height: 1 };
    this.boundPointerMove = (event) => this.handlePointerMove(event);
    this.boundPointerLeave = () => this.handlePointerLeave();
    this.boundPointerDown = (event) => this.handlePointerDown(event);
    this.boundScroll = () => this.handleScroll();
    this.boundResize = () => this.handleResize();
    this.boundClick = () => this.handleClick();
  }

  async init() {
    if (!this.element || this.element.dataset.liquidInitialized === 'true') {
      return false;
    }

    this.element.dataset.liquidInitialized = 'true';
    this.element.classList.add('liquid-glass-stage');

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'liquid-renderer-canvas';
    this.canvas.setAttribute('data-liquid-canvas', '');
    this.element.appendChild(this.canvas);

    const { width, height } = this.element.getBoundingClientRect();
    this.size.width = width || window.innerWidth;
    this.size.height = height || window.innerHeight;

    await this.createRenderer();
    if (!this.renderer) {
      this.fallback('webgl-init-failed');
      return false;
    }

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050b1a, 0.045);

    const aspect = this.size.width / this.size.height;
    const viewSize = 12;
    this.camera = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      0.1,
      80
    );
    this.camera.position.set(0, 0, 30);
    this.camera.lookAt(0, 0, 0);

    const ambient = new THREE.HemisphereLight(0x88bfff, 0x0b1120, this.config.ambientStrength * 0.85);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xc5dcff, this.config.lightIntensity || 1.3);
    keyLight.position.set(-9, 12, 14);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6f8bff, this.config.lightIntensity * 0.6 || 0.9);
    rimLight.position.set(6, -4, -6);
    this.scene.add(rimLight);

    this.envMap = await EnvironmentCache.get(this.renderer);
    if (!this.envMap) {
      this.envMap = new THREE.CubeTexture();
      this.envMap.needsUpdate = true;
    }
    if (this.envMap) {
      this.scene.environment = this.envMap;
    }

    this.uniforms = {
      u_time: { value: 0 },
      u_distortion: { value: this.config.distortion },
      u_waveAmplitude: { value: this.config.waveAmplitude },
      u_waveSpeed: { value: this.config.waveSpeed },
      u_mouse: { value: this.pointer.clone() },
      u_mouseStrength: { value: 0 },
      u_clickTime: { value: -10 },
      u_audioLevel: { value: 0 },
      u_scroll: { value: 0 },
      u_resolution: { value: new THREE.Vector2(this.size.width, this.size.height) },
      u_thickness: { value: this.config.thickness },
      u_refractIndex: { value: this.config.refractIndex },
      u_reflectivity: { value: this.config.reflectivity },
      u_ambientStrength: { value: this.config.ambientStrength },
      u_glowColor: { value: new THREE.Color(this.config.glowColor) },
      u_sceneLightA: { value: new THREE.Vector3(-0.45, 0.76, 0.55) },
      u_sceneLightB: { value: new THREE.Vector3(0.35, -0.25, -0.48) },
      u_causticIntensity: { value: this.config.causticIntensity },
      u_envMap: { value: this.envMap }
    };

    const geometry = new THREE.PlaneGeometry(28, 18, 256, 256);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.shaders.vertex,
      fragmentShader: this.shaders.fragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const primaryPlane = new THREE.Mesh(geometry, this.material);
    primaryPlane.position.set(0, 0, -6);
    this.scene.add(primaryPlane);

    this.surfaceGroup = new THREE.Group();
    this.scene.add(this.surfaceGroup);

    this.createCursorMesh();
    this.createParticles();
    this.createDomSurfaces();
    this.createComposer();

    this.bindEvents();
    this.clock.start();
    this.render();
    return true;
  }

  async createRenderer() {
    const pixelRatio = clamp(window.devicePixelRatio || 1, 1, 2.2);
    try {
      if (WebGPURendererModule) {
        this.webgpuRenderer = new WebGPURendererModule.WebGPURenderer({ canvas: this.canvas, antialias: true });
        await this.webgpuRenderer.init();
        this.webgpuRenderer.setSize(this.size.width, this.size.height);
        this.webgpuRenderer.setPixelRatio(pixelRatio);
      }
    } catch (error) {
      console.warn('[LiquidRenderer] WebGPU init failed', error);
      this.webgpuRenderer = null;
    }

    const context = this.canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance'
    });

    if (!context) {
      this.renderer = null;
      return;
    }

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, context, alpha: true, antialias: true });
    this.renderer.autoClear = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(this.size.width, this.size.height, false);
  }

  createComposer() {
    if (!this.renderer) return;
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.size.width, this.size.height);

    const renderPass = new RenderPass(this.scene, this.camera);
    const bloom = new BloomEffect({
      intensity: this.config.bloomIntensity,
      luminanceThreshold: 0.25,
      luminanceSmoothing: 0.9,
      kernelSize: 5
    });
    this.bloomEffect = bloom;
    const dof = new DepthOfFieldEffect(this.camera, {
      focusDistance: 0.0025,
      focalLength: 0.02,
      bokehScale: 3.5
    });
    this.dofEffect = dof;
    const noise = new NoiseEffect({ blendFunction: BlendFunction.COLOR_DODGE, premultiply: true });
    noise.blendMode.opacity.value = 0.04;

    const effectsPass = new EffectPass(this.camera, bloom, dof, noise);

    this.composer.addPass(renderPass);
    this.composer.addPass(effectsPass);
  }

  createCursorMesh() {
    const cursorGeometry = new THREE.SphereGeometry(0.65, 48, 48);
    const cursorMaterial = new THREE.MeshPhysicalMaterial({
      metalness: 0.25,
      roughness: 0.05,
      transmission: 1,
      thickness: 1.25,
      transparent: true,
      opacity: 0.75,
      envMap: this.envMap,
      envMapIntensity: 1.2,
      color: new THREE.Color(this.config.glowColor)
    });
    this.cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
    this.cursorMesh.position.set(0, 0, 4);
    this.scene.add(this.cursorMesh);
  }

  createParticles() {
    const count = this.config.particleCount;
    const geometry = new THREE.IcosahedronGeometry(0.24, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(this.config.particleColor),
      metalness: 0.3,
      roughness: 0.15,
      transparent: true,
      opacity: 0.4,
      envMap: this.envMap,
      envMapIntensity: 0.6
    });
    this.particles = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i += 1) {
      dummy.position.set(
        THREE.MathUtils.randFloatSpread(18),
        THREE.MathUtils.randFloatSpread(10),
        -THREE.MathUtils.randFloat(2, 12)
      );
      dummy.scale.setScalar(THREE.MathUtils.randFloat(0.4, 1.1));
      dummy.updateMatrix();
      this.particles.setMatrixAt(i, dummy.matrix);
    }
    this.scene.add(this.particles);
  }

  createDomSurfaces() {
    const nodes = Array.from(document.querySelectorAll('.liquid-glass'));
    if (!nodes.length) return;
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const dummy = new THREE.Object3D();
    const rect = this.element.getBoundingClientRect();
    const widthWorld = this.camera.right - this.camera.left;
    const heightWorld = this.camera.top - this.camera.bottom;

    nodes.forEach((node, index) => {
      const uniforms = THREE.UniformsUtils.clone(this.uniforms);
      uniforms.u_waveAmplitude.value *= 0.65;
      uniforms.u_distortion.value *= 0.65;
      uniforms.u_thickness.value *= 0.8;
      uniforms.u_envMap.value = this.envMap;
      uniforms.u_clickTime.value = -10;
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: this.shaders.vertex,
        fragmentShader: this.shaders.fragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 1 + index;
      const bounds = node.getBoundingClientRect();
      const centerX = (bounds.left + bounds.width / 2) - rect.left;
      const centerY = (bounds.top + bounds.height / 2) - rect.top;
      const normalizedX = clamp(centerX / rect.width, 0, 1);
      const normalizedY = clamp(centerY / rect.height, 0, 1);

      mesh.position.set(
        this.camera.left + widthWorld * normalizedX,
        this.camera.top - heightWorld * normalizedY,
        -3.5 - index * 0.35
      );
      mesh.scale.set(
        (bounds.width / rect.width) * widthWorld,
        (bounds.height / rect.height) * heightWorld,
        1
      );

      this.surfaceGroup.add(mesh);
      this.htmlSurfaces.push({ node, mesh, uniforms });
    });
  }

  bindEvents() {
    window.addEventListener('pointermove', this.boundPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.boundPointerLeave, { passive: true });
    window.addEventListener('pointerdown', this.boundPointerDown);
    window.addEventListener('click', this.boundClick);
    window.addEventListener('scroll', this.boundScroll, { passive: true });
    window.addEventListener('resize', this.boundResize);
  }

  unbindEvents() {
    window.removeEventListener('pointermove', this.boundPointerMove);
    window.removeEventListener('pointerleave', this.boundPointerLeave);
    window.removeEventListener('pointerdown', this.boundPointerDown);
    window.removeEventListener('click', this.boundClick);
    window.removeEventListener('scroll', this.boundScroll);
    window.removeEventListener('resize', this.boundResize);
  }

  handlePointerMove(event) {
    const rect = this.element.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    this.pointer.set(x, 1 - y);
    this.pointerStrength = clamp(this.pointerStrength + 0.12, 0, 1.2);
    if (this.uniforms) {
      this.uniforms.u_mouse.value.copy(this.pointer);
    }
    this.updateCursorMesh();
    this.cursor.updatePosition(event.clientX, event.clientY);
    this.cursor.setVisible(true);
  }

  handlePointerLeave() {
    this.pointerStrength = 0;
    this.cursor.setVisible(false);
  }

  async handlePointerDown(event) {
    this.uniforms.u_clickTime.value = this.clock.elapsedTime;
    this.pointerStrength = 1.2;
    this.handlePointerMove(event);
    await this.audio.init();
  }

  handleClick() {
    this.triggerPulse(1.0);
  }

  handleScroll() {
    const scrollMax = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const ratio = clamp(window.scrollY / scrollMax, 0, 1);
    this.scrollTarget = ratio;
  }

  handleResize() {
    const bounds = this.element.getBoundingClientRect();
    this.size.width = bounds.width || window.innerWidth;
    this.size.height = bounds.height || window.innerHeight;
    const aspect = this.size.width / this.size.height;
    const viewSize = 12;
    this.camera.left = -viewSize * aspect;
    this.camera.right = viewSize * aspect;
    this.camera.top = viewSize;
    this.camera.bottom = -viewSize;
    this.camera.updateProjectionMatrix();

    if (this.renderer) {
      this.renderer.setSize(this.size.width, this.size.height, false);
      this.renderer.setPixelRatio(clamp(window.devicePixelRatio || 1, 1, 2.2));
    }
    if (this.composer) {
      this.composer.setSize(this.size.width, this.size.height);
    }
    if (this.uniforms?.u_resolution) {
      this.uniforms.u_resolution.value.set(this.size.width, this.size.height);
    }

    this.updateDomSurfaces();
  }

  updateDomSurfaces() {
    if (!this.htmlSurfaces.length) return;
    const rect = this.element.getBoundingClientRect();
    const widthWorld = this.camera.right - this.camera.left;
    const heightWorld = this.camera.top - this.camera.bottom;
    this.htmlSurfaces.forEach(({ node, mesh }) => {
      const bounds = node.getBoundingClientRect();
      const centerX = (bounds.left + bounds.width / 2) - rect.left;
      const centerY = (bounds.top + bounds.height / 2) - rect.top;
      const normalizedX = clamp(centerX / rect.width, 0, 1);
      const normalizedY = clamp(centerY / rect.height, 0, 1);
      mesh.position.set(
        this.camera.left + widthWorld * normalizedX,
        this.camera.top - heightWorld * normalizedY,
        mesh.position.z
      );
      mesh.scale.set(
        (bounds.width / rect.width) * widthWorld,
        (bounds.height / rect.height) * heightWorld,
        1
      );
    });
  }

  updateCursorMesh() {
    if (!this.cursorMesh) return;
    const widthWorld = this.camera.right - this.camera.left;
    const heightWorld = this.camera.top - this.camera.bottom;
    const x = this.camera.left + widthWorld * this.pointer.x;
    const y = this.camera.bottom + heightWorld * this.pointer.y;
    this.cursorMesh.position.set(x, y, 4 + Math.sin(this.clock.elapsedTime * 1.2) * 0.8);
  }

  triggerPulse(intensity = 1.0) {
    this.pointerStrength = Math.max(this.pointerStrength, intensity);
  }

  updateParticles(elapsed) {
    if (!this.particles) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.particles.count; i += 1) {
      this.particles.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.position.z += Math.sin(elapsed * 0.3 + i * 0.3) * 0.005;
      dummy.position.y += Math.cos(elapsed * 0.2 + i) * 0.002;
      dummy.rotation.z += 0.0008;
      dummy.updateMatrix();
      this.particles.setMatrixAt(i, dummy.matrix);
    }
    this.particles.instanceMatrix.needsUpdate = true;
  }

  updatePerformance(delta) {
    if (this.performanceSamples.length >= MAX_FPS_SAMPLES) {
      this.performanceSamples.shift();
    }
    this.performanceSamples.push(delta);
    if (this.performanceSamples.length < MAX_FPS_SAMPLES) return;
    const averageDelta = this.performanceSamples.reduce((sum, value) => sum + value, 0) / this.performanceSamples.length;
    const fps = 1 / averageDelta;
    if (!this.lowPowerMode && fps < PERFORMANCE_THRESHOLD) {
      this.lowPowerMode = true;
      if (this.composer) {
        this.composer.setPixelRatio(0.75);
      }
      if (this.uniforms?.u_causticIntensity) {
        this.uniforms.u_causticIntensity.value *= 0.4;
      }
      if (this.bloomEffect) {
        this.bloomEffect.intensity *= 0.6;
      }
      if (this.uniforms?.u_waveAmplitude) {
        this.uniforms.u_waveAmplitude.value *= 0.8;
      }
      console.info('[LiquidRenderer] Low power mode activated');
    }
  }

  render() {
    if (!this.renderer || !this.scene || !this.camera) return;

    const delta = this.clock.getDelta();
    const elapsed = this.clock.elapsedTime;
    this.updatePerformance(delta);

    const audioLevel = this.audio.update();
    this.uniforms.u_audioLevel.value = lerp(this.uniforms.u_audioLevel.value, audioLevel, 0.2);
    this.uniforms.u_time.value = elapsed;
    this.uniforms.u_mouseStrength.value = lerp(this.uniforms.u_mouseStrength.value, this.pointerStrength, 0.18);
    this.pointerStrength *= 0.94;
    this.scrollValue = lerp(this.scrollValue, this.scrollTarget, 0.12);
    this.uniforms.u_scroll.value = this.scrollValue;

    if (this.scene.fog) {
      this.scene.fog.density = 0.03 + Math.sin(elapsed * 0.12) * 0.006;
    }

    this.updateCursorMesh();
    this.updateParticles(elapsed);

    this.htmlSurfaces.forEach(({ uniforms }, index) => {
      uniforms.u_time.value = elapsed + index * 0.3;
      uniforms.u_mouse.value.copy(this.pointer);
      uniforms.u_mouseStrength.value = this.uniforms.u_mouseStrength.value * 0.7;
      uniforms.u_audioLevel.value = this.uniforms.u_audioLevel.value * 1.2;
      uniforms.u_scroll.value = this.scrollValue;
    });

    if (this.composer) {
      this.composer.render(delta);
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.animationId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    this.unbindEvents();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.webgpuRenderer) {
      this.webgpuRenderer.dispose();
      this.webgpuRenderer = null;
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.scene = null;
    this.htmlSurfaces = [];
  }

  fallback(reason) {
    this.destroy();
    this.element.dataset.liquidFallback = reason || 'unknown';
    this.element.setAttribute('data-liquid-fallback', '');
    this.element.classList.add('fake-glass');
    const halo = document.createElement('div');
    halo.className = 'fake-glass-halo';
    this.element.appendChild(halo);
  }
}

const DEFAULT_CONFIG = {
  thickness: 0.38,
  refractIndex: 1.32,
  reflectivity: 0.42,
  ambientStrength: 0.72,
  glowColor: '#6bd7ff',
  distortion: 0.85,
  waveAmplitude: 1.2,
  waveSpeed: 0.45,
  lightIntensity: 1.1,
  bloomIntensity: 1.1,
  causticIntensity: 1.25,
  particleCount: 180,
  particleColor: '#7a9bff'
};

const LiquidRenderer = {
  defaults: { ...DEFAULT_CONFIG },
  instances: new Map(),
  async createForElement(element, overrides = {}) {
    if (!element) return null;
    if (this.instances.has(element)) return this.instances.get(element);
    if (!this.isSupported()) {
      element.classList.add('fake-glass');
      element.setAttribute('data-liquid-fallback', 'unsupported');
      return null;
    }
    try {
      const shaders = await ShaderCache.load();
      const config = { ...this.defaults, ...overrides };
      const scene = new GlassScene(element, config, shaders);
      const success = await scene.init();
      if (!success) return null;
      this.instances.set(element, scene);
      return scene;
    } catch (error) {
      console.error('[LiquidRenderer] Initialization failed', error);
      element.classList.add('fake-glass');
      element.setAttribute('data-liquid-fallback', 'init-error');
      return null;
    }
  },
  initAll(root = document) {
    const nodes = Array.from(root.querySelectorAll('[data-liquid-renderer]'));
    return Promise.all(nodes.map((node) => this.createForElement(node)));
  },
  destroyAll() {
    this.instances.forEach((scene) => scene.destroy());
    this.instances.clear();
  },
  configure(overrides = {}) {
    Object.assign(this.defaults, overrides);
    this.instances.forEach((scene) => {
      Object.assign(scene.config, overrides);
     if (scene.uniforms) {
       if (overrides.thickness) scene.uniforms.u_thickness.value = overrides.thickness;
       if (overrides.refractIndex) scene.uniforms.u_refractIndex.value = overrides.refractIndex;
       if (overrides.reflectivity) scene.uniforms.u_reflectivity.value = overrides.reflectivity;
       if (overrides.ambientStrength) scene.uniforms.u_ambientStrength.value = overrides.ambientStrength;
       if (overrides.glowColor) {
         scene.uniforms.u_glowColor.value.set(overrides.glowColor);
         if (scene.cursorMesh?.material?.color) {
           scene.cursorMesh.material.color.set(overrides.glowColor);
         }
       }
       if (overrides.distortion) scene.uniforms.u_distortion.value = overrides.distortion;
       if (overrides.waveAmplitude) scene.uniforms.u_waveAmplitude.value = overrides.waveAmplitude;
       if (overrides.waveSpeed) scene.uniforms.u_waveSpeed.value = overrides.waveSpeed;
        if (overrides.causticIntensity) scene.uniforms.u_causticIntensity.value = overrides.causticIntensity;
        if (overrides.bloomIntensity && scene.bloomEffect) {
          scene.bloomEffect.intensity = overrides.bloomIntensity;
        }
      }
      if (scene.htmlSurfaces?.length) {
        scene.htmlSurfaces.forEach(({ uniforms }) => {
          if (!uniforms) return;
          if (overrides.thickness) uniforms.u_thickness.value = overrides.thickness * 0.8;
          if (overrides.refractIndex) uniforms.u_refractIndex.value = overrides.refractIndex;
          if (overrides.reflectivity) uniforms.u_reflectivity.value = overrides.reflectivity;
          if (overrides.ambientStrength) uniforms.u_ambientStrength.value = overrides.ambientStrength;
          if (overrides.glowColor) uniforms.u_glowColor.value.set(overrides.glowColor);
          if (overrides.distortion) uniforms.u_distortion.value = overrides.distortion * 0.65;
          if (overrides.waveAmplitude) uniforms.u_waveAmplitude.value = overrides.waveAmplitude * 0.65;
          if (overrides.waveSpeed) uniforms.u_waveSpeed.value = overrides.waveSpeed;
          if (overrides.causticIntensity) uniforms.u_causticIntensity.value = overrides.causticIntensity;
        });
      }
    });
  },
  triggerWave(intensity = 1.0) {
    this.instances.forEach((scene) => scene.triggerPulse(intensity));
  },
  isSupported() {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    return Boolean(gl2);
  },
  getWebGPUSupport() {
    return Boolean(WebGPURendererModule);
  }
};

window.LiquidRenderer = LiquidRenderer;
export default LiquidRenderer;
