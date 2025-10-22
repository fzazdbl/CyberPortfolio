// Animations de scroll reveal et entrée
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupCardAnimations();
    this.setupParallaxEffects();
  }

  setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
      observer.observe(reveal);
    });
  }

  setupCardAnimations() {
    const cards = document.querySelectorAll('.glass-card');
    if (!cards.length) return;

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('card-enter');
          }, index * 100); // Délai échelonné
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    cards.forEach(card => {
      cardObserver.observe(card);
    });
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    // Throttle pour les performances
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
  }
}

// CSS pour les animations
const animationStyles = `
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
  }

  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .glass-card {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    transition: all 0.5s cubic-bezier(0.2, 0.9, 0.3, 1);
  }

  .glass-card.card-enter {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .hero {
    opacity: 0;
    transform: translateY(40px);
    animation: heroEnter 1s cubic-bezier(0.2, 0.9, 0.3, 1) 0.3s forwards;
  }

  @keyframes heroEnter {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .floating-particles .particle {
    animation: particleFloat 8s ease-in-out infinite;
  }

  .floating-particles .particle:nth-child(2) {
    animation-delay: -2s;
  }

  .floating-particles .particle:nth-child(3) {
    animation-delay: -4s;
  }

  .floating-particles .particle:nth-child(4) {
    animation-delay: -6s;
  }

  .floating-particles .particle:nth-child(5) {
    animation-delay: -8s;
  }

  @keyframes particleFloat {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.7;
    }
    25% {
      transform: translateY(-20px) rotate(90deg);
      opacity: 1;
    }
    50% {
      transform: translateY(-10px) rotate(180deg);
      opacity: 0.8;
    }
    75% {
      transform: translateY(-30px) rotate(270deg);
      opacity: 0.9;
    }
  }

  .cyber-grid {
    animation: gridMove 20s linear infinite;
  }

  @keyframes gridMove {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }

  /* Animations d'entrée pour les icônes */
  .skill-icon,
  .project-icon,
  .learning-icon {
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
  }

  .glass-card.card-enter .skill-icon,
  .glass-card.card-enter .project-icon,
  .glass-card.card-enter .learning-icon {
    opacity: 1;
    transform: scale(1);
  }

  /* Animation de hover pour les cartes */
  .glass-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 180, 216, 0.2);
  }

  /* Animation de chargement pour les boutons */
  .button {
    position: relative;
    overflow: hidden;
  }

  .button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .button:hover::before {
    left: 100%;
  }
`;

// Injection des styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
});
