// Gestion du mode sombre/clair
class DarkModeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupToggle();
    this.setupSystemPreference();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  setupToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme();
      this.updateToggleIcon();
    });

    this.updateToggleIcon();
  }

  updateToggleIcon() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const moon = toggle.querySelector('.fa-moon');
    const sun = toggle.querySelector('.fa-sun');

    if (this.theme === 'light') {
      moon?.style.setProperty('opacity', '0');
      sun?.style.setProperty('opacity', '1');
    } else {
      moon?.style.setProperty('opacity', '1');
      sun?.style.setProperty('opacity', '0');
    }
  }

  setupSystemPreference() {
    // Détecter le changement de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (localStorage.getItem('theme') === null) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
        this.updateToggleIcon();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Appliquer la préférence système si aucun thème n'est sauvegardé
    if (localStorage.getItem('theme') === null) {
      this.theme = mediaQuery.matches ? 'dark' : 'light';
      this.applyTheme();
      this.updateToggleIcon();
    }
  }

  getCurrentTheme() {
    return this.theme;
  }

  setTheme(theme) {
    if (['dark', 'light'].includes(theme)) {
      this.theme = theme;
      this.applyTheme();
      this.updateToggleIcon();
    }
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.darkModeManager = new DarkModeManager();
});
