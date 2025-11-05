<?php
/**
 * Fonctions de sécurité pour CyberPortfolio
 * CSRF, Honeypot, Rate Limiting, Sanitization
 * Fonctions de sécurité pour les formulaires
 * Inclut : CSRF, Honeypot, Rate Limiting, Sanitization
 */

// Démarrer la session si pas déjà démarrée
 * Security utilities: CSRF protection, rate limiting, honeypot, and sanitization
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Génère un token CSRF unique
 * @return string Token CSRF
 * Génère et retourne un token CSRF
 */
function generateCsrfToken() {
 * Generate CSRF token
 * @return string CSRF token
 */
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Vérifie le token CSRF
 * @param string $token Token à vérifier
 * @return bool True si valide
 */
function verifyCsrfToken($token) {
 * Verify CSRF token
 * @param string $token Token to verify
 * @return bool True if valid
 */
function verifyCSRFToken($token) {
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Régénère le token CSRF
 * @return string Nouveau token
 */
function regenerateCsrfToken() {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf_token'];
}

/**
 * Vérifie le champ honeypot (anti-bot)
 * @param string $fieldName Nom du champ honeypot
 * @return bool True si pas de bot détecté
 */
function verifyHoneypot($fieldName = 'website') {
 * Régénère le token CSRF après utilisation
 */
function regenerateCsrfToken() {
 * Regenerate CSRF token after use
 */
function regenerateCSRFToken() {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

/**
 * Vérifie le champ honeypot (anti-spam bot)
 * Le champ doit être vide (les bots le remplissent)
 */
function verifyHoneypot($honeypotValue) {
    return empty($honeypotValue);
}

/**
 * Rate limiting simple basé sur la session
 * Limite le nombre de soumissions par période
 */
function checkRateLimit($maxAttempts = 5, $periodSeconds = 300) {
    $currentTime = time();
    
    if (!isset($_SESSION['rate_limit'])) {
        $_SESSION['rate_limit'] = [
            'attempts' => 0,
            'reset_time' => $currentTime + $periodSeconds
        ];
    }
    
    // Réinitialiser si la période est écoulée
    if ($currentTime > $_SESSION['rate_limit']['reset_time']) {
        $_SESSION['rate_limit'] = [
            'attempts' => 0,
            'reset_time' => $currentTime + $periodSeconds
        ];
    }
    
    // Incrémenter les tentatives
    $_SESSION['rate_limit']['attempts']++;
    
    // Vérifier si la limite est dépassée
    if ($_SESSION['rate_limit']['attempts'] > $maxAttempts) {
        $waitTime = $_SESSION['rate_limit']['reset_time'] - $currentTime;
        return [
            'allowed' => false,
            'wait_time' => $waitTime
        ];
    }
    
    return ['allowed' => true];
}

/**
 * Nettoie et valide une chaîne de caractères
 */
function sanitizeString($input, $minLength = 1, $maxLength = 1000) {
    $cleaned = trim($input);
    $cleaned = filter_var($cleaned, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    
    if (strlen($cleaned) < $minLength || strlen($cleaned) > $maxLength) {
        return false;
    }
    
    return htmlspecialchars($cleaned, ENT_QUOTES, 'UTF-8');
}

/**
 * Valide une adresse email
 */
function validateEmail($email) {
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (!$email) {
        return false;
    }
    return htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
}

/**
 * Retourne les headers de sécurité HTTP
 */
function setSecurityHeaders() {
    // Protection XSS
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: SAMEORIGIN");
    header("X-XSS-Protection: 1; mode=block");
    
    // Referrer Policy
    header("Referrer-Policy: strict-origin-when-cross-origin");
    
    // Content Security Policy sera géré par .htaccess pour plus de flexibilité
}

/**
 * Génère un message d'erreur sécurisé
 */
function generateErrorResponse($errors, $statusCode = 422) {
    http_response_code($statusCode);
    setSecurityHeaders();
    
    $html = '<!DOCTYPE html>';
    $html .= '<html lang="fr">';
    $html .= '<head>';
    $html .= '<meta charset="UTF-8">';
    $html .= '<meta name="viewport" content="width=device-width, initial-scale=1">';
    $html .= '<title>Erreur - CyberPortfolio</title>';
    $html .= '<style>';
    $html .= 'body { font-family: sans-serif; background: #040718; color: #f4f9ff; padding: 40px; text-align: center; }';
    $html .= '.error-container { background: rgba(247, 37, 133, 0.1); border: 1px solid #f72585; border-radius: 12px; padding: 30px; margin: 20px auto; max-width: 600px; }';
    $html .= '.error-item { margin: 10px 0; color: #ff6b9d; }';
    $html .= '.back-link { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00b4d8; color: white; text-decoration: none; border-radius: 8px; }';
    $html .= '</style>';
    $html .= '</head>';
    $html .= '<body>';
    $html .= '<div class="error-container">';
    $html .= '<h1>❌ Erreur de validation</h1>';
    
    foreach ($errors as $error) {
        $html .= '<p class="error-item">' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</p>';
    }
    
    $html .= '</div>';
    $html .= '<a href="javascript:history.back()" class="back-link">Retour au formulaire</a>';
    $html .= '</body>';
    $html .= '</html>';
    
    echo $html;
    exit;
}

/**
 * Génère un message de succès sécurisé
 */
function generateSuccessResponse($title, $message, $redirectUrl = null) {
    http_response_code(200);
    setSecurityHeaders();
    
    $html = '<!DOCTYPE html>';
    $html .= '<html lang="fr">';
    $html .= '<head>';
    $html .= '<meta charset="UTF-8">';
    $html .= '<meta name="viewport" content="width=device-width, initial-scale=1">';
    $html .= '<title>Succès - CyberPortfolio</title>';
    
    if ($redirectUrl) {
        $html .= '<meta http-equiv="refresh" content="3;url=' . htmlspecialchars($redirectUrl, ENT_QUOTES, 'UTF-8') . '">';
    }
    
    $html .= '<style>';
    $html .= 'body { font-family: sans-serif; background: #040718; color: #f4f9ff; padding: 40px; text-align: center; }';
    $html .= '.success-container { background: rgba(6, 214, 160, 0.1); border: 1px solid #06d6a0; border-radius: 12px; padding: 30px; margin: 20px auto; max-width: 600px; }';
    $html .= '.back-link { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00b4d8; color: white; text-decoration: none; border-radius: 8px; }';
    $html .= '</style>';
    $html .= '</head>';
    $html .= '<body>';
    $html .= '<div class="success-container">';
    $html .= '<h1>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1>';
    $html .= '<p>' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</p>';
    
    if ($redirectUrl) {
        $html .= '<p><em>Redirection automatique dans 3 secondes...</em></p>';
    }
    
    $html .= '</div>';
    
    if (!$redirectUrl) {
        $html .= '<a href="../index.html" class="back-link">Retour à l\'accueil</a>';
    }
    
    $html .= '</body>';
    $html .= '</html>';
    
    echo $html;
    exit;
 * Check honeypot field (must be empty)
 * @param string $fieldName Field name to check
 * @return bool True if honeypot is empty (valid)
 */
function checkHoneypot($fieldName = 'website') {
    return empty($_POST[$fieldName]);
}

/**
 * Implémente un rate limiting simple basé sur la session
 * @param string $action Action à limiter
 * @param int $maxAttempts Nombre max de tentatives
 * @param int $timeWindow Fenêtre de temps en secondes
 * @return bool True si autorisé
 */
function checkRateLimit($action, $maxAttempts = 5, $timeWindow = 300) {
    $key = 'rate_limit_' . $action;
    $now = time();
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 0, 'start' => $now];
    }
    
    $data = $_SESSION[$key];
    
    // Réinitialiser si la fenêtre est expirée
    if ($now - $data['start'] > $timeWindow) {
        $_SESSION[$key] = ['count' => 1, 'start' => $now];
        return true;
    }
    
    // Vérifier la limite
    if ($data['count'] >= $maxAttempts) {
        return false;
    }
    
    // Incrémenter le compteur
    $_SESSION[$key]['count']++;
 * Rate limiting - prevent spam submissions
 * @param int $minSeconds Minimum seconds between submissions (default 60)
 * @return bool True if rate limit OK
 */
function checkRateLimit($minSeconds = 60) {
    $currentTime = time();
    
    // Check last submission time
    if (isset($_SESSION['last_submission_time'])) {
        $timeSinceLastSubmission = $currentTime - $_SESSION['last_submission_time'];
        if ($timeSinceLastSubmission < $minSeconds) {
            return false;
        }
    }
    
    // Only update timestamp if rate limit check passes
    return true;
}

/**
 * Nettoie et valide une chaîne de texte
 * @param string $input Texte à nettoyer
 * @param int $maxLength Longueur maximale
 * @return string|false Texte nettoyé ou false si invalide
 */
function sanitizeText($input, $maxLength = 1000) {
    $text = trim(filter_var($input, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    if (strlen($text) > $maxLength) {
        return false;
    }
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/**
 * Valide et nettoie une adresse email
 * @param string $email Email à valider
 * @return string|false Email nettoyé ou false si invalide
 */
function sanitizeEmail($email) {
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (!$email) {
        return false;
    }
    return htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
}

/**
 * Vérifie si l'utilisateur est authentifié (admin)
 * @return bool True si authentifié
 */
function isAuthenticated() {
    return isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true;
}

/**
 * Marque l'utilisateur comme authentifié
 */
function setAuthenticated() {
    $_SESSION['admin_authenticated'] = true;
    $_SESSION['admin_login_time'] = time();
}

/**
 * Déconnecte l'utilisateur
 */
function logout() {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
}

/**
 * Vérifie le mot de passe admin
 * @param string $password Mot de passe fourni
 * @param string $hash Hash stocké
 * @return bool True si le mot de passe est correct
 */
function verifyAdminPassword($password, $hash) {
    return password_verify($password, $hash);
 * Update rate limit timestamp (call after successful submission)
 */
function updateRateLimitTimestamp() {
    $_SESSION['last_submission_time'] = time();
}

/**
 * Track failed attempts (for security monitoring)
 * @param string $context Context identifier (e.g., 'login', 'contact')
 * @param int $maxAttempts Maximum allowed attempts
 * @return bool True if under limit
 */
function trackAttempts($context, $maxAttempts = 5) {
    $key = $context . '_attempts';
    $timeKey = $context . '_attempts_time';
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = 0;
        $_SESSION[$timeKey] = time();
    }
    
    // Reset counter after 1 hour
    if (time() - $_SESSION[$timeKey] > 3600) {
        $_SESSION[$key] = 0;
        $_SESSION[$timeKey] = time();
    }
    
    $_SESSION[$key]++;
    
    return $_SESSION[$key] <= $maxAttempts;
}

/**
 * Sanitize string input
 * @param string $input Input to sanitize
 * @return string Sanitized string
 */
function sanitizeString($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate and sanitize email
 * @param string $email Email to validate
 * @return string|false Sanitized email or false if invalid
 */
function validateEmail($email) {
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if ($email === false) {
        return false;
    }
    return sanitizeString($email);
}

/**
 * Validate string length
 * @param string $input Input to validate
 * @param int $minLength Minimum length
 * @param int $maxLength Maximum length
 * @return bool True if valid
 */
function validateLength($input, $minLength, $maxLength) {
    $length = strlen($input);
    return $length >= $minLength && $length <= $maxLength;
}

/**
 * Security headers helper
 */
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}
