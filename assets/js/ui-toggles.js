(function () {
  // Recreated controllers to keep theme and navigation toggles aligned across breakpoints.
  const STORAGE_KEY = 'theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';
  const html = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let currentTheme = THEME_LIGHT;
  let storedTheme = null;

  const readStoredTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const writeStoredTheme = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Ignore storage errors (private mode, etc.)
    }
  };

  const resolveInitialTheme = () => {
    const saved = readStoredTheme();
    if (saved === THEME_DARK || saved === THEME_LIGHT) {
      return saved;
    }
    return prefersDark.matches ? THEME_DARK : THEME_LIGHT;
  };

  const updateToggleButton = (button) => {
    if (!button) return;
    const label = currentTheme === THEME_DARK ? 'Activer le mode clair' : 'Activer le mode sombre';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', String(currentTheme === THEME_DARK));
    button.dataset.theme = currentTheme;
  };

  const syncAllThemeToggles = () => {
    document.querySelectorAll('.theme-toggle').forEach(updateToggleButton);
  };

  const applyTheme = (theme, persist = true) => {
    if (theme !== THEME_DARK && theme !== THEME_LIGHT) return;
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    if (persist) {
      writeStoredTheme(theme);
      storedTheme = theme;
    }
    syncAllThemeToggles();
  };

  const toggleTheme = () => {
    const nextTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(nextTheme, true);
  };

  const handleSystemChange = (event) => {
    if (storedTheme === THEME_DARK || storedTheme === THEME_LIGHT) {
      return;
    }
    applyTheme(event.matches ? THEME_DARK : THEME_LIGHT, false);
  };

  const handleStorageSync = (event) => {
    if (event.key !== STORAGE_KEY) return;
    const newTheme = event.newValue;
    if (newTheme && newTheme !== currentTheme) {
      storedTheme = newTheme;
      applyTheme(newTheme, false);
    }
  };

  const initThemeController = () => {
    storedTheme = readStoredTheme();
    applyTheme(resolveInitialTheme(), false);
    syncAllThemeToggles();

    document.addEventListener('click', (event) => {
      const toggle = event.target.closest('.theme-toggle');
      if (!toggle) return;
      event.preventDefault();
      toggleTheme();
    });

    prefersDark.addEventListener('change', handleSystemChange);
    window.addEventListener('storage', handleStorageSync);
  };

  class NavController {
    constructor(toggle) {
      this.toggle = toggle;
      this.menuId = toggle.getAttribute('aria-controls');
      this.root = toggle.closest('.liquid-nav') || document.querySelector(`#${this.menuId}`)?.closest('.liquid-nav');
      this.menu = this.menuId ? document.getElementById(this.menuId) : this.root?.querySelector('nav');
      this.overlay = this.root?.querySelector('.liquid-nav__overlay');
      this.mobileQuery = window.matchMedia('(max-width: 960px)');
      this.previouslyFocused = null;
      this.boundKeydown = this.handleKeydown.bind(this);
      this.boundMediaChange = this.handleMediaChange.bind(this);

      this.setup();
    }

    setup() {
      if (!this.menu) return;
      this.setMenuHiddenState(this.mobileQuery.matches);
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.addEventListener('click', () => {
        if (this.isOpen()) {
          this.close();
        } else {
          this.open();
        }
      });

      if (this.overlay) {
        this.overlay.setAttribute('aria-hidden', 'true');
        this.overlay.addEventListener('click', () => this.close());
      }

      this.menu.querySelectorAll('a, button').forEach((interactive) => {
        interactive.addEventListener('click', () => {
          if (window.matchMedia('(max-width: 960px)').matches) {
            this.close();
          }
        });
      });

      this.mobileQuery.addEventListener('change', this.boundMediaChange);
    }

    isOpen() {
      return this.menu.classList.contains('is-open');
    }

    setMenuHiddenState(isHidden) {
      this.menu.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
    }

    getFocusableElements() {
      if (!this.menu) return [];
      const focusableSelector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(',');
      return Array.from(this.menu.querySelectorAll(focusableSelector)).filter((el) =>
        el.offsetParent !== null || el === document.activeElement
      );
    }

    focusFirstElement() {
      const focusable = this.getFocusableElements();
      if (focusable.length) {
        focusable[0].focus({ preventScroll: true });
      } else {
        this.toggle.focus({ preventScroll: true });
      }
    }

    open() {
      if (!this.menu) return;
      this.previouslyFocused = document.activeElement;
      this.menu.classList.add('is-open');
      this.setMenuHiddenState(false);
      this.toggle.setAttribute('aria-expanded', 'true');
      this.toggle.classList.add('is-open');
      this.root?.classList.add('is-expanded');
      this.overlay?.classList.add('is-open');
      this.overlay?.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      document.addEventListener('keydown', this.boundKeydown);
      this.focusFirstElement();
    }

    close(restoreFocus = true) {
      if (!this.menu) return;
      this.menu.classList.remove('is-open');
      this.setMenuHiddenState(this.mobileQuery.matches);
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.classList.remove('is-open');
      this.root?.classList.remove('is-expanded');
      this.overlay?.classList.remove('is-open');
      this.overlay?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      document.removeEventListener('keydown', this.boundKeydown);
      if (restoreFocus) {
        if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
          this.previouslyFocused.focus({ preventScroll: true });
        } else {
          this.toggle.focus({ preventScroll: true });
        }
      }
      this.previouslyFocused = null;
    }

    handleKeydown(event) {
      if (!this.isOpen()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = this.getFocusableElements();
      if (!focusable.length) {
        event.preventDefault();
        this.toggle.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !this.menu.contains(active)) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }

    handleMediaChange(event) {
      if (!event.matches) {
        if (this.isOpen()) {
          this.close(false);
        }
        this.setMenuHiddenState(false);
        return;
      }

      if (!this.isOpen()) {
        this.setMenuHiddenState(true);
      }
    }
  }

  const initNavigationControllers = () => {
    document.querySelectorAll('.nav-toggle').forEach((toggle) => {
      if (!toggle.dataset.navInitialised) {
        toggle.dataset.navInitialised = 'true';
        new NavController(toggle);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initThemeController();
    initNavigationControllers();
  });
})();
