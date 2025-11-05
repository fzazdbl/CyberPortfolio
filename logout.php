<?php
/**
 * Page de déconnexion administrateur
 */
session_start();

// Détruire toutes les variables de session
$_SESSION = array();

// Détruire le cookie de session si utilisé
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Détruire la session
session_destroy();

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
