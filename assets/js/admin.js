(function () {
  const manager = window.PortfolioContentManager;

  function showLoginError(message) {
    const errorNode = document.getElementById('loginError');
    if (!errorNode) return;
    errorNode.textContent = message || '';
  }

  function setStatus(node, message, isError = false) {
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('is-error', Boolean(isError));
  }

  function populateForms() {
    if (!manager) return;
    const content = manager.getContent();
    const theme = manager.getTheme();
    const navigation = content.navigation || {};

    document.querySelectorAll('[data-field-key]').forEach((input) => {
      const key = input.getAttribute('data-field-key');
      if (!key) return;
      const value = content.fields[key];
      if (typeof value === 'undefined') return;
      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        input.value = value;
      }
    });

    document.querySelectorAll('[data-link-key]').forEach((input) => {
      const key = input.getAttribute('data-link-key');
      if (!key) return;
      const value = content.links[key];
      if (typeof value === 'undefined') return;
      input.value = value;
    });

    document.querySelectorAll('[data-theme-var]').forEach((input) => {
      const variable = input.getAttribute('data-theme-var');
      if (!variable) return;
      const value = theme[variable];
      if (!value) return;
      input.value = value;
    });

    document.querySelectorAll('[data-nav-label]').forEach((input) => {
      const key = input.getAttribute('data-nav-label');
      if (!key) return;
      const item = navigation[key];
      if (!item || typeof item.label === 'undefined') return;
      input.value = item.label;
    });

    document.querySelectorAll('[data-nav-href]').forEach((input) => {
      const key = input.getAttribute('data-nav-href');
      if (!key) return;
      const item = navigation[key];
      if (!item || typeof item.href === 'undefined') return;
      input.value = item.href;
    });
  }

  function collectFormData() {
    const fields = {};
    const links = {};
    const theme = {};
    const navigation = {};

    document.querySelectorAll('[data-field-key]').forEach((input) => {
      const key = input.getAttribute('data-field-key');
      if (!key) return;
      const value = input.value.trim();
      if (value.length) {
        fields[key] = value;
      }
    });

    document.querySelectorAll('[data-link-key]').forEach((input) => {
      const key = input.getAttribute('data-link-key');
      if (!key) return;
      const value = input.value.trim();
      if (value.length) {
        links[key] = value;
      }
    });

    document.querySelectorAll('[data-theme-var]').forEach((input) => {
      const variable = input.getAttribute('data-theme-var');
      if (!variable) return;
      const value = input.value.trim();
      if (value.length) {
        theme[variable] = value;
      }
    });

    document.querySelectorAll('[data-nav-label]').forEach((input) => {
      const key = input.getAttribute('data-nav-label');
      if (!key) return;
      const value = input.value.trim();
      if (!navigation[key]) navigation[key] = {};
      if (value.length) {
        navigation[key].label = value;
      }
    });

    document.querySelectorAll('[data-nav-href]').forEach((input) => {
      const key = input.getAttribute('data-nav-href');
      if (!key) return;
      const value = input.value.trim();
      if (!navigation[key]) navigation[key] = {};
      if (value.length) {
        navigation[key].href = value;
      }
    });

    return { fields, links, theme, navigation };
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!manager) {
      showLoginError('Gestionnaire de contenu indisponible.');
      return;
    }

    manager.applyTheme(document);

    const loginPanel = document.getElementById('loginPanel');
    const dashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('adminLoginForm');
    const logoutButton = document.getElementById('adminLogout');
    const contentForm = document.getElementById('contentForm');
    const passwordForm = document.getElementById('passwordForm');
    const contentStatus = document.getElementById('contentStatus');
    const passwordStatus = document.getElementById('passwordStatus');
    const storageEnabled = manager.isStorageEnabled();

    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showLoginError('');
        const passwordInput = document.getElementById('adminPassword');
        const value = passwordInput ? passwordInput.value : '';
        if (!value) {
          showLoginError('Merci de saisir le mot de passe.');
          return;
        }

        if (value !== manager.getPassword()) {
          showLoginError('Mot de passe incorrect.');
          return;
        }

        if (loginPanel) {
          loginPanel.setAttribute('hidden', '');
        }
        if (dashboard) {
          dashboard.removeAttribute('hidden');
        }
        populateForms();
<<<<<<< HEAD
=======
        populateGpuControls(gpuPanel, gpuSettings);
>>>>>>> 94d93fcf53c33038c5750ebee58bddab46bf0ff1
        setStatus(contentStatus, storageEnabled ? '' : 'Le stockage local est indisponible : les modifications seront temporaires.', !storageEnabled);
        if (passwordInput) {
          passwordInput.value = '';
        }
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        if (dashboard) {
          dashboard.setAttribute('hidden', '');
        }
        if (loginPanel) {
          loginPanel.removeAttribute('hidden');
        }
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
      });
    }

    if (contentForm) {
      contentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!manager) return;
        const { fields, links, theme, navigation } = collectFormData();

        try {
          manager.saveContent({ fields, links, navigation });
          manager.saveTheme(theme);
          manager.applyTheme(document);
          setStatus(contentStatus, 'Modifications enregistrées.');
        } catch (error) {
          setStatus(contentStatus, 'Impossible d\'enregistrer les modifications.', true);
        }
      });
    }

<<<<<<< HEAD
=======
    if (gpuPanel) {
      populateGpuControls(gpuPanel, gpuSettings);
      const updateGpuSetting = (event) => {
        const target = event.currentTarget;
        const key = target.getAttribute('data-gpu-setting');
        if (!key) return;
        let value = target.value;
        if (target.type === 'range' || target.type === 'number') {
          value = parseFloat(value);
          if (Number.isNaN(value)) return;
          const display = target.parentElement?.querySelector('[data-gpu-value]');
          if (display) display.textContent = value.toFixed(2);
        } else if (target.type === 'color') {
          const preview = gpuPanel.querySelector('[data-gpu-color-preview]');
          if (preview) preview.style.background = value;
        }
        gpuSettings[key] = value;
        const merged = manager.saveGpuSettings(gpuSettings);
        Object.assign(gpuSettings, merged);
      };

      gpuPanel.querySelectorAll('[data-gpu-setting]').forEach((input) => {
        input.addEventListener('input', updateGpuSetting);
        input.addEventListener('change', updateGpuSetting);
      });
    }

>>>>>>> 94d93fcf53c33038c5750ebee58bddab46bf0ff1
    if (passwordForm) {
      passwordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!manager) return;
        setStatus(passwordStatus, '');
        const newPassword = (document.getElementById('newPassword') || {}).value || '';
        const confirmPassword = (document.getElementById('confirmPassword') || {}).value || '';

        if (newPassword.length < 6) {
          setStatus(passwordStatus, 'Le mot de passe doit contenir au moins 6 caractères.', true);
          return;
        }

        if (newPassword !== confirmPassword) {
          setStatus(passwordStatus, 'Les mots de passe ne correspondent pas.', true);
          return;
        }

        if (!manager.isStorageEnabled()) {
          setStatus(passwordStatus, 'Stockage local indisponible : impossible de sauvegarder.', true);
          return;
        }

        manager.setPassword(newPassword);
        setStatus(passwordStatus, 'Mot de passe mis à jour.');
        const newInput = document.getElementById('newPassword');
        const confirmInput = document.getElementById('confirmPassword');
        if (newInput) newInput.value = '';
        if (confirmInput) confirmInput.value = '';
      });
    }
  });
})();
