<?php
/**
 * Page de connexion administrateur - CyberPortfolio
 */
require_once __DIR__ . '/includes/security.php';

// Si déjà authentifié, rediriger vers admin
if (isAuthenticated()) {
    header('Location: admin.php');
    exit;
}

// Générer token CSRF
$csrfToken = generateCsrfToken();

// Traitement du formulaire de connexion
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérifier le rate limiting
    if (!checkRateLimit('admin_login', 5, 300)) {
        $error = 'Trop de tentatives de connexion. Veuillez réessayer dans 5 minutes.';
    } else {
        // Vérifier le token CSRF
        $token = $_POST['csrf_token'] ?? '';
        if (!verifyCsrfToken($token)) {
            $error = 'Token de sécurité invalide. Veuillez réessayer.';
        } else {
            $password = $_POST['password'] ?? '';
            
            // Charger les credentials
            if (file_exists(__DIR__ . '/includes/credentials.php')) {
                require_once __DIR__ . '/includes/credentials.php';
                
                if (verifyAdminPassword($password, ADMIN_PASSWORD_HASH)) {
                    // Authentification réussie
                    setAuthenticated();
                    regenerateCsrfToken(); // Régénérer le token après connexion
                    header('Location: admin.php');
                    exit;
                } else {
                    $error = 'Mot de passe incorrect.';
                }
            } else {
                $error = 'Configuration manquante. Veuillez créer le fichier credentials.php.';
            }
        }
    }
    
    // Régénérer le token après une tentative échouée
    $csrfToken = regenerateCsrfToken();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Connexion Administration - CyberPortfolio</title>
  <link rel="stylesheet" href="assets/css/liquid-glass-renderer.css">
  <link rel="stylesheet" href="assets/css/theme.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/admin.css">
  <script src="assets/js/liquid-glass-renderer.js" defer></script>
  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/ui-toggles.js" defer></script>
</head>
<body class="admin-body" data-page="login">
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

  <div class="admin-backdrop" aria-hidden="true"></div>
  <main class="admin-wrapper" role="main">
    <section class="admin-card">
      <header>
        <p class="admin-eyebrow">Espace sécurisé</p>
        <h1>Connexion Administration</h1>
        <p class="admin-subtitle">Authentifiez-vous pour accéder au panneau d'administration.</p>
      </header>
      <form method="POST" class="admin-form" autocomplete="off">
        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8'); ?>">
        
        <label for="password">Mot de passe</label>
        <div class="admin-input-row">
          <input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="Mot de passe administrateur" 
            required 
            autofocus
            autocomplete="current-password"
          >
          <button type="submit" class="button button--primary">Se connecter</button>
        </div>
        
        <?php if ($error): ?>
        <p class="admin-error" role="alert"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></p>
        <?php endif; ?>
      </form>
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="index.html" class="button button--ghost">Retour au site</a>
      </div>
    </section>
  </main>
</body>
</html>
