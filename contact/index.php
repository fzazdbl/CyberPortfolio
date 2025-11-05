<?php
/**
 * Page de contact - CyberPortfolio
 * Génère un token CSRF côté serveur pour sécuriser le formulaire
 */
require_once __DIR__ . '/../includes/security.php';

// Générer le token CSRF
$csrfToken = generateCsrfToken();
session_start();
require_once '../includes/security.php';
$csrfToken = generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Contact - Mohamed</title>
  
  <!-- Open Graph -->
  <meta property="og:title" content="Contact - CyberPortfolio Mohamed">
  <meta property="og:description" content="Contactez Mohamed pour échanger autour de vos besoins numériques en cybersécurité et développement web.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://cyberportfolio-mohamed.fr/contact/">
  <meta property="og:image" content="https://cyberportfolio-mohamed.fr/assets/images/og-image.jpg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Contact - CyberPortfolio Mohamed">
  <meta name="twitter:description" content="Contactez Mohamed pour échanger autour de vos besoins numériques en cybersécurité et développement web.">
  <meta name="twitter:image" content="https://cyberportfolio-mohamed.fr/assets/images/og-image.jpg">
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/liquid-glass-renderer.css">
  <link rel="stylesheet" href="../assets/css/theme.css">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/content-manager.js" defer></script>
  <script src="../assets/js/liquid-glass-renderer.js" defer></script>
  <script src="../assets/js/main.js" defer></script>
  <script src="../assets/js/form-validation.js" defer></script>
  <script src="../assets/js/ui-toggles.js" defer></script>
  <script src="../assets/js/scroll-animations.js" defer></script>
  <script src="../assets/js/admin-enhanced.js" defer></script>
