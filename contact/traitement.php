<?php
/**
 * Traitement sécurisé du formulaire de contact - CyberPortfolio
 */
require_once __DIR__ . '/../includes/security.php';
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
$token = $_POST['csrf_token'] ?? '';
if (!verifyCsrfToken($token)) {
if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
    http_response_code(403);
    die("Token CSRF invalide.");
}

// Vérification honeypot (anti-bot)
if (!verifyHoneypot('website')) {
    http_response_code(403);
    die("Requête suspecte détectée.");
}

// Vérification du rate limiting
if (!checkRateLimit('contact_form', 3, 600)) {
    http_response_code(429);
    die("Trop de tentatives. Veuillez réessayer dans 10 minutes.");
}

// Validation et nettoyage des données avec les fonctions de sécurité
$nom = sanitizeText($_POST['nom'] ?? '', 50);
$email = sanitizeEmail($_POST['email'] ?? '');
$message = sanitizeText($_POST['message'] ?? '', 1000);
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

if (!$nom || strlen($nom) < 2) {
    $errors[] = "Le nom doit contenir au moins 2 caractères.";
if ($nom === false) {
    $errors[] = "Le nom doit contenir entre 2 et 50 caractères.";
}

if ($email === false) {
    $errors[] = "L'adresse email est invalide.";
}

if (!$message || strlen($message) < 10) {
    $errors[] = "Le message doit contenir au moins 10 caractères.";
}

// Si des erreurs existent, les afficher
if (!empty($errors)) {
    http_response_code(422);
    echo "<!DOCTYPE html>";
    echo "<html lang='fr'>";
    echo "<head>";
    echo "<meta charset='UTF-8'>";
    echo "<meta name='viewport' content='width=device-width, initial-scale=1'>";
    echo "<title>Erreur - CyberPortfolio</title>";
    echo "<style>";
    echo "body { font-family: 'Plus Jakarta Sans', sans-serif; background: #040718; color: #f4f9ff; padding: 40px; text-align: center; }";
    echo ".error-box { background: rgba(247, 37, 133, 0.1); border: 1px solid #f72585; border-radius: 12px; padding: 30px; margin: 20px auto; max-width: 600px; }";
    echo ".error { color: #f72585; margin: 10px 0; }";
    echo ".back-link { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00b4d8; color: white; text-decoration: none; border-radius: 8px; }";
    echo "</style>";
    echo "</head>";
    echo "<body>";
    echo "<div class='error-box'>";
    echo "<h1>❌ Erreur de validation</h1>";
    foreach ($errors as $error) {
        echo "<p class='error'>$error</p>";
    }
    echo "<a href='index.php' class='back-link'>Retour au formulaire</a>";
    echo "</div>";
    echo "</body>";
    echo "</html>";
    exit;
}

// Les données sont déjà nettoyées par les fonctions sanitize*
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

// Affichage du résultat
echo "<!DOCTYPE html>";
echo "<html lang='fr'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1'>";
echo "<title>Message reçu - CyberPortfolio</title>";
echo "<style>";
echo "body { font-family: 'Plus Jakarta Sans', sans-serif; background: #040718; color: #f4f9ff; padding: 40px; text-align: center; }";
echo ".success { background: rgba(6, 214, 160, 0.1); border: 1px solid #06d6a0; border-radius: 12px; padding: 30px; margin: 20px auto; max-width: 600px; }";
echo ".error { color: #f72585; margin: 10px 0; }";
echo ".back-link { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00b4d8; color: white; text-decoration: none; border-radius: 8px; }";
echo "</style>";
echo "</head>";
echo "<body>";

if ($sent) {
    echo "<div class='success'>";
    echo "<h1>✅ Message envoyé avec succès !</h1>";
    echo "<p>Merci <strong>$nom</strong> !</p>";
    echo "<p>Votre message a bien été reçu et je vous répondrai rapidement.</p>";
    echo "<p><strong>Email :</strong> $email</p>";
    echo "<p><strong>Message :</strong> $message</p>";
    echo "</div>";
} else {
    echo "<div class='success'>";
    echo "<h1>✅ Message reçu !</h1>";
    echo "<p>Merci <strong>$nom</strong> !</p>";
    echo "<p>Votre message a bien été enregistré :</p>";
    echo "<p><strong>Email :</strong> $email</p>";
    echo "<p><strong>Message :</strong> $message</p>";
    echo "<p><em>Note : L'envoi automatique par email n'est pas configuré sur ce serveur.</em></p>";
    echo "</div>";
}

echo "<a href='index.php' class='back-link'>Retour au portfolio</a>";
echo "</body>";
echo "</html>";

// Régénération du token CSRF
regenerateCsrfToken();
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
