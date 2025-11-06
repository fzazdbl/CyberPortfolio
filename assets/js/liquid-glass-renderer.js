(function (window) {
  const doc = document;
  const supportsBackdrop = typeof CSS !== 'undefined' && CSS.supports('backdrop-filter: blur(1px)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Vérifier le support WebGL
  function checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  const supportsWebGL = checkWebGLSupport();

  // Afficher un message si WebGL n'est pas supporté
  if (!supportsWebGL) {
    console.warn('WebGL non supporté. Les effets de rendu avancés seront désactivés.');
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  class LiquidGlassRenderer {
    constructor(root, options = {}) {
      this.root = root;
      this.options = Object.assign(
        {
          layers: 3,
          intensity: parseFloat(root.dataset.liquidIntensity || options.intensity || 1),
          speed: parseFloat(root.dataset.liquidSpeed || options.speed || 0.35),
          mobileStatic: root.dataset.liquidMobile !== 'dynamic',
          pointerLight: root.dataset.liquidPointer !== 'off'
        },
        options
      );

      this.layers = [];
      this.frame = null;
      this.time = 0;
      this.lastTime = 0;
      this.pointer = { x: 0.5, y: 0.5 };
      this.boundAnimate = this.animate.bind(this);
      this.isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      this.prefersReducedMotion = prefersReducedMotion.matches;
      this.isActive = false;
    }

    init() {
      if (!this.root || this.root.dataset.liquidInitialized) return;
      this.root.dataset.liquidInitialized = 'true';
      this.root.classList.add('liquid-glass-stage');

      this.createLayers();
      this.bindEvents();

      if (!this.shouldUseStatic()) {
        this.isActive = true;
        this.start();
      } else {
        this.renderStatic();
      }
    }

    shouldUseStatic() {
      if (this.prefersReducedMotion) return true;
      if (this.isCoarsePointer && this.options.mobileStatic) return true;
      return false;
    }

    createLayers() {
      const fragment = doc.createDocumentFragment();
      const layerCount = Math.max(1, this.options.layers);

      for (let index = 0; index < layerCount; index += 1) {
        const layer = doc.createElement('div');
        layer.className = `liquid-glass-layer liquid-glass-layer--${index + 1}`;
        layer.style.setProperty('--layer-index', index + 1);
        fragment.appendChild(layer);
        this.layers.push(layer);
      }

      const highlight = doc.createElement('div');
      highlight.className = 'liquid-glass-highlight';
      fragment.appendChild(highlight);
      this.highlight = highlight;

      this.root.appendChild(fragment);
    }

    bindEvents() {
      if (!this.options.pointerLight || this.shouldUseStatic()) return;

      const updatePointer = (event) => {
        const rect = this.root.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        this.pointer.x = x;
        this.pointer.y = y;
        this.root.style.setProperty('--lg-pointer-x', `${(x * 100).toFixed(2)}%`);
        this.root.style.setProperty('--lg-pointer-y', `${(y * 100).toFixed(2)}%`);
      };

      this.root.addEventListener('pointermove', updatePointer);
      this.root.addEventListener('pointerleave', () => {
        this.pointer.x = 0.5;
        this.pointer.y = 0.5;
        this.root.style.setProperty('--lg-pointer-x', '50%');
        this.root.style.setProperty('--lg-pointer-y', '50%');
      });
    }

    start() {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.lastTime = window.performance ? window.performance.now() : Date.now();
      this.frame = requestAnimationFrame(this.boundAnimate);
    }

    animate(timestamp) {
      if (!this.isActive) return;
      const now = typeof timestamp === 'number' ? timestamp : (window.performance ? window.performance.now() : Date.now());
      const delta = Math.min(48, Math.max(8, now - this.lastTime || 16));
      this.lastTime = now;
      this.time += (delta / 16.666) * this.options.speed;
      const depth = this.options.intensity;

      this.layers.forEach((layer, index) => {
        const phase = this.time * (0.6 + index * 0.18);
        const sin = Math.sin(phase);
        const cos = Math.cos(phase / 1.4);
        const offsetX = sin * 8 * depth;
        const offsetY = cos * 6 * depth;
        const blur = 12 + index * 4 * depth;
        layer.style.setProperty('--lg-offset-x', `${offsetX.toFixed(2)}px`);
        layer.style.setProperty('--lg-offset-y', `${offsetY.toFixed(2)}px`);
        layer.style.setProperty('--lg-blur', `${blur.toFixed(2)}px`);
        layer.style.setProperty('--lg-opacity', `${clamp(0.35 + sin * 0.15, 0.2, 0.8)}`);
      });

      if (this.highlight) {
        const highlightPhase = this.time * 0.9;
        const hx = (Math.sin(highlightPhase) + 1) / 2;
        const hy = (Math.cos(highlightPhase / 1.4) + 1) / 2;
        this.highlight.style.setProperty('--lg-highlight-x', `${(hx * 100).toFixed(2)}%`);
        this.highlight.style.setProperty('--lg-highlight-y', `${(hy * 100).toFixed(2)}%`);
        this.highlight.style.setProperty('--lg-highlight-strength', `${0.35 + Math.sin(highlightPhase) * 0.1}`);
      }

      this.frame = requestAnimationFrame(this.boundAnimate);
    }

    renderStatic() {
      this.layers.forEach((layer, index) => {
        layer.style.setProperty('--lg-offset-x', `${(index % 2 === 0 ? 6 : -4) * this.options.intensity}px`);
        layer.style.setProperty('--lg-offset-y', `${(index % 2 === 0 ? -3 : 5) * this.options.intensity}px`);
        layer.style.setProperty('--lg-blur', `${14 + index * 4}px`);
        layer.style.setProperty('--lg-opacity', `${0.45 - index * 0.06}`);
      });
      if (this.highlight) {
        this.highlight.style.setProperty('--lg-highlight-x', '60%');
        this.highlight.style.setProperty('--lg-highlight-y', '40%');
        this.highlight.style.setProperty('--lg-highlight-strength', '0.3');
      }
    }

    destroy() {
      this.isActive = false;
      if (this.frame) cancelAnimationFrame(this.frame);
      this.layers.forEach((layer) => layer.remove());
      this.highlight?.remove();
      this.layers = [];
    }

    static initAll(context = doc) {
      const instances = [];
      context.querySelectorAll('[data-liquid-renderer]').forEach((element) => {
        const renderer = new LiquidGlassRenderer(element, {
          intensity: parseFloat(element.dataset.liquidIntensity || '1'),
          speed: parseFloat(element.dataset.liquidSpeed || '0.35')
        });
        renderer.init();
        instances.push(renderer);
      });
      return instances;
    }
  }

  LiquidGlassRenderer.prefersReducedMotion = prefersReducedMotion;
  LiquidGlassRenderer.supportsBackdrop = supportsBackdrop;
  LiquidGlassRenderer.prototype.prefersReducedMotion = prefersReducedMotion.matches;

  window.LiquidGlassRenderer = LiquidGlassRenderer;
})(window);
