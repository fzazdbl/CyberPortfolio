<?php
/**
 * Traitement sécurisé du formulaire de contact
 */
require_once '../includes/security.php';

// Vérifier la méthode HTTP
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    generateErrorResponse(["Méthode non autorisée."], 405);
}
<?php
session_start();
require_once '../includes/security.php';

// Set security headers
setSecurityHeaders();

// Vérifier le token CSRF
if (!isset($_POST['csrf_token']) || !verifyCsrfToken($_POST['csrf_token'])) {
    generateErrorResponse(["Token de sécurité invalide."], 403);
}

// Vérifier le honeypot (anti-bot)
$honeypot = $_POST['website'] ?? '';
if (!verifyHoneypot($honeypot)) {
    // Bot détecté - réponse silencieuse
    generateSuccessResponse(
        "✅ Message reçu",
        "Votre message a bien été enregistré.",
        "../index.html"
    );
}

// Vérifier le rate limiting
$rateLimit = checkRateLimit(3, 300); // 3 soumissions max toutes les 5 minutes
if (!$rateLimit['allowed']) {
    $waitMinutes = ceil($rateLimit['wait_time'] / 60);
    generateErrorResponse([
        "Trop de soumissions détectées.",
        "Veuillez patienter {$waitMinutes} minute(s) avant de soumettre à nouveau."
    ], 429);
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
$nom = sanitizeString($_POST['nom'] ?? '', 2, 50);
$email = validateEmail($_POST['email'] ?? '');
$message = sanitizeString($_POST['message'] ?? '', 10, 1000);

// Collecter les erreurs
$errors = [];

if ($nom === false) {
    $errors[] = "Le nom doit contenir entre 2 et 50 caractères.";
}

if ($email === false) {
    $errors[] = "L'adresse email est invalide.";
}

if ($message === false) {
    $errors[] = "Le message doit contenir entre 10 et 1000 caractères.";
}

// Afficher les erreurs si nécessaire
if (!empty($errors)) {
    generateErrorResponse($errors);
}

// Tentative d'envoi de l'email (optionnel - pour serveur avec mail())
$to = 'chahidm126@gmail.com';
$subject = 'Nouveau message - CyberPortfolio';
$body = "Nom : $nom\nEmail : $email\n\nMessage :\n$message";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
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
    $sent = @mail($to, $subject, $body, $headers);
}

// Régénérer le token CSRF
regenerateCsrfToken();

// Afficher le message de succès
if ($sent) {
    generateSuccessResponse(
        "✅ Message envoyé avec succès !",
        "Merci $nom !\n\nVotre message a bien été reçu et je vous répondrai rapidement à l'adresse : $email",
        "../index.html"
    );
} else {
    generateSuccessResponse(
        "✅ Message reçu !",
        "Merci $nom !\n\nVotre message a bien été enregistré.\nEmail de contact : $email\n\nNote : L'envoi automatique par email n'est pas configuré sur ce serveur.",
        "../index.html"
    );
}
?>
// Update rate limit timestamp after successful processing
updateRateLimitTimestamp();

// Régénération du token CSRF
regenerateCSRFToken();

// Rediriger vers la page de confirmation
header('Location: confirmation.html?status=' . ($sent ? 'sent' : 'received'));
exit;
