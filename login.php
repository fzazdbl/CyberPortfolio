<?php
/**
 * Page de connexion administrateur
 */
session_start();

// Vérifier si déjà connecté
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: admin.php');
    exit;
}

// Charger les fonctions de sécurité
require_once 'includes/security.php';

// Générer le token CSRF
$csrfToken = generateCsrfToken();

// Traitement du formulaire de connexion
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérifier le token CSRF
    if (!isset($_POST['csrf_token']) || !verifyCsrfToken($_POST['csrf_token'])) {
        $error = 'Token de sécurité invalide.';
    } else {
        // Vérifier le rate limiting
        $rateLimit = checkRateLimit(5, 900); // 5 tentatives max par 15 minutes
        
        if (!$rateLimit['allowed']) {
            $waitMinutes = ceil($rateLimit['wait_time'] / 60);
            $error = "Trop de tentatives. Veuillez réessayer dans {$waitMinutes} minute(s).";
        } else {
            // Charger les identifiants
            if (file_exists('includes/credentials.php')) {
                require_once 'includes/credentials.php';
                
                $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $password = $_POST['password'] ?? '';
                
                // Vérifier les identifiants
                if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
                    // Régénérer l'ID de session pour sécurité
                    session_regenerate_id(true);
                    
                    // Définir les variables de session
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_username'] = $username;
                    $_SESSION['login_time'] = time();
                    
                    // Réinitialiser le rate limit
                    unset($_SESSION['rate_limit']);
                    
                    // Rediriger vers admin
                    header('Location: admin.php');
                    exit;
                } else {
                    $error = 'Identifiants incorrects.';
                }
            } else {
                $error = 'Configuration manquante. Veuillez créer includes/credentials.php à partir de credentials.example.php.';
            }
        }
    }
    
    // Régénérer le token après tentative
    regenerateCsrfToken();
    $csrfToken = $_SESSION['csrf_token'];
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Connexion - Administration CyberPortfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="assets/css/liquid-glass-renderer.css">
    <link rel="stylesheet" href="assets/css/theme.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
    <style>
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .login-card {
            background: var(--gradient-surface);
            border: 1px solid var(--border-soft);
            border-radius: var(--radius-lg);
            padding: 3rem;
            max-width: 450px;
            width: 100%;
            box-shadow: var(--shadow-soft);
        }
        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .login-header h1 {
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        .login-header p {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }
        .login-form .form-group {
            margin-bottom: 1.5rem;
        }
        .login-form label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
            font-weight: 500;
        }
        .login-form input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-soft);
            border-radius: var(--radius-md);
            background: var(--bg-elevated);
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .login-form input:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.1);
        }
        .login-form button {
            width: 100%;
            padding: 0.875rem;
            background: var(--accent-primary);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .login-form button:hover {
            background: var(--accent-hover);
            transform: translateY(-1px);
        }
        .error-message {
            background: rgba(247, 37, 133, 0.1);
            border: 1px solid #f72585;
            color: #ff6b9d;
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            color: var(--accent-primary);
            text-decoration: none;
            font-size: 0.9rem;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body class="admin-body" data-page="login">
    <div class="liquid-background" data-liquid-renderer data-liquid-intensity="0.9" data-liquid-speed="0.28"></div>
    
    <div class="decorative-elements" aria-hidden="true">
        <div class="cyber-grid"></div>
        <div class="floating-particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
        </div>
    </div>

    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h1><i class="fas fa-shield-alt"></i> Administration</h1>
                <p>CyberPortfolio - Espace sécurisé</p>
            </div>

            <?php if ($error): ?>
                <div class="error-message" role="alert">
                    <i class="fas fa-exclamation-triangle"></i> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="login-form" autocomplete="off">
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken); ?>">
                
                <div class="form-group">
                    <label for="username">Nom d'utilisateur</label>
                    <input type="text" id="username" name="username" required autocomplete="username">
                </div>

                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" name="password" required autocomplete="current-password">
                </div>

                <button type="submit">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </form>

            <a href="index.html" class="back-link">
                <i class="fas fa-arrow-left"></i> Retour au portfolio
            </a>
        </div>
    </div>

    <script src="assets/js/liquid-glass-renderer.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
