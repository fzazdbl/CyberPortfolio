# ✅ Checklist de validation - CyberPortfolio

## 🔐 Tests de sécurité

### Authentification admin
- [ ] Aller sur `/login.php`
- [ ] Vérifier que le formulaire affiche correctement
- [ ] Tenter de se connecter avec un mauvais mot de passe → doit afficher une erreur
- [ ] Se connecter avec le bon mot de passe (TestPassword123! en test) → doit rediriger vers `/admin.php`
- [ ] Vérifier que `/admin.php` est accessible après connexion
- [ ] Tenter d'accéder à `/admin.php` sans connexion → doit rediriger vers `/login.php`
- [ ] Tester le bouton "Se déconnecter" → doit rediriger vers `index.html`
- [ ] Vérifier le rate limiting: 6 tentatives de connexion rapides → doit bloquer temporairement

### Formulaire de contact
- [ ] Aller sur `/contact/index.php`
- [ ] Vérifier que le formulaire s'affiche avec tous les champs
- [ ] Soumettre le formulaire vide → doit afficher des erreurs de validation
- [ ] Soumettre avec un email invalide → doit refuser
- [ ] Soumettre avec un message trop court (< 10 caractères) → doit refuser
- [ ] Soumettre 4 fois rapidement → la 4ème doit être bloquée (rate limiting)
- [ ] Soumettre avec des données valides → doit afficher la page de confirmation
- [ ] Vérifier que le token CSRF est présent dans le HTML (view source)

### Headers HTTP
- [ ] Vérifier les headers avec: `curl -I https://votre-site.fr`
- [ ] Vérifier présence de `Content-Security-Policy`
- [ ] Vérifier présence de `X-Frame-Options: DENY`
- [ ] Vérifier présence de `X-Content-Type-Options: nosniff`
- [ ] Vérifier présence de `Strict-Transport-Security` (si HTTPS)

### Protection des fichiers
- [ ] Tenter d'accéder à `/includes/credentials.php` → doit être bloqué (403)
- [ ] Tenter d'accéder à `/.git/` → doit être bloqué (403)
- [ ] Tenter d'accéder à `/.gitignore` → doit être bloqué ou inexistant

## 🔍 Tests SEO

### Robots et sitemap
- [ ] Accéder à `/robots.txt` → doit afficher le contenu correct
- [ ] Vérifier que `test-performance.html` est dans Disallow
- [ ] Vérifier que `admin.php` est dans Disallow
- [ ] Accéder à `/sitemap.xml` → doit lister toutes les pages publiques
- [ ] Vérifier que les pages admin ne sont PAS dans le sitemap

