/* main.js — Interactions pour le thème Liquid Glass iOS26
   - transitions de page et animations d'apparition
   - gestion du menu glass et du ripple sur les boutons
   - effets contextuels (pointage héro)
*/

(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Transition d'entrée
  root.classList.add('page-enter');
  window.addEventListener('DOMContentLoaded', () => {
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
