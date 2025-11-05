<?php
/**
 * Fichier de configuration des identifiants administrateur
 * 
 * INSTRUCTIONS :
 * 1. Renommer ce fichier en "credentials.php"
 * 2. Modifier les valeurs ci-dessous avec vos propres identifiants
 * 3. Le mot de passe doit être hashé avec password_hash()
 * 4. Ne jamais commiter credentials.php dans git (ajouté dans .gitignore)
 */

// Identifiants administrateur
// Pour générer un hash de mot de passe, exécutez :
// php -r "echo password_hash('votre_mot_de_passe', PASSWORD_DEFAULT);"
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', '$2y$10$example.hash.here.replace.with.your.own.password.hash');

// Durée de session en secondes (7200 = 2 heures)
define('SESSION_LIFETIME', 7200);
 * Admin credentials configuration
 * 
 * IMPORTANT: Copy this file to credentials.php and change the password hash
 * Do NOT commit credentials.php to version control
 * 
 * To generate a new password hash, use:
 * php -r "echo password_hash('your_password', PASSWORD_DEFAULT);"
 */

// Example password hash for 'SecurePassword123!' (example only - DO NOT USE IN PRODUCTION)
// CHANGE THIS IN PRODUCTION by copying to credentials.php and generating a new hash
$ADMIN_PASSWORD_HASH = '$2y$10$.HrQ2Jq.4gHTdMwgiNCaY.9QnksWCQlWf.FgPePt2r8W0cTkDOlp2';

// Optional: Admin username (can be used for future enhancements)
$ADMIN_USERNAME = 'admin';
