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

// Example password hash for 'SecurePassword123!'
// CHANGE THIS IN PRODUCTION by copying to credentials.php
$ADMIN_PASSWORD_HASH = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

// Optional: Admin username (can be used for future enhancements)
$ADMIN_USERNAME = 'admin';
