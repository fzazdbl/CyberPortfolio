// Validation côté client pour les formulaires
class FormValidator {
  constructor() {
    this.init();
  }

  init() {
    this.setupContactForm();
    this.setupAdminForm();
  }

  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      nom: {
        element: document.getElementById('nom'),
        error: document.getElementById('nom-error'),
        rules: [
          { test: (value) => value.length >= 2, message: 'Le nom doit contenir au moins 2 caractères' },
          { test: (value) => value.length <= 50, message: 'Le nom ne peut pas dépasser 50 caractères' },
          { test: (value) => /^[a-zA-ZÀ-ÿ\s\-']+$/.test(value), message: 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes' }
        ]
      },
      email: {
        element: document.getElementById('email'),
        error: document.getElementById('email-error'),
        rules: [
          { test: (value) => value.length > 0, message: 'L\'email est requis' },
          { test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Format d\'email invalide' }
        ]
      },
      message: {
        element: document.getElementById('message'),
        error: document.getElementById('message-error'),
        rules: [
          { test: (value) => value.length >= 10, message: 'Le message doit contenir au moins 10 caractères' },
          { test: (value) => value.length <= 1000, message: 'Le message ne peut pas dépasser 1000 caractères' }
        ]
      }
    };

    // Compteur de caractères pour le message
    const charCount = document.getElementById('char-count');
    if (charCount && fields.message.element) {
      fields.message.element.addEventListener('input', () => {
        const count = fields.message.element.value.length;
        charCount.textContent = count;
        charCount.style.color = count > 1000 ? '#f72585' : '#5de4ff';
      });
    }

    // Validation en temps réel
    Object.entries(fields).forEach(([fieldName, field]) => {
      if (!field.element || !field.error) return;

      field.element.addEventListener('blur', () => this.validateField(fieldName, field));
      field.element.addEventListener('input', () => this.clearError(field));
    });

    // Validation à la soumission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      Object.entries(fields).forEach(([fieldName, field]) => {
        if (!this.validateField(fieldName, field)) {
          isValid = false;
        }
      });

      if (isValid) {
        this.submitForm(form);
      }
    });
  }

  setupAdminForm() {
    const form = document.getElementById('contentForm');
    if (!form) return;

    // Validation des champs requis
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
      field.addEventListener('blur', () => this.validateRequiredField(field));
    });

    form.addEventListener('submit', (e) => {
      let isValid = true;
      requiredFields.forEach(field => {
        if (!this.validateRequiredField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        this.showNotification('Veuillez remplir tous les champs requis', 'error');
      }
    });
  }

  validateField(fieldName, field) {
    const value = field.element.value.trim();
    let isValid = true;
    let errorMessage = '';

    for (const rule of field.rules) {
      if (!rule.test(value)) {
        isValid = false;
        errorMessage = rule.message;
        break;
      }
    }

    if (isValid) {
      this.clearError(field);
    } else {
      this.showError(field, errorMessage);
    }

    return isValid;
  }

  validateRequiredField(field) {
    const value = field.value.trim();
    const isValid = value.length > 0;
    
    if (isValid) {
      field.classList.remove('error');
    } else {
      field.classList.add('error');
    }
    
    return isValid;
  }

  showError(field, message) {
    field.error.textContent = message;
    field.error.style.display = 'block';
    field.element.classList.add('error');
  }

  clearError(field) {
    field.error.textContent = '';
    field.error.style.display = 'none';
    field.element.classList.remove('error');
  }

  async submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Récupération du token CSRF
    const csrfToken = await this.getCSRFToken();
    const csrfInput = form.querySelector('#csrf_token');
    if (csrfInput) {
      csrfInput.value = csrfToken;
    }

    // Désactivation du bouton
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi...';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        this.showNotification('Message envoyé avec succès !', 'success');
        form.reset();
        document.getElementById('char-count').textContent = '0';
      } else {
        const errorText = await response.text();
        this.showNotification('Erreur lors de l\'envoi du message', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  async getCSRFToken() {
    try {
      const response = await fetch('traitement.php', {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const text = await response.text();
      const match = text.match(/name="csrf_token" value="([^"]+)"/);
      return match ? match[1] : '';
    } catch (error) {
      console.error('Erreur lors de la récupération du token CSRF:', error);
      return '';
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    // Couleurs selon le type
    const colors = {
      success: '#06d6a0',
      error: '#f72585',
      info: '#00b4d8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animation d'entrée
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Suppression automatique
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  new FormValidator();
});
