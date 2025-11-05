<?php
session_start();
require_once '../includes/security.php';

// Set security headers
setSecurityHeaders();

// Vérification de la méthode
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die("Méthode non autorisée.");
}

// Vérification du token CSRF
if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
    http_response_code(403);
    die("Token CSRF invalide.");
}

// Vérification honeypot
if (!checkHoneypot('website')) {
    http_response_code(403);
    die("Formulaire invalide.");
}

// Vérification rate limiting
if (!checkRateLimit(60)) {
    http_response_code(429);
    die("Trop de tentatives. Veuillez patienter avant de soumettre à nouveau.");
}

// Validation et nettoyage des données
$nom = trim(filter_input(INPUT_POST, 'nom', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$message = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

// Validation des champs
$errors = [];

if (empty($nom) || strlen($nom) < 2) {
    $errors[] = "Le nom doit contenir au moins 2 caractères.";
}

if (!$email) {
    $errors[] = "L'adresse email est invalide.";
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = "Le message doit contenir au moins 10 caractères.";
}

if (strlen($message) > 1000) {
    $errors[] = "Le message ne peut pas dépasser 1000 caractères.";
}

// Si des erreurs existent, les afficher
if (!empty($errors)) {
    http_response_code(422);
    echo "<div class='error-messages'>";
    foreach ($errors as $error) {
        echo "<p class='error'>❌ $error</p>";
    }
    echo "</div>";
    exit;
}

// Protection XSS supplémentaire
$nom = htmlspecialchars($nom, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Validation supplémentaire de l'email pour prévenir l'injection d'en-têtes
if (preg_match('/[\r\n]/', $email)) {
    http_response_code(422);
    die("Email invalide détecté.");
}

// Envoi de l'email (optionnel - pour serveur avec mail())
$to = 'chahidm126@gmail.com';
$subject = 'Nouveau message - CyberPortfolio';
$body = "Nom : $nom\nEmail : $email\n\nMessage :\n$message";
// Note: Email is validated and sanitized above, safe to use in Reply-To
$headers = [
    'From' => 'noreply@cyberportfolio.fr',
    'Reply-To' => $email,  // Already validated for format and header injection
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'PHP/' . phpversion()
];

$formattedHeaders = '';
foreach ($headers as $key => $value) {
    $formattedHeaders .= "$key: $value\r\n";
}

// Tentative d'envoi (peut échouer en local)
$sent = false;
if (function_exists('mail')) {
    $sent = @mail($to, $subject, $body, $formattedHeaders);
}

// Update rate limit timestamp after successful processing
updateRateLimitTimestamp();

// Régénération du token CSRF
regenerateCSRFToken();

// Rediriger vers la page de confirmation
header('Location: confirmation.html?status=' . ($sent ? 'sent' : 'received'));
exit;