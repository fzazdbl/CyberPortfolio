<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);
    exit;
}

$nom = trim(filter_input(INPUT_POST, 'nom', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$message = trim(filter_input(INPUT_POST, 'message', FILTER_UNSAFE_RAW));

if (!$nom || !$email || !$message) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Merci de vérifier les informations saisies.'
    ]);
    exit;
}

$to = 'chahidm126@gmail.com';
$subject = 'Nouveau message - CyberPortfolio';
$body = "Nom : {$nom}\nEmail : {$email}\n\n{$message}";
$headers = [
    'From' => $email,
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8'
];

$formattedHeaders = '';
foreach ($headers as $key => $value) {
    $formattedHeaders .= sprintf("%s: %s\r\n", $key, $value);
}

$sent = false;
if (function_exists('mail')) {
    $sent = mail($to, $subject, $body, $formattedHeaders);
}

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Le serveur n'a pas pu envoyer le message."
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Message envoyé avec succès.'
]);
