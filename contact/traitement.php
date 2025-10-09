<?php
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
