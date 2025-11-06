// Système d'administration amélioré pour le CyberPortfolio
class AdminManager {
  constructor() {
    this.contentData = null;
    this.isAuthenticated = false;
    this.init();
  }

  async init() {
    await this.loadContentData();
    this.setupEventListeners();
    this.checkAuthentication();
  }

  async loadContentData() {
    try {
      const response = await fetch('assets/data/content.json');
      this.contentData = await response.json();
      this.populateForm();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.showStatus('Erreur lors du chargement des données', 'error');
    }
  }

  setupEventListeners() {
    // Formulaire de connexion
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Formulaire de contenu
    const contentForm = document.getElementById('contentForm');
    if (contentForm) {
      contentForm.addEventListener('submit', (e) => this.handleContentSave(e));
    }

    // Formulaire de mot de passe
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
    }

    // Bouton de déconnexion
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Changement de couleurs en temps réel
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
      input.addEventListener('input', (e) => this.updateThemeColor(e));
    });
  }

  checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminAuthenticated') === 'true';
    if (isLoggedIn) {
      this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  handleLogin(e) {
    e.preventDefault();
    // Note: This method is deprecated - authentication is now handled server-side
    // Redirect to PHP login page
    window.location.href = '/login.php';
  }

  handleContentSave(e) {
    e.preventDefault();
    
    if (!this.isAuthenticated) {
      this.showStatus('Vous devez être connecté', 'error');
      return;
    }

    // Collecter toutes les données du formulaire
    const formData = new FormData(e.target);
    const updatedData = { ...this.contentData };

    // Mettre à jour les données
    for (const [key, value] of formData.entries()) {
      this.updateNestedProperty(updatedData, key, value);
    }

    // Sauvegarder
    this.saveContentData(updatedData);
  }

  handlePasswordChange(e) {
    e.preventDefault();
    
    if (!this.isAuthenticated) {
      this.showStatus('Vous devez être connecté', 'error');
      return;
    }

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      this.showStatus('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (newPassword.length < 6) {
      this.showStatus('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    // Ici, vous pourriez sauvegarder le nouveau mot de passe
    this.showStatus('Mot de passe mis à jour !', 'success');
    e.target.reset();
  }

  updateNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  populateForm() {
    if (!this.contentData) return;

    // Remplir tous les champs avec les données
    Object.keys(this.contentData).forEach(section => {
      if (typeof this.contentData[section] === 'object') {
        Object.keys(this.contentData[section]).forEach(key => {
          const field = document.querySelector(`[data-field-key="${section}.${key}"]`);
          if (field) {
            field.value = this.contentData[section][key];
          }
        });
      }
    });

    // Remplir les champs de navigation
    if (this.contentData.navigation) {
      Object.keys(this.contentData.navigation).forEach(navKey => {
        const labelField = document.querySelector(`[data-nav-label="${navKey}"]`);
        const hrefField = document.querySelector(`[data-nav-href="${navKey}"]`);
        
        if (labelField) labelField.value = this.contentData.navigation[navKey].label;
        if (hrefField) hrefField.value = this.contentData.navigation[navKey].href;
      });
    }

    // Remplir les liens sociaux
    if (this.contentData.social) {
      Object.keys(this.contentData.social).forEach(socialKey => {
        const field = document.querySelector(`[data-link-key="${socialKey}"]`);
        if (field) {
          field.value = this.contentData.social[socialKey];
        }
      });
    }
  }

  async saveContentData(data) {
    try {
      // En mode développement, on simule la sauvegarde
      // En production, vous feriez un appel API
      console.log('Données à sauvegarder:', data);
      
      // Mettre à jour les données locales
      this.contentData = data;
      
      // Mettre à jour le localStorage pour la session
      localStorage.setItem('portfolioContent', JSON.stringify(data));
      
      this.showStatus('Contenu sauvegardé avec succès !', 'success');
      
      // Optionnel : recharger la page pour voir les changements
      setTimeout(() => {
        if (confirm('Voulez-vous recharger la page pour voir les changements ?')) {
          window.location.reload();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      this.showStatus('Erreur lors de la sauvegarde', 'error');
    }
  }

  updateThemeColor(e) {
    const colorVar = e.target.getAttribute('data-theme-var');
    const color = e.target.value;
    
    if (colorVar) {
      document.documentElement.style.setProperty(colorVar, color);
    }
  }

  showLogin() {
    document.getElementById('loginPanel').hidden = false;
    document.getElementById('adminDashboard').hidden = true;
  }

  showDashboard() {
    document.getElementById('loginPanel').hidden = true;
    document.getElementById('adminDashboard').hidden = false;
    this.populateForm();
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('adminAuthenticated');
    this.showLogin();
    this.showStatus('Déconnexion réussie', 'success');
  }

  showStatus(message, type = 'info') {
    const statusElement = document.getElementById('contentStatus') || 
                         document.getElementById('passwordStatus') ||
                         document.getElementById('loginError');
    
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `admin-status ${type}`;
      statusElement.style.display = 'block';
      
      // Masquer après 5 secondes
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 5000);
    }
  }
}

// Initialiser l'administrateur quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  new AdminManager();
});

// Fonction utilitaire pour charger le contenu depuis le localStorage
function loadContentFromStorage() {
  const stored = localStorage.getItem('portfolioContent');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erreur lors du parsing du contenu stocké:', error);
    }
  }
  return null;
}

// Fonction pour mettre à jour le contenu des pages
function updatePageContent(contentData) {
  if (!contentData) return;

  // Mettre à jour tous les éléments avec data-content-key
  document.querySelectorAll('[data-content-key]').forEach(element => {
    const key = element.getAttribute('data-content-key');
    const value = getNestedValue(contentData, key);
    if (value) {
      element.textContent = value;
    }
  });

  // Mettre à jour les liens sociaux
  document.querySelectorAll('[data-social-link]').forEach(element => {
    const socialKey = element.getAttribute('data-social-link');
    if (contentData.social && contentData.social[socialKey]) {
      element.href = contentData.social[socialKey];
    }
  });

  // Mettre à jour la navigation
  document.querySelectorAll('[data-nav-key]').forEach(element => {
    const navKey = element.getAttribute('data-nav-key');
    if (contentData.navigation && contentData.navigation[navKey]) {
      element.textContent = contentData.navigation[navKey].label;
      element.href = contentData.navigation[navKey].href;
    }
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Charger le contenu personnalisé au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  const customContent = loadContentFromStorage();
  if (customContent) {
    updatePageContent(customContent);
  }
});
