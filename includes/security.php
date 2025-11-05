<?php
/**
 * Security utilities: CSRF protection, rate limiting, honeypot, and sanitization
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
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
 * Regenerate CSRF token after use
 */
function regenerateCSRFToken() {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

/**
 * Check honeypot field (must be empty)
 * @param string $fieldName Field name to check
 * @return bool True if honeypot is empty (valid)
 */
function checkHoneypot($fieldName = 'website') {
    return empty($_POST[$fieldName]);
}

/**
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