### Open Graph et Twitter Cards
- [ ] Inspecter le `<head>` de `index.html` → doit contenir les balises OG
- [ ] Vérifier présence de `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Vérifier présence des balises Twitter Card
- [ ] Tester avec https://cards-dev.twitter.com/validator (si en ligne)
- [ ] Tester avec https://developers.facebook.com/tools/debug/ (si en ligne)

### Page 404
- [ ] Accéder à une page inexistante → doit afficher `404.html`
- [ ] Vérifier le design de la page 404
- [ ] Tester les liens "Retour à l'accueil" et "Nous contacter"

### Meta robots
- [ ] Vérifier `<meta name="robots" content="noindex,nofollow">` sur:
  - [ ] `/login.php`
  - [ ] `/admin.php`
  - [ ] `/test-performance.html`

## ♿ Tests d'accessibilité

### Navigation clavier
- [ ] Appuyer sur Tab dès l'arrivée sur `index.html`
- [ ] Le premier élément focusé doit être le skip link
- [ ] Appuyer sur Entrée sur le skip link → doit sauter au contenu principal
- [ ] Continuer à naviguer avec Tab → tous les éléments interactifs doivent être accessibles
- [ ] Vérifier que le focus est visible sur tous les éléments (outline bleu)

### Skip links
- [ ] Vérifier présence sur toutes les pages:
  - [ ] index.html
  - [ ] competences/index.html
  - [ ] projets/index.html
  - [ ] projets-interactifs/index.html
  - [ ] contact/index.php
  - [ ] 404.html

### Contraste et lisibilité
- [ ] Tester en mode clair → texte lisible
- [ ] Tester en mode sombre → texte lisible
- [ ] Vérifier avec l'outil de contraste du navigateur

### Lecteur d'écran (optionnel)
- [ ] Tester avec NVDA (Windows) ou VoiceOver (Mac)
- [ ] Vérifier que la navigation est logique
- [ ] Vérifier que les images ont des alt text

## ⚡ Tests de performance

### Lighthouse
- [ ] Ouvrir DevTools → onglet Lighthouse
- [ ] Lancer l'audit sur `index.html`
- [ ] Vérifier les scores:
  - [ ] Performance ≥ 90
  - [ ] Accessibility ≥ 90
  - [ ] Best Practices ≥ 90
  - [ ] SEO ≥ 90
- [ ] Répéter pour `competences/index.html` et `projets/index.html`

### Chargement des ressources
- [ ] Ouvrir l'onglet Network
- [ ] Vérifier que les images SVG se chargent correctement
- [ ] Vérifier que Font Awesome se charge depuis CDN
- [ ] Vérifier qu'il n'y a pas de ressources bloquées par CSP (console)

### WebGL Fallback
- [ ] Ouvrir la console
- [ ] Si WebGL non supporté → doit afficher un warning
- [ ] Le site doit rester fonctionnel sans WebGL

## 📱 Tests responsive

### Mobile
- [ ] Ouvrir DevTools → Toggle device toolbar
- [ ] Tester sur iPhone SE (375x667)
- [ ] Tester sur iPhone 12 Pro (390x844)
- [ ] Tester sur iPad (768x1024)
- [ ] Vérifier que:
  - [ ] Le menu hamburger fonctionne
  - [ ] Les textes sont lisibles
  - [ ] Les boutons sont cliquables
  - [ ] Le formulaire de contact est utilisable

### Tablet et Desktop
- [ ] Tester sur iPad Pro (1024x1366)
- [ ] Tester sur desktop (1920x1080)
- [ ] Vérifier que la mise en page s'adapte bien

## 🔗 Tests de liens

### Navigation interne
- [ ] Tous les liens du menu principal fonctionnent
- [ ] Le lien "Admin" redirige vers `/admin.php` ou `/login.php`
- [ ] Le lien "Contact" redirige vers `/contact/index.php`
- [ ] Les liens du footer fonctionnent

### Liens sociaux
- [ ] GitHub ouvre dans un nouvel onglet
- [ ] LinkedIn ouvre dans un nouvel onglet
- [ ] Email ouvre le client mail

## 🎨 Tests visuels

### Thème clair/sombre
- [ ] Le toggle de thème fonctionne
- [ ] Le thème choisi est persisté (localStorage)
- [ ] Les couleurs sont cohérentes
- [ ] Les effets glassmorphism fonctionnent

### Animations
- [ ] Les animations au scroll fonctionnent (reveal)
- [ ] Les boutons ont des effets hover
- [ ] Les transitions sont fluides
- [ ] Pas de saccades ou de lag

## 🐛 Tests de régression

### Fonctionnalités existantes
- [ ] Le terminal interactif fonctionne
- [ ] Les commandes du terminal répondent
- [ ] Les projets s'affichent correctement
- [ ] Les compétences sont listées
- [ ] Le CV est accessible

### Aucune régression
- [ ] Pas d'erreurs JavaScript dans la console
- [ ] Pas d'erreurs 404 sur les ressources
- [ ] Pas d'avertissements CSP dans la console
- [ ] Toutes les images se chargent

## ✅ Validation finale

### Checklist globale
- [ ] Tous les tests de sécurité passent
- [ ] Tous les tests SEO passent
- [ ] Tous les tests d'accessibilité passent
- [ ] Tous les tests de performance passent
- [ ] Lighthouse ≥ 90 sur toutes les catégories
- [ ] 0 Blocker / 0 Major
- [ ] Documentation à jour

### Prêt pour la production
- [ ] `includes/credentials.php` créé avec mot de passe sécurisé
- [ ] HTTPS activé et redirection configurée
- [ ] Headers HTTP vérifiés
- [ ] Tous les tests passent
- [ ] Backup effectué avant déploiement

---

**Date du test**: _______________

**Testeur**: _______________

**Résultat global**: ⬜ PASS | ⬜ FAIL

**Notes**: 