</head>
<body data-page="contact">
  <!-- Lien d'évitement pour l'accessibilité -->
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  <div class="liquid-background" data-liquid-renderer data-liquid-intensity="1" data-liquid-speed="0.32"></div>
  
  <!-- Éléments décoratifs -->
  <div class="decorative-elements" aria-hidden="true">
    <div class="cyber-grid"></div>
    <div class="floating-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
  </div>

  <header class="liquid-nav" role="banner">
    <svg class="liquid-nav__filters" aria-hidden="true" focusable="false">
      <defs>
        <filter id="liquid-glass-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="6" result="noise"></feTurbulence>
          <feGaussianBlur in="noise" stdDeviation="0.6" result="blurred"></feGaussianBlur>
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="5" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
        </filter>
      </defs>
    </svg>
    <div class="liquid-nav__overlay" aria-hidden="true"></div>
    <div class="liquid-nav__halo" aria-hidden="true"></div>
    <div class="liquid-nav__brand">
      <div class="brand-logo">
        <img src="../assets/images/logo-cyber.svg" alt="Logo CyberPortfolio" class="brand-logo__img">
        <div class="brand-text">
          <span class="liquid-nav__brand-badge">BTS SIO · SISR</span>
          <p class="liquid-nav__brand-title">CyberPortfolio de Mohamed</p>
        </div>
      </div>
    </div>
    <div class="liquid-nav__controls">
      <button class="theme-toggle" type="button" aria-label="Basculer le thème" title="Basculer entre mode sombre et clair">
        <span class="theme-toggle__thumb" aria-hidden="true"></span>
        <span class="theme-toggle__icon" data-icon="moon" aria-hidden="true">🌙</span>
        <span class="theme-toggle__icon" data-icon="sun" aria-hidden="true">☀️</span>
        <span class="theme-toggle__label">Basculer entre les modes clair et sombre</span>
      </button>
      <button class="liquid-nav__toggle nav-toggle" type="button" aria-expanded="false" aria-controls="primaryNav">Menu</button>
    </div>
    <nav id="primaryNav" class="liquid-nav__menu" aria-label="Navigation principale" data-nav-root="../">
      <a class="liquid-nav__link nav-link" data-nav-key="accueil" data-target="accueil" data-link href="../index.html">
        <i class="fas fa-home"></i> Accueil
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="competences" data-target="competences" data-link href="../competences/index.html">
        <i class="fas fa-code"></i> Compétences
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="projets" data-target="projets" data-link href="../projets/index.html">
        <i class="fas fa-project-diagram"></i> Mes projets
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="projets-interactifs" data-target="projets-interactifs" data-link href="../projets-interactifs/index.html">
        <i class="fas fa-terminal"></i> Projets interactifs
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="contact" data-target="contact" data-link href="index.php">
      <a class="liquid-nav__link nav-link" data-nav-key="contact" data-target="contact" data-link href="./">
        <i class="fas fa-envelope"></i> Contact
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="admin" data-target="admin" data-link href="../admin.php">
        <i class="fas fa-cog"></i> Admin
      </a>
    </nav>
  </header>

  <main id="main-content" class="page-main">
    <div class="contact-backdrop" aria-hidden="true">
      <div class="contact-backdrop__gradient"></div>
      <div class="contact-backdrop__particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <section class="hero reveal" aria-labelledby="contact-title">
      <span class="hero-eyebrow" data-content-key="contact.heroEyebrow">Contact</span>
      <h1 id="contact-title" class="hero-title" data-content-key="contact.heroTitle">Échangeons autour de vos besoins numériques</h1>
      <p class="hero-subtitle" data-content-key="contact.heroSubtitle">Décrivez votre projet, votre contexte ou vos contraintes : je vous réponds rapidement avec des pistes concrètes.</p>
      <div class="hero-actions">
        <a class="button button--primary ripple" href="#contactForm">Remplir le formulaire</a>
        <a class="button button--ghost" data-link href="../projets/index.html">Voir mes réalisations</a>
      </div>
    </section>

    <section class="section reveal" aria-labelledby="form-title">
      <div class="section-header">
        <span class="section-eyebrow">Formulaire</span>
        <h2 id="form-title" class="section-title" data-content-key="contact.formTitle">Laissez-moi un message</h2>
        <p class="section-text" data-content-key="contact.formText">Expliquez votre situation, vos objectifs et les échéances clés. Je reviens vers vous pour définir la suite.</p>
      </div>
      <div class="glass-card form-card">
        <form id="contactForm" class="contact-form" action="traitement.php" method="post">
          <!-- Token CSRF généré côté serveur -->
          <input type="hidden" name="csrf_token" id="csrf_token" value="<?php echo htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8'); ?>">
          
          <!-- Champ honeypot (caché, anti-bot) -->
          <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
          
          <div class="form-row">
            <label for="nom">Nom *</label>
            <input id="nom" class="input-glow" type="text" name="nom" autocomplete="name" required minlength="2" maxlength="50">
        <form id="contactForm" class="contact-form" action="traitement.php" method="post" data-mailto="mailto:chahidm126@gmail.com">
          <!-- Token CSRF -->
          <input type="hidden" name="csrf_token" id="csrf_token" value="<?php echo htmlspecialchars($csrfToken); ?>">
          
          <!-- Honeypot field (hidden from users) -->
          <input type="text" name="website" style="position:absolute;left:-9999px;width:1px;height:1px;" tabindex="-1" autocomplete="off" aria-hidden="true">
          
          <div class="form-row">
            <label for="nom">Nom *</label>
            <input id="nom" class="input-glow" type="text" name="nom" autocomplete="name" required minlength="2" maxlength="50" aria-describedby="nom-error">
            <span class="field-error" id="nom-error"></span>
          </div>
          <div class="form-row">
            <label for="email">Adresse e-mail *</label>
            <input id="email" class="input-glow" type="email" name="email" autocomplete="email" required>
            <input id="email" class="input-glow" type="email" name="email" autocomplete="email" required aria-describedby="email-error">
            <span class="field-error" id="email-error"></span>
          </div>
          <div class="form-row">
            <label for="message">Message *</label>
            <textarea id="message" class="input-glow" name="message" rows="5" required minlength="10" maxlength="1000" placeholder="Décrivez votre projet, vos besoins ou posez vos questions..."></textarea>
            <textarea id="message" class="input-glow" name="message" rows="5" required minlength="10" maxlength="1000" placeholder="Décrivez votre projet, vos besoins ou posez vos questions..." aria-describedby="message-error"></textarea>
            <span class="field-error" id="message-error"></span>
            <div class="char-counter">
              <span id="char-count">0</span>/1000 caractères
            </div>
          </div>
          <p class="form-status" role="status" aria-live="polite" data-content-key="contact.successMessage" hidden>✅ Message envoyé !</p>
          <div class="form-actions">
            <button class="button button--primary ripple" type="submit">Envoyer</button>
          </div>
        </form>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-inner">
      <p data-content-key="footer.text">© 2025 Mohamed — Tous droits réservés.</p>
      <div class="footer-social">
        <a data-social-link="github" href="https://github.com/fzazdbl" target="_blank" rel="noopener">
          <i class="fab fa-github"></i> GitHub
        </a>
        <a data-social-link="linkedin" href="https://www.linkedin.com/in/mohamed-chahid" target="_blank" rel="noopener">
          <i class="fab fa-linkedin"></i> LinkedIn
        </a>
        <a data-social-link="email" href="mailto:chahidm126@gmail.com">
          <i class="fas fa-envelope"></i> E-mail
        </a>
      </div>
    </div>
  </footer>
</body>
</html>
