<?php
/**
 * Traitement sécurisé du formulaire de contact - CyberPortfolio
 */
require_once __DIR__ . '/../includes/security.php';

// Vérification de la méthode
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die("Méthode non autorisée.");
}

// Vérification du token CSRF
$token = $_POST['csrf_token'] ?? '';
if (!verifyCsrfToken($token)) {
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

// Validation des champs
$errors = [];

if (!$nom || strlen($nom) < 2) {
    $errors[] = "Le nom doit contenir au moins 2 caractères.";
}

if (!$email) {
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

// Envoi de l'email (optionnel - pour serveur avec mail())
$to = 'chahidm126@gmail.com';
$subject = 'Nouveau message - CyberPortfolio';
$body = "Nom : $nom\nEmail : $email\n\nMessage :\n$message";
$headers = [
    'From' => $email,
    'Reply-To' => $email,
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
?>