<?php
<<<<<<< HEAD
session_start();

// Génération du token CSRF
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Vérification de la méthode
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die("Méthode non autorisée.");
}

// Vérification du token CSRF
if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    die("Token CSRF invalide.");
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

echo "<a href='../index.html' class='back-link'>Retour au portfolio</a>";
echo "</body>";
echo "</html>";

// Régénération du token CSRF
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
?>
=======
if (["REQUEST_METHOD"] == "POST") {
  \ = htmlspecialchars(\['nom']);
  \ = htmlspecialchars(\['email']);
  \ = htmlspecialchars(\['message']);
  echo "<h1>Merci \ !</h1>";
  echo "<p>Votre message a bien été reçu :</p>";
  echo "<p><b>Email :</b> \</p>";
  echo "<p><b>Message :</b> \</p>";
}
?>
>>>>>>> 94d93fcf53c33038c5750ebee58bddab46bf0ff1
