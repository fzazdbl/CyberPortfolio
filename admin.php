<?php
/**
 * Page d'administration sécurisée - CyberPortfolio
 */
require_once __DIR__ . '/includes/security.php';

// Vérifier l'authentification
if (!isAuthenticated()) {
session_start();

// Check if user is authenticated
if (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
    header('Location: login.php');
    exit;
}

// Générer token CSRF pour les formulaires
$csrfToken = generateCsrfToken();
// Optional: Check session timeout (e.g., 1 hour)
$sessionTimeout = 3600; // 1 hour in seconds
if (isset($_SESSION['admin_login_time']) && (time() - $_SESSION['admin_login_time'] > $sessionTimeout)) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Update last activity time
$_SESSION['admin_login_time'] = time();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Administration - CyberPortfolio</title>
  <title>Administration - CyberPortfolio</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="assets/css/liquid-glass-renderer.css">
  <link rel="stylesheet" href="assets/css/theme.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/admin.css">
  <script src="assets/js/content-manager.js" defer></script>
  <script src="assets/js/liquid-glass-renderer.js" defer></script>
  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/form-validation.js" defer></script>
  <script src="assets/js/ui-toggles.js" defer></script>
  <script src="assets/js/scroll-animations.js" defer></script>
  <script src="assets/js/admin.js" defer></script>
  <script src="assets/js/admin-enhanced.js" defer></script>
</head>
<body class="admin-body" data-page="admin">
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  <div class="liquid-background" data-liquid-renderer data-liquid-intensity="0.9" data-liquid-speed="0.28"></div>
  
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
        <img src="assets/images/logo-cyber.svg" alt="Logo CyberPortfolio" class="brand-logo__img">
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
    <nav id="primaryNav" class="liquid-nav__menu" aria-label="Navigation principale" data-nav-root="">
      <a class="liquid-nav__link nav-link" data-nav-key="accueil" data-target="accueil" data-link href="index.html">
        <i class="fas fa-home"></i> Accueil
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="competences" data-target="competences" data-link href="competences/index.html">
        <i class="fas fa-code"></i> Compétences
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="projets" data-target="projets" data-link href="projets/index.html">
        <i class="fas fa-project-diagram"></i> Mes projets
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="projets-interactifs" data-target="projets-interactifs" data-link href="projets-interactifs/index.html">
        <i class="fas fa-terminal"></i> Projets interactifs
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="contact" data-target="contact" data-link href="contact/index.php">
      <a class="liquid-nav__link nav-link" data-nav-key="contact" data-target="contact" data-link href="contact/">
        <i class="fas fa-envelope"></i> Contact
      </a>
      <a class="liquid-nav__link nav-link" data-nav-key="admin" data-target="admin" data-link href="admin.php">
        <i class="fas fa-cog"></i> Admin
      </a>
    </nav>
  </header>

  <div class="admin-backdrop" aria-hidden="true"></div>
  <main class="admin-wrapper" role="main">
    <section class="admin-dashboard">
  <main id="main-content" class="admin-wrapper" role="main">
    <section class="admin-dashboard" id="adminDashboard">
      <header class="admin-dashboard__header">
        <div>
          <p class="admin-eyebrow">Tableau de bord</p>
          <h2>Contenus du site</h2>
        </div>
        <a href="logout.php" class="button button--ghost">Se déconnecter</a>
      </header>

      <form id="contentForm" class="admin-form-grid" novalidate>
        <fieldset>
          <legend>🏠 Page d'accueil</legend>
          <label for="homeHeroEyebrow">Étiquette hero</label>
          <input id="homeHeroEyebrow" data-field-key="home.heroEyebrow" type="text" placeholder="CyberPortfolio">

          <label for="homeHeroTitle">Titre principal</label>
          <input id="homeHeroTitle" data-field-key="home.heroTitle" type="text" required placeholder="Sécurité et design au service de vos projets">

          <label for="homeHeroSubtitle">Sous-titre</label>
          <textarea id="homeHeroSubtitle" data-field-key="home.heroSubtitle" rows="3" required placeholder="Description de votre profil..."></textarea>

          <label for="homeVisionTitle">Titre section vision</label>
          <input id="homeVisionTitle" data-field-key="home.visionTitle" type="text" placeholder="Sécuriser, automatiser et sublimer">

          <label for="homeVisionText">Texte vision</label>
          <textarea id="homeVisionText" data-field-key="home.visionText" rows="3" placeholder="Votre approche et philosophie..."></textarea>

          <label for="homeFocusTitle">Titre domaines clés</label>
          <input id="homeFocusTitle" data-field-key="home.focusTitle" type="text" placeholder="Mes domaines clés">

          <label for="homeCtaTitle">Titre appel à l'action</label>
          <input id="homeCtaTitle" data-field-key="home.ctaTitle" type="text" placeholder="Prêt à collaborer ?">

          <label for="homeCtaText">Texte appel à l'action</label>
          <textarea id="homeCtaText" data-field-key="home.ctaText" rows="2" placeholder="Message d'encouragement au contact..."></textarea>
        </fieldset>

        <fieldset>
          <legend>💻 Page compétences</legend>
          <label for="competencesHeroEyebrow">Étiquette hero</label>
          <input id="competencesHeroEyebrow" data-field-key="competences.heroEyebrow" type="text" placeholder="Compétences">

          <label for="competencesHeroTitle">Titre principal</label>
          <input id="competencesHeroTitle" data-field-key="competences.heroTitle" type="text" required placeholder="Expertise technique et vision cyber">

          <label for="competencesHeroSubtitle">Sous-titre</label>
          <textarea id="competencesHeroSubtitle" data-field-key="competences.heroSubtitle" rows="3" placeholder="Description de votre niveau et parcours..."></textarea>

          <label for="competencesSkillsTitle">Titre section compétences</label>
          <input id="competencesSkillsTitle" data-field-key="competences.skillsTitle" type="text" placeholder="Domaines de compétences">

          <label for="competencesToolsTitle">Titre section outils</label>
          <input id="competencesToolsTitle" data-field-key="competences.toolsTitle" type="text" placeholder="Stack technique actuel">

          <label for="competencesLearningTitle">Titre section apprentissage</label>
          <input id="competencesLearningTitle" data-field-key="competences.learningTitle" type="text" placeholder="En cours d'acquisition">

          <label for="competencesProjectsTitle">Titre section projets</label>
          <input id="competencesProjectsTitle" data-field-key="competences.projectsTitle" type="text" placeholder="Mini-projets et preuves">
        </fieldset>

        <fieldset>
          <legend>🚀 Page projets</legend>
          <label for="projectsHeroEyebrow">Étiquette hero</label>
          <input id="projectsHeroEyebrow" data-field-key="projects.heroEyebrow" type="text" placeholder="Mes réalisations">

          <label for="projectsHeroTitle">Titre principal</label>
          <input id="projectsHeroTitle" data-field-key="projects.heroTitle" type="text" required placeholder="Des projets qui fusionnent sécurité et esthétique">

          <label for="projectsHeroSubtitle">Sous-titre</label>
          <textarea id="projectsHeroSubtitle" data-field-key="projects.heroSubtitle" rows="3" placeholder="Description de votre approche projet..."></textarea>

          <label for="projectsRecentTitle">Titre projets marquants</label>
          <input id="projectsRecentTitle" data-field-key="projects.recentTitle" type="text" placeholder="Projets marquants">

          <label for="projectsDevTitle">Titre prototypes</label>
          <input id="projectsDevTitle" data-field-key="projects.devTitle" type="text" placeholder="Prototypes & idées en cours">
        </fieldset>

        <fieldset>
          <legend>📧 Page contact</legend>
          <label for="contactHeroEyebrow">Étiquette hero</label>
          <input id="contactHeroEyebrow" data-field-key="contact.heroEyebrow" type="text" placeholder="Contact">

          <label for="contactHeroTitle">Titre principal</label>
          <input id="contactHeroTitle" data-field-key="contact.heroTitle" type="text" required placeholder="Échangeons autour de vos besoins numériques">

          <label for="contactHeroSubtitle">Sous-titre</label>
          <textarea id="contactHeroSubtitle" data-field-key="contact.heroSubtitle" rows="3" placeholder="Message d'invitation au contact..."></textarea>

          <label for="contactFormTitle">Titre formulaire</label>
          <input id="contactFormTitle" data-field-key="contact.formTitle" type="text" placeholder="Laissez-moi un message">

          <label for="contactFormText">Texte formulaire</label>
          <textarea id="contactFormText" data-field-key="contact.formText" rows="3" placeholder="Instructions pour le formulaire..."></textarea>

          <label for="contactSuccessMessage">Message de confirmation</label>
          <input id="contactSuccessMessage" data-field-key="contact.successMessage" type="text" placeholder="✅ Message envoyé !">
        </fieldset>

        <fieldset>
          <legend>🧭 Navigation</legend>
          <div class="admin-nav-row">
            <div class="admin-nav-field">
              <label for="navAccueilLabel">Label Accueil</label>
              <input id="navAccueilLabel" data-nav-label="accueil" type="text" placeholder="Accueil">
            </div>
            <div class="admin-nav-field">
              <label for="navAccueilHref">Lien Accueil</label>
              <input id="navAccueilHref" data-nav-href="accueil" type="text" placeholder="index.html">
            </div>
          </div>
          <div class="admin-nav-row">
            <div class="admin-nav-field">
              <label for="navCompetencesLabel">Label Compétences</label>
              <input id="navCompetencesLabel" data-nav-label="competences" type="text" placeholder="Compétences">
            </div>
            <div class="admin-nav-field">
              <label for="navCompetencesHref">Lien Compétences</label>
              <input id="navCompetencesHref" data-nav-href="competences" type="text" placeholder="competences/index.html">
            </div>
          </div>
          <div class="admin-nav-row">
            <div class="admin-nav-field">
              <label for="navProjetsLabel">Label Projets</label>
              <input id="navProjetsLabel" data-nav-label="projets" type="text" placeholder="Mes projets">
            </div>
            <div class="admin-nav-field">
              <label for="navProjetsHref">Lien Projets</label>
              <input id="navProjetsHref" data-nav-href="projets" type="text" placeholder="projets/index.html">
            </div>
          </div>
          <div class="admin-nav-row">
            <div class="admin-nav-field">
              <label for="navContactLabel">Label Contact</label>
              <input id="navContactLabel" data-nav-label="contact" type="text" placeholder="Contact">
            </div>
            <div class="admin-nav-field">
              <label for="navContactHref">Lien Contact</label>
              <input id="navContactHref" data-nav-href="contact" type="text" placeholder="contact/index.php">
              <input id="navContactHref" data-nav-href="contact" type="text" placeholder="contact/">
            </div>
          </div>
          <div class="admin-nav-row">
            <div class="admin-nav-field">
              <label for="navAdminLabel">Label Admin</label>
              <input id="navAdminLabel" data-nav-label="admin" type="text" placeholder="Admin">
            </div>
            <div class="admin-nav-field">
              <label for="navAdminHref">Lien Admin</label>
              <input id="navAdminHref" data-nav-href="admin" type="text" placeholder="admin.php">
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>🔗 Réseaux sociaux</legend>
          <label for="linkGithub">GitHub</label>
          <input id="linkGithub" data-link-key="github" type="url" placeholder="https://github.com/votre-profil">

          <label for="linkLinkedin">LinkedIn</label>
          <input id="linkLinkedin" data-link-key="linkedin" type="url" placeholder="https://www.linkedin.com/in/votre-profil">

          <label for="linkEmail">E-mail</label>
          <input id="linkEmail" data-link-key="email" type="email" placeholder="mailto:votre@email.com">
        </fieldset>

        <fieldset>
          <legend>📄 Pied de page</legend>
          <label for="footerText">Texte du footer</label>
          <input id="footerText" data-field-key="footer.text" type="text" placeholder="© 2025 Mohamed — Tous droits réservés.">
        </fieldset>

        <fieldset>
          <legend>🎨 Couleurs du thème</legend>
          <label for="accentBlue">Accent bleu</label>
          <input id="accentBlue" data-theme-var="--accent-blue" type="color" value="#00b4d8">

          <label for="accentViolet">Accent violet</label>
          <input id="accentViolet" data-theme-var="--accent-violet" type="color" value="#7f5af0">

          <label for="accentCyan">Accent cyan</label>
          <input id="accentCyan" data-theme-var="--accent-cyan" type="color" value="#5de4ff">
        </fieldset>

        <div class="admin-actions">
          <button type="submit" class="button button--primary">Enregistrer les modifications</button>
          <p class="admin-status" id="contentStatus" role="status" aria-live="polite"></p>
        </div>
      </form>

      <form id="passwordForm" class="admin-form admin-form--password" novalidate>
        <h3>Changer le mot de passe</h3>
        <label for="newPassword">Nouveau mot de passe</label>
        <input id="newPassword" name="newPassword" type="password" required>

        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required>

        <div class="admin-actions">
          <button type="submit" class="button button--ghost">Mettre à jour</button>
          <p class="admin-status" id="passwordStatus" role="status" aria-live="polite"></p>
        </div>
      </form>
    </section>
  </main>
</body>
</html>
