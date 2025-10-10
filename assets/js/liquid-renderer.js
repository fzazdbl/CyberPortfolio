(function (window, document) {
  'use strict';

  const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  const PERFORMANCE_SAMPLE_COUNT = 120;
  const LOW_PERFORMANCE_THRESHOLD = 1 / 24;

  function resolveScriptBase() {
    const current = document.currentScript;
    if (current && current.src) {
      return new URL('.', current.src).href;
    }
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const match = scripts.find((script) => /liquid-renderer\.js(?:\?.*)?$/.test(script.src));
    if (match && match.src) {
      return new URL('.', match.src).href;
    }
    return new URL('./assets/js/', window.location.href).href;
  }

  const SCRIPT_BASE = resolveScriptBase();
  const SHADER_BASE = new URL('../shaders/', SCRIPT_BASE).href;

  function loadTextFile(path) {
    return fetch(path, { cache: 'force-cache' }).then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load shader: ${path}`);
      }
      return response.text();
    });
  }

  const ShaderCache = {
    promise: null,
    load() {
      if (!this.promise) {
        const vertexUrl = new URL('glassVertex.glsl', SHADER_BASE).href;
        const fragmentUrl = new URL('glassFragment.glsl', SHADER_BASE).href;
        this.promise = Promise.all([loadTextFile(vertexUrl), loadTextFile(fragmentUrl)]).then(([vertex, fragment]) => ({
          vertex,
          fragment
        }));
      }
      return this.promise;
    }
  };

  function ensureThree() {
    if (window.THREE) {
      return Promise.resolve(window.THREE);
    }
    if (ensureThree.promise) {
      return ensureThree.promise;
    }

    ensureThree.promise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-liquid-three]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.THREE));
        existing.addEventListener('error', () => reject(new Error('Failed to load Three.js')));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js';
      script.async = true;
      script.dataset.liquidThree = 'true';
      script.onload = () => {
        if (window.THREE) {
          resolve(window.THREE);
        } else {
          reject(new Error('Three.js did not expose a global THREE object.'));
        }
      };
      script.onerror = () => reject(new Error('Unable to load Three.js'));
      document.head.appendChild(script);
    });

    return ensureThree.promise.catch((error) => {
      console.warn('[LiquidRenderer] Unable to load Three.js', error);
      throw error;
    });
  }

  function hasWebGL2Support() {
    if (!window.WebGL2RenderingContext) return false;
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2', { depth: false });
      const supported = Boolean(context);
      if (context && typeof context.getParameter === 'function') {
        const maxTextures = context.getParameter(context.MAX_TEXTURE_IMAGE_UNITS) || 0;
        if (maxTextures < 8) {
          return false;
        }
      }
      return supported;
    } catch (error) {
      return false;
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function sanitizeConfig(config) {
    const result = {};
    if (!config || typeof config !== 'object') return result;
    Object.entries(config).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'number' && Number.isNaN(value)) return;
      result[key] = value;
    });
    return result;
  }

  class GlassScene {
    constructor(element, options) {
      this.element = element;
      this.options = { ...options };
      this.instanceId = Math.random().toString(36).slice(2);
      this.canvas = null;
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.clock = null;
      this.animationId = null;
      this.performanceSamples = [];
      this.layers = [];
      this.pointer = { x: 0.5, y: 0.5 };
      this.isActive = false;
      this.ambientColor = null;
      this.ambientLight = null;
      this.directionalLight = null;
      this.secondaryLight = null;
      this.resizeObserver = null;
      this.windowResizeHandler = false;
      this.THREE = null;
      this.tempVector = null;
      this.boundRender = this.render.bind(this);
      this.boundPointerHandler = this.handlePointer.bind(this);
      this.boundResizeHandler = this.handleResize.bind(this);
    }

    async init(resources, THREE) {
      if (!this.element || this.element.dataset.liquidInitialized === 'true') {
        return false;
      }

      this.element.dataset.liquidInitialized = 'true';
      this.element.classList.add('liquid-glass-stage');

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'liquid-renderer-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.canvas.setAttribute('data-liquid-canvas', '');
      this.element.appendChild(this.canvas);

      const context = this.canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        depth: true,
        stencil: false,
        premultipliedAlpha: true,
        powerPreference: 'high-performance'
      });

      if (!context) {
        this.fallback('webgl2-unavailable');
        return false;
      }

      this.THREE = THREE;
      this.tempVector = new THREE.Vector3();

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        context,
        alpha: true,
        antialias: true
      });
      this.renderer.autoClear = true;
      this.renderer.setClearColor(0x000000, 0);
      if (typeof THREE.SRGBColorSpace !== 'undefined' && this.renderer.outputColorSpace !== undefined) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0x080f1f, 6, 24);

      const width = this.element.clientWidth || window.innerWidth;
      const height = this.element.clientHeight || window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 60);
      this.camera.position.set(0, 0, 8.5);

      this.clock = new THREE.Clock();

      this.ambientColor = new THREE.Color(this.options.ambientColor);

      this.ambientLight = new THREE.AmbientLight(0xffffff, this.options.lightIntensity * 0.35);
      this.scene.add(this.ambientLight);

      this.directionalLight = new THREE.DirectionalLight(0xffffff, this.options.lightIntensity);
      this.directionalLight.position.set(-4, 6, 8);
      this.scene.add(this.directionalLight);

      this.secondaryLight = new THREE.DirectionalLight(0x7f5af0, this.options.lightIntensity * 0.55);
      this.secondaryLight.position.set(3, -2, -6);
      this.scene.add(this.secondaryLight);

      const geometry = new THREE.PlaneGeometry(18, 12, 128, 128);
      const templateUniforms = {
        u_time: { value: 0 },
        u_thickness: { value: this.options.thickness },
        u_refractIndex: { value: this.options.refractIndex },
        u_lightIntensity: { value: this.options.lightIntensity },
        u_ambientColor: { value: this.ambientColor.clone() },
        u_distortionScale: { value: this.options.distortionScale }
      };

      const baseMaterial = new THREE.ShaderMaterial({
        vertexShader: resources.vertex,
        fragmentShader: resources.fragment,
        uniforms: templateUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      this.layers = [];
      for (let index = 0; index < 3; index += 1) {
        const material = baseMaterial.clone();
        material.uniforms = THREE.UniformsUtils.clone(baseMaterial.uniforms);
        material.uniforms.u_time.value = Math.random() * 10;
        material.uniforms.u_thickness.value = clamp(
          this.options.thickness * (1 - index * 0.12),
          0.05,
          2
        );
        material.uniforms.u_refractIndex.value = this.options.refractIndex + index * 0.02;
        material.uniforms.u_lightIntensity.value = this.options.lightIntensity * (0.9 + index * 0.08);
        material.uniforms.u_ambientColor.value = this.ambientColor.clone();
        material.uniforms.u_distortionScale.value = this.options.distortionScale * (1 + index * 0.15);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -index * 0.65;
        mesh.rotation.z = (index - 1) * 0.15;
        const scaleOffset = 1 + index * 0.2;
        mesh.scale.set(scaleOffset, scaleOffset, scaleOffset);
        this.scene.add(mesh);
        this.layers.push({ mesh, material });
      }

      this.renderer.setSize(width, height);
      this.observeResize();
      this.bindPointer();

      this.isActive = true;
      this.clock.start();
      this.render();
      return true;
    }

    observeResize() {
      if (typeof ResizeObserver === 'function') {
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.element);
      } else {
        window.addEventListener('resize', this.boundResizeHandler, { passive: true });
        this.windowResizeHandler = true;
      }
    }

    bindPointer() {
      window.addEventListener('pointermove', this.boundPointerHandler, { passive: true });
    }

    handlePointer(event) {
      const bounds = this.element.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      this.pointer.x = x;
      this.pointer.y = y;
    }

    handleResize() {
      if (!this.renderer || !this.camera) return;
      const width = this.element.clientWidth || window.innerWidth;
      const height = this.element.clientHeight || window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    updatePerformance(delta) {
      if (this.performanceSamples.length >= PERFORMANCE_SAMPLE_COUNT) {
        this.performanceSamples.shift();
      }
      this.performanceSamples.push(delta);
      if (this.performanceSamples.length === PERFORMANCE_SAMPLE_COUNT) {
        const average = this.performanceSamples.reduce((sum, value) => sum + value, 0) / PERFORMANCE_SAMPLE_COUNT;
        if (average > LOW_PERFORMANCE_THRESHOLD) {
          this.fallback('low-performance');
        }
      }
    }

    render() {
      if (!this.isActive || !this.renderer || !this.scene || !this.camera) return;

      const delta = this.clock.getDelta();
      const elapsed = this.clock.elapsedTime;
      this.updatePerformance(delta);

      const pointerOffsetX = (this.pointer.x - 0.5) * 6;
      const pointerOffsetY = (this.pointer.y - 0.5) * 4;

      if (this.scene.fog) {
        const fog = this.scene.fog;
        const fogShift = Math.sin(elapsed * 0.25) * 1.5;
        fog.near = 5.5 + fogShift * 0.35;
        fog.far = 20.5 + fogShift;
        fog.color.setHSL(0.62, 0.58, clamp(0.09 + Math.sin(elapsed * 0.18) * 0.04, 0.05, 0.18));
      }

      const primaryTarget = this.tempVector.set(pointerOffsetX * 0.35, 5 + pointerOffsetY * 0.4, 8);
      if (this.directionalLight) {
        this.directionalLight.position.lerp(primaryTarget, 0.08);
        this.directionalLight.intensity = this.options.lightIntensity * (0.9 + Math.sin(elapsed * 0.6) * 0.25);
      }
      if (this.secondaryLight) {
        this.secondaryLight.intensity = this.options.lightIntensity * 0.45 * (0.8 + Math.cos(elapsed * 0.7) * 0.35);
      }
      if (this.ambientLight) {
        this.ambientLight.intensity = this.options.lightIntensity * (0.28 + Math.sin(elapsed * 0.4) * 0.12);
      }

      this.layers.forEach((layer, index) => {
        const time = elapsed + index * 0.45;
        const uniforms = layer.material.uniforms;
        uniforms.u_time.value = time;
        uniforms.u_thickness.value = clamp(
          this.options.thickness * (1 - index * 0.1) + Math.sin(time * 0.32) * 0.02,
          0.04,
          2
        );
        uniforms.u_refractIndex.value = this.options.refractIndex + Math.sin(time * 0.15) * 0.03 + index * 0.02;
        uniforms.u_lightIntensity.value = this.options.lightIntensity * (1 + Math.cos(time * 0.27) * 0.2);
        uniforms.u_distortionScale.value = this.options.distortionScale * (1 + Math.sin(time * 0.5) * 0.25);
        uniforms.u_ambientColor.value.copy(this.ambientColor);

        layer.mesh.position.x = Math.sin(time * 0.26 + index) * 1.1;
        layer.mesh.position.y = Math.cos(time * 0.34 + index * 0.5) * 0.9;
        layer.mesh.rotation.z += 0.0006 + index * 0.0003;
      });

      this.renderer.render(this.scene, this.camera);
      this.animationId = window.requestAnimationFrame(this.boundRender);
    }

    updateConfig(config = {}) {
      const sanitized = sanitizeConfig(config);
      if (!Object.keys(sanitized).length) return;
      Object.assign(this.options, sanitized);
      if (sanitized.ambientColor) {
        this.ambientColor.set(sanitized.ambientColor);
      }
      if (this.directionalLight) {
        this.directionalLight.intensity = this.options.lightIntensity;
      }
      if (this.secondaryLight) {
        this.secondaryLight.intensity = this.options.lightIntensity * 0.55;
      }
      if (this.ambientLight) {
        this.ambientLight.intensity = this.options.lightIntensity * 0.35;
      }
      this.layers.forEach((layer) => {
        const uniforms = layer.material.uniforms;
        uniforms.u_thickness.value = this.options.thickness;
        uniforms.u_refractIndex.value = this.options.refractIndex;
        uniforms.u_lightIntensity.value = this.options.lightIntensity;
        uniforms.u_distortionScale.value = this.options.distortionScale;
        uniforms.u_ambientColor.value.copy(this.ambientColor);
      });
    }

    fallback(reason) {
      console.warn('[LiquidRenderer] Falling back to FakeGlass mode:', reason);
      this.destroy();
      LiquidRenderer.applyFakeGlass(this.element, reason);
      LiquidRenderer.instances.delete(this.element);
    }

    destroy() {
      this.isActive = false;
      if (this.animationId) {
        window.cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      window.removeEventListener('pointermove', this.boundPointerHandler);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.windowResizeHandler) {
        window.removeEventListener('resize', this.boundResizeHandler);
        this.windowResizeHandler = false;
      }
      this.layers.forEach((layer) => {
        this.scene?.remove(layer.mesh);
        layer.material.dispose();
      });
      this.layers = [];
      if (this.renderer) {
        this.renderer.dispose();
        this.renderer = null;
      }
      if (this.canvas) {
        this.canvas.remove();
        this.canvas = null;
      }
      if (this.element) {
        delete this.element.dataset.liquidInitialized;
      }
      this.scene = null;
      this.camera = null;
      this.clock = null;
      this.THREE = null;
      this.tempVector = null;
    }
  }

  const LiquidRenderer = {
    defaults: {
      thickness: 0.38,
      refractIndex: 1.18,
      lightIntensity: 1.1,
      ambientColor: '#19304d',
      distortionScale: 0.55
    },
    instances: new Map(),
    isSupported: hasWebGL2Support,
    configure(overrides = {}) {
      if (!overrides || typeof overrides !== 'object') return;
      const sanitized = sanitizeConfig(overrides);
      if (!Object.keys(sanitized).length) return;
      Object.assign(this.defaults, sanitized);
      this.instances.forEach((scene) => {
        scene.updateConfig(sanitized);
      });
    },
    async createForElement(element, options = {}) {
      if (!element) return null;

      if (this.instances.has(element)) {
        return this.instances.get(element);
      }

      if (!this.isSupported() || PREFERS_REDUCED_MOTION.matches) {
        this.applyFakeGlass(element, 'unsupported');
        return null;
      }

      try {
        const [THREE, shaders] = await Promise.all([ensureThree(), ShaderCache.load()]);
        const sanitizedOptions = sanitizeConfig(options);
        const config = { ...this.defaults, ...sanitizedOptions };
        const scene = new GlassScene(element, config);
        const success = await scene.init(shaders, THREE);
        if (!success) {
          return null;
        }
        this.instances.set(element, scene);
        return scene;
      } catch (error) {
        console.warn('[LiquidRenderer] Unable to initialize WebGL scene:', error);
        this.applyFakeGlass(element, 'initialization-error');
        return null;
      }
    },
    initAll(context = document) {
      const elements = Array.from(context.querySelectorAll('[data-liquid-renderer]'));
      if (!elements.length) return Promise.resolve([]);
      return Promise.all(elements.map((element) => this.createForElement(element)));
    },
    destroyAll() {
      this.instances.forEach((scene) => scene.destroy());
      this.instances.clear();
    },
    applyFakeGlass(element, reason) {
      if (!element) return;
      delete element.dataset.liquidInitialized;
      element.classList.add('fake-glass');
      element.dataset.liquidFallback = reason || 'unknown';
      if (!element.querySelector('.fake-glass-halo')) {
        const halo = document.createElement('div');
        halo.className = 'fake-glass-halo';
        element.appendChild(halo);
      }
    }
  };

  LiquidRenderer.prefersReducedMotion = PREFERS_REDUCED_MOTION;

  window.LiquidRenderer = LiquidRenderer;
})(window, document);
