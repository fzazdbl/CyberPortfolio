const THEME_STORAGE_KEY = 'theme';
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const prefersDark = mediaQuery.matches;
const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : prefersDark ? 'dark' : 'light';

document.documentElement.setAttribute('data-theme', initialTheme);

class ThemeController {
  constructor() {
    this.currentTheme = initialTheme;
    this.toggleButton = null;
  }

  init() {
    this.toggleButton = document.querySelector('.theme-toggle');
    if (!this.toggleButton) {
      return;
    }

    this.updateToggleState();
    this.toggleButton.addEventListener('click', () => this.handleToggle());
    mediaQuery.addEventListener('change', (event) => this.handleSystemPreference(event));
  }

  handleToggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme, true);
  }

  handleSystemPreference(event) {
    const hasStoredPreference = localStorage.getItem(THEME_STORAGE_KEY) !== null;
    if (hasStoredPreference) {
      return;
    }
    this.applyTheme(event.matches ? 'dark' : 'light', false);
  }

  applyTheme(theme, persist) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    this.updateToggleState();
  }

  updateToggleState() {
    if (!this.toggleButton) {
      return;
    }
    const label = this.currentTheme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre';
    this.toggleButton.setAttribute('aria-label', label);
    this.toggleButton.setAttribute('title', label);
    this.toggleButton.setAttribute('aria-pressed', this.currentTheme === 'dark');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const controller = new ThemeController();
  controller.init();
  window.themeController = controller;
});
