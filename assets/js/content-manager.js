(function (window) {
  const STORAGE_KEY = 'portfolioContent';
  const THEME_KEY = 'portfolioTheme';
  const PASSWORD_KEY = 'portfolioAdminPassword';
  const DEFAULT_PASSWORD = 'admin123';

  const DEFAULT_CONTENT = {
    fields: {
      'home.heroEyebrow': 'CyberPortfolio',
      'home.heroTitle': 'Sécurité et design au service de vos projets',
      'home.heroSubtitle': "Mohamed, étudiant BTS SIO (SISR), conçoit des environnements fiables, sécurisés et lumineux pour vos plateformes digitales.",
      'home.visionTitle': 'Sécuriser, automatiser et sublimer chaque interface',
      'home.visionText': "J'assemble cybersécurité, scripting et design pour créer des solutions robustes, performantes et élégantes, toujours alignées sur les besoins métier.",
      'home.focusTitle': 'Mes domaines clés',
      'home.ctaTitle': 'Prêt à collaborer ?',
      'home.ctaText': "Contactez-moi pour imaginer des solutions sécurisées ou parcourez mon CV pour découvrir mon parcours.",

      'cv.heroEyebrow': 'Curriculum Vitae',
      'cv.heroTitle': 'Un parcours orienté sécurité et fiabilité',
      'cv.heroSubtitle': "Étudiant du BTS SIO (SISR), je transforme des environnements complexes en solutions stables, documentées et sécurisées.",
      'cv.profileTitle': 'Compétences essentielles',
      'cv.profileText': "Une vision transversale entre infrastructure, cybersécurité et développement pour répondre aux enjeux numériques actuels.",
      'cv.goalsTitle': 'Ce que je recherche',
      'cv.goalsText': "Consolider mes compétences au sein d'une équipe cyber ou infrastructure et contribuer à des interfaces fiables et agréables.",

      'projects.heroEyebrow': 'Mes réalisations',
      'projects.heroTitle': 'Des projets qui fusionnent sécurité et esthétique',
      'projects.heroSubtitle': "Chaque mission combine méthodes cyber, automatisation et interfaces raffinées pour délivrer une expérience cohérente.",
      'projects.recentTitle': 'Projets marquants',
      'projects.devTitle': 'Prototypes & idées en cours',

      'contact.heroEyebrow': 'Contact',
      'contact.heroTitle': 'Échangeons autour de vos besoins numériques',
      'contact.heroSubtitle': "Décrivez votre projet, votre contexte ou vos contraintes : je vous réponds rapidement avec des pistes concrètes.",
      'contact.formTitle': 'Laissez-moi un message',
      'contact.formText': "Expliquez votre situation, vos objectifs et les échéances clés. Je reviens vers vous pour définir la suite.",
      'contact.successMessage': '✅ Message envoyé !'
    },
    links: {
      github: 'https://github.com/fzazdbl',
      linkedin: 'https://www.linkedin.com/in/',
      email: 'mailto:chahidm126@gmail.com'
    }
  };

  const DEFAULT_THEME = {
    '--accent-blue': '#82a5ff',
    '--accent-violet': '#b77bff',
    '--accent-cyan': '#7df0ff'
  };

  function isStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  const storageEnabled = isStorageAvailable();

  function getStoredValue(key) {
    if (!storageEnabled) return null;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function setStoredValue(key, value) {
    if (!storageEnabled) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  function mergeContent(base, override) {
    if (!override) return { ...base };
    return {
      fields: { ...base.fields, ...(override.fields || {}) },
      links: { ...base.links, ...(override.links || {}) }
    };
  }

  function mergeTheme(base, override) {
    if (!override) return { ...base };
    return { ...base, ...override };
  }

  function getContent() {
    const stored = getStoredValue(STORAGE_KEY);
    return mergeContent(DEFAULT_CONTENT, stored);
  }

  function saveContent(content) {
    const merged = mergeContent(DEFAULT_CONTENT, content);
    setStoredValue(STORAGE_KEY, merged);
    return merged;
  }

  function getTheme() {
    const stored = getStoredValue(THEME_KEY);
    return mergeTheme(DEFAULT_THEME, stored);
  }

  function saveTheme(theme) {
    const merged = mergeTheme(DEFAULT_THEME, theme);
    setStoredValue(THEME_KEY, merged);
    return merged;
  }

  function getPassword() {
    if (!storageEnabled) return DEFAULT_PASSWORD;
    return window.localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  }

  function setPassword(newPassword) {
    if (!storageEnabled) return false;
    window.localStorage.setItem(PASSWORD_KEY, newPassword);
    return true;
  }

  function applyContent(doc = document) {
    const content = getContent();
    const { fields, links } = content;

    doc.querySelectorAll('[data-content-key]').forEach((node) => {
      const key = node.getAttribute('data-content-key');
      if (!key) return;
      const value = fields[key];
      if (typeof value === 'undefined') return;
      const type = node.getAttribute('data-content-type');
      if (type === 'html') {
        node.innerHTML = value;
      } else {
        node.textContent = value;
      }
    });

    doc.querySelectorAll('[data-social-link]').forEach((node) => {
      const key = node.getAttribute('data-social-link');
      if (!key) return;
      const value = links[key];
      if (!value) return;
      node.setAttribute('href', value);
    });
  }

  function applyTheme(doc = document) {
    const theme = getTheme();
    const root = doc.documentElement || document.documentElement;
    Object.entries(theme).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  window.PortfolioContentManager = {
    getDefaults: () => ({
      content: clone(DEFAULT_CONTENT),
      theme: clone(DEFAULT_THEME),
      password: DEFAULT_PASSWORD
    }),
    getContent,
    saveContent,
    applyContent,
    getTheme,
    saveTheme,
    applyTheme,
    getPassword,
    setPassword,
    isStorageEnabled: () => storageEnabled
  };
})(window);
