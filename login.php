<?php
session_start();

// If already authenticated, redirect to admin
if (isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true) {
    header('Location: admin.php');
    exit;
}

require_once 'includes/security.php';
require_once 'includes/credentials.php';

$error = '';
$csrfToken = generateCSRFToken();

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
        $error = 'Token de sécurité invalide.';
    }
    // Check honeypot
    elseif (!checkHoneypot('website')) {
        $error = 'Formulaire invalide.';
    }
    // Track failed login attempts
    elseif (!trackAttempts('login', 5)) {
        $error = 'Trop de tentatives. Veuillez réessayer plus tard.';
    }
    else {
        $password = $_POST['password'] ?? '';
        
        // Verify password
        if (password_verify($password, $ADMIN_PASSWORD_HASH)) {
            // Regenerate session ID to prevent session fixation
            session_regenerate_id(true);
            
            $_SESSION['admin_authenticated'] = true;
            $_SESSION['admin_login_time'] = time();
            
            // Reset failed attempts
            unset($_SESSION['login_attempts']);
            unset($_SESSION['login_attempts_time']);
            
            // Redirect to admin panel
            header('Location: admin.php');
            exit;
        } else {
            $error = 'Mot de passe incorrect.';
        }
    }
    
    // Regenerate CSRF token after failed attempt
    regenerateCSRFToken();
    $csrfToken = $_SESSION['csrf_token'];
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Connexion - CyberPortfolio</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="assets/css/liquid-glass-renderer.css">
  <link rel="stylesheet" href="assets/css/theme.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/admin.css">
  <script src="assets/js/liquid-glass-renderer.js" defer></script>
  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/ui-toggles.js" defer></script>
</head>
<body class="admin-body" data-page="login">
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
      <a class="liquid-nav__link nav-link" data-nav-key="contact" data-target="contact" data-link href="contact/">
        <i class="fas fa-envelope"></i> Contact
      </a>
    </nav>
  </header>

  <div class="admin-backdrop" aria-hidden="true"></div>
  <main id="main-content" class="admin-wrapper" role="main">
    <section class="admin-card" id="loginPanel">
      <header>
        <p class="admin-eyebrow">Espace sécurisé</p>
        <h1>Connexion administrateur</h1>
        <p class="admin-subtitle">Saisissez le mot de passe administrateur pour accéder au tableau de bord.</p>
      </header>
      <form method="post" class="admin-form" autocomplete="off">
        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken); ?>">
        <!-- Honeypot field (hidden) -->
        <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off">
        
        <label for="password">Mot de passe</label>
        <div class="admin-input-row">
          <input id="password" name="password" type="password" placeholder="Mot de passe" required>
          <button type="submit" class="button button--primary">Se connecter</button>
        </div>
        <?php if ($error): ?>
        <p class="admin-error" role="alert"><?php echo htmlspecialchars($error); ?></p>
        <?php endif; ?>
      </form>
      <p style="margin-top: 1rem; text-align: center;">
        <a href="index.html" style="color: var(--accent-cyan); text-decoration: none;">← Retour au portfolio</a>
      </p>
    </section>
  </main>
</body>
</html>
