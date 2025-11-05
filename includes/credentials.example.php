<?php
/**
 * Fichier d'exemple pour les credentials d'administration
 * 
 * INSTRUCTIONS:
 * 1. Copiez ce fichier en 'credentials.php' dans le même dossier
 * 2. Générez un hash sécurisé pour votre mot de passe avec:
 *    php -r "echo password_hash('votre_mot_de_passe', PASSWORD_DEFAULT);"
 * 3. Remplacez le hash ci-dessous par votre hash généré
 * 4. Ne commitez JAMAIS le fichier credentials.php dans git!
 */

// Hash d'exemple pour le mot de passe "ChangeMe123!"
// À REMPLACER par votre propre hash
define('ADMIN_PASSWORD_HASH', '$2y$10$example.hash.replace.with.your.own.generated.hash');

// Email admin (optionnel, pour notifications)
define('ADMIN_EMAIL', 'chahidm126@gmail.com');
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
