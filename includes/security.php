<?php
/**
 * Fonctions de sécurité pour les formulaires
 * Inclut : CSRF, Honeypot, Rate Limiting, Sanitization
 */

// Démarrer la session si pas déjà démarrée
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Génère et retourne un token CSRF
 */
function generateCsrfToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Vérifie le token CSRF
 */
function verifyCsrfToken($token) {
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Régénère le token CSRF après utilisation
 */
function regenerateCsrfToken() {
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
}
