<?php
/**
 * Page de déconnexion administrateur - CyberPortfolio
 */
require_once __DIR__ . '/includes/security.php';

// Déconnexion
logout();

// Rediriger vers la page d'accueil
header('Location: index.html');
exit;
