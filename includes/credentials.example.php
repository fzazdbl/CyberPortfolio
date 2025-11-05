<?php
/**
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
