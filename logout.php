<?php
/**
 * Page de déconnexion administrateur - CyberPortfolio
 */
require_once __DIR__ . '/includes/security.php';

// Déconnexion
logout();

// Rediriger vers la page d'accueil
session_start();

// Clear all session data
$_SESSION = array();

// Destroy session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 42000, '/');
}

// Destroy the session
session_destroy();

// Redirect to home page
header('Location: index.html');
exit;
