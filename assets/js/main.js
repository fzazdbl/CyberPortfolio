/* main.js — Interactions pour le thème glass sombre
   - transitions de page et animations d'apparition
   - gestion du menu glass et du ripple sur les boutons
   - effets contextuels (pointage héro) et formulaires
*/

(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Transition d'entrée
  root.classList.add('page-enter');
  window.addEventListener('DOMContentLoaded', () => {
    const manager = window.PortfolioContentManager;
    if (manager) {
      manager.applyTheme(document);
      manager.applyContent(document);
    }

    requestAnimationFrame(() => root.classList.add('page-enter-ready'));
    const header = document.querySelector('.site-header');
    if (header) {
      requestAnimationFrame(() => header.classList.add('is-visible'));
    }
  });

  // Navigation douce entre les pages internes
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-link]');
    if (!link) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || link.target === '_blank') return;

    event.preventDefault();
    const href = link.getAttribute('href');
    if (!href) return;

    root.classList.add('page-exit');
    setTimeout(() => {
      window.location.href = href;
    }, 360);
  });

  // Activer l'état actif du menu selon la page
  const currentPage = document.body?.dataset?.page;
  if (currentPage) {
    document.querySelectorAll('.nav-link[data-target]').forEach((navLink) => {
      if (navLink.dataset.target === currentPage) {
        navLink.classList.add('is-active');
      }
    });
  }

  // Animation reveal pour les sections
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (!reveals.length) return;

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    reveals.forEach((section) => observer.observe(section));
  } else {
    reveals.forEach((section) => section.classList.add('is-visible'));
  }
})();

// Ripple & interactions contextuelles
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('pointerdown', (event) => {
    const target = event.target.closest('.ripple, .button');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height) * 1.6;

    Object.assign(span.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${event.clientX - rect.left - size / 2}px`,
      top: `${event.clientY - rect.top - size / 2}px`,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.18)',
      transform: 'scale(0)',
      pointerEvents: 'none',
      opacity: '0.7',
      transition: reducedMotion
        ? 'opacity 220ms ease'
        : 'transform 460ms cubic-bezier(.2,.9,.3,1), opacity 520ms ease'
    });

    target.style.position = target.style.position || 'relative';
    target.appendChild(span);

    requestAnimationFrame(() => {
      if (!reducedMotion) span.style.transform = 'scale(1)';
      span.style.opacity = '0';
    });

    setTimeout(() => span.remove(), reducedMotion ? 240 : 520);
  });

  if (reducedMotion) return;

  // Highlight dynamique sur les sections "hero"
  document.querySelectorAll('.hero').forEach((section) => {
    let pointerX = 50;
    let pointerY = 50;

    const update = (event) => {
      const rect = section.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 100;
      pointerY = ((event.clientY - rect.top) / rect.height) * 100;
      section.style.setProperty('--pointer-x', `${pointerX}%`);
      section.style.setProperty('--pointer-y', `${pointerY}%`);
    };

    section.addEventListener('pointermove', update);
    section.addEventListener('pointerleave', () => {
      section.style.setProperty('--pointer-x', '50%');
      section.style.setProperty('--pointer-y', '50%');
    });
  });
})();

// Formulaire de contact avec retour visuel
(() => {
  const manager = window.PortfolioContentManager;

  window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const statusNode = form.querySelector('.form-status');
    const successText = statusNode?.textContent?.trim() ||
      manager?.getContent().fields['contact.successMessage'] ||
      '✅ Message envoyé !';

    const defaultButtonLabel = submitButton?.textContent?.trim() || 'Envoyer';

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!submitButton) {
        form.submit();
        return;
      }

      const formData = new FormData(form);
      const endpoint = form.getAttribute('action') || form.dataset.endpoint || 'contact.php';

      submitButton.disabled = true;
      submitButton.classList.remove('button--success');
      submitButton.textContent = 'Envoi...';

      if (statusNode) {
        statusNode.classList.remove('is-visible', 'is-error');
        statusNode.textContent = 'Envoi en cours...';
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (!response.ok) {
          throw new Error('Une erreur est survenue.');
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (error) {
          // PHP peut renvoyer un JSON simple, sinon on considère le succès.
        }

        if (payload && payload.success === false) {
          throw new Error(payload.message || 'Échec de l\'envoi.');
        }

        form.reset();
        submitButton.classList.add('button--success');
        submitButton.textContent = 'Envoyé';
        if (statusNode) {
          statusNode.textContent = successText;
          statusNode.classList.add('is-visible');
        }
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonLabel;
          submitButton.classList.remove('button--success');
        }, 2400);
      } catch (error) {
        if (statusNode) {
          statusNode.textContent = error.message || 'Impossible d\'envoyer le message. Contactez-moi par e-mail.';
          statusNode.classList.add('is-visible', 'is-error');
        }
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonLabel;

        const fallbackMail = manager?.getContent().links.email || form.dataset.mailto;
        if (fallbackMail) {
          const params = new URLSearchParams({
            subject: `Message de ${formData.get('nom') || 'Portfolio'}`,
            body: `Email: ${formData.get('email') || 'non fourni'}\n\n${formData.get('message') || ''}`
          });
          window.open(`${fallbackMail}?${params.toString()}`, '_blank');
        }
      }
    });
  });
})();
