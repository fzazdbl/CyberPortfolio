# 🚀 CyberPortfolio - Mohamed Chahid

Portfolio professionnel interactif développé avec des technologies modernes et un design cyber futuriste.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Sécurité](#sécurité)
- [Performance](#performance)
- [Contributions](#contributions)
- [Licence](#licence)

## 🎯 Aperçu

CyberPortfolio est un portfolio professionnel développé pour Mohamed Chahid, étudiant en BTS SIO (Services Informatiques aux Organisations) option SISR. Le site met désormais en avant la conception et l'intégration du site officiel des **Joutes 2025** ainsi que le développement d'une **application Deezer** connectée à l'API officielle, en détaillant le travail de design UX, d'intégration front-end, d'optimisation SEO et de développement applicatif.

### Caractéristiques principales

- **Design glassmorphism lumineux** inspiré des joutes languedociennes
- **Mode sombre/clair** avec toggle dynamique
- **Terminal interactif** pour explorer les études de cas Joutes 2025 & Deezer
- **Application Deezer Windows** : recherche d'artistes, discographie et extraits audio via l'API officielle
- **Timeline de compétences** animée
- **Système d'administration** complet
- **Validation de formulaires** côté client et serveur
- **Protection CSRF** et sécurité renforcée
- **Responsive design** adaptatif
- **Animations fluides** et effets visuels

## 🛠️ Technologies utilisées

### Frontend
- **HTML5** - Structure sémantique et accessible
- **CSS3** - Styles modernes avec variables CSS et animations
- **JavaScript ES6+** - Interactivité et logique métier
- **Font Awesome 6.5.1** - Icônes vectorielles

### Backend
- **PHP 8.0+** - Traitement des formulaires et sécurité
- **MySQL** - Stockage optionnel des demandes de contact

### Outils et bibliothèques
- **Liquid Glass Renderer** - Effets de transparence
- **Intersection Observer API** - Animations au scroll
- **LocalStorage** - Sauvegarde des préférences
- **Schema.org** - Microdonnées SEO

## 📁 Structure du projet

```
CyberPortfolio/
├── index.html                          # Page d'accueil
├── admin.html                          # Redirection vers admin.php (déprécié)
├── admin.php                           # Interface d'administration sécurisée
├── login.php                           # Page de connexion admin
├── logout.php                          # Déconnexion admin
├── 404.html                            # Page d'erreur personnalisée
├── robots.txt                          # Instructions pour les robots
├── sitemap.xml                         # Plan du site pour SEO
├── .htaccess                           # Configuration Apache & sécurité
├── .gitignore                          # Fichiers exclus du versioning
├── competences/
│   └── index.html                      # Page compétences
├── projets/
│   └── index.html                      # Page projets
├── projets-interactifs/
│   └── index.html                      # Terminal de hacker
├── contact/
│   ├── index.php                       # Page contact avec token CSRF
│   ├── contact.html                    # Ancienne page (redirige vers index.php)
│   └── traitement.php                  # Traitement sécurisé du formulaire
├── includes/
│   ├── security.php                    # Fonctions de sécurité (CSRF, honeypot, rate limiting)
│   └── credentials.example.php         # Template pour credentials (à copier)
├── assets/
│   ├── css/
│   │   ├── style.css                   # Styles principaux
│   │   ├── theme.css                   # Variables de thème et accessibilité
│   │   ├── admin.css                   # Styles admin
│   │   └── liquid-glass-renderer.css   # Effets glassmorphism
│   ├── js/
│   │   ├── main.js                     # Scripts principaux
│   │   ├── form-validation.js          # Validation formulaires
│   │   ├── ui-toggles.js               # Bascule thème & navigation mobile
│   │   ├── scroll-animations.js        # Animations scroll
│   │   ├── terminal-hacker.js          # Terminal interactif
│   │   ├── admin-enhanced.js           # Administration (client)
│   │   ├── content-manager.js          # Gestion contenu local
│   │   └── liquid-glass-renderer.js    # Effets visuels avec fallback WebGL
│   ├── images/
│   │   ├── logo-cyber.svg              # Logo principal
│   │   ├── cyber-pattern.svg           # Pattern décoratif
│   │   └── tech-icons.svg              # Icônes technologies
│   └── data/
│       └── content.json                # Données du site
└── README.md                           # Documentation
```

## 🚀 Installation

### Prérequis
- Serveur web (Apache2, Nginx, ou serveur de développement)
- PHP 8.0 ou supérieur
- Navigateur moderne supportant ES6+

### Installation locale

1. **Cloner le projet**
   ```bash
   git clone https://github.com/fzazdbl/cyberportfolio.git
   cd cyberportfolio
   ```

2. **Configurer l'authentification admin**
   
   a. Créer le fichier de credentials:
   ```bash
   cp includes/credentials.example.php includes/credentials.php
   ```
   
   b. Générer un hash de mot de passe sécurisé:
   ```bash
   php -r "echo password_hash('VotreMotDePasseSecurise', PASSWORD_DEFAULT);"
   ```
   
   c. Éditer `includes/credentials.php` et remplacer le hash d'exemple par votre hash généré

3. **Démarrer le serveur de développement**
   ```bash
   # Avec PHP (recommandé pour tester les fonctionnalités PHP)
   php -S localhost:8000
   
   # Avec Python (HTML/CSS/JS uniquement)
   python -m http.server 8000
   
   # Avec Node.js (si http-server installé)
   npx http-server -p 8000
   ```

4. **Accéder au site**
   Ouvrir `http://localhost:8000` dans votre navigateur
   
5. **Accéder à l'administration**
   - Aller sur `http://localhost:8000/login.php`
   - Se connecter avec votre mot de passe configuré

### Installation sur serveur

1. **Uploader les fichiers** sur votre serveur web
2. **Configurer les permissions** pour les dossiers d'écriture
3. **Configurer PHP** pour l'envoi d'emails (optionnel)
4. **Tester** toutes les fonctionnalités

## 💻 Utilisation

### Navigation
- **Accueil** : Présentation générale et vision
- **Compétences** : Timeline et compétences techniques
- **Mes projets** : Projets réalisés et en cours
- **Projets interactifs** : Terminal de hacker et démos
- **Contact** : Formulaire de contact sécurisé
- **Admin** : Interface d'administration (mot de passe: `admin123`)

### Terminal de hacker
Le terminal interactif permet d'explorer les projets avec des commandes Linux :
- `help` - Afficher l'aide
- `ls` - Lister les projets
- `cat [fichier]` - Afficher le contenu d'un fichier
- `whoami` - Informations utilisateur
- `skills` - Compétences techniques
- `neofetch` - Informations système
- `matrix` - Effet Matrix
- `hack` - Mode hacker

### Administration
L'interface d'administration (`admin.php`) permet de :
- Modifier tous les contenus du site
- Changer les couleurs du thème
- Mettre à jour les liens sociaux
- Gérer la navigation

**Note**: L'authentification se fait maintenant via `login.php` avec un système PHP sécurisé (sessions, password_hash). L'ancienne page `admin.html` redirige vers la nouvelle version.

## ⚡ Fonctionnalités

### Design et UX
- ✅ **Glassmorphism** - Effets de transparence modernes
- ✅ **Mode sombre/clair** - Toggle dynamique
- ✅ **Animations fluides** - Transitions CSS optimisées
- ✅ **Responsive design** - Adaptatif mobile/tablet/desktop
- ✅ **Accessibilité** - Attributs ARIA et navigation clavier

### Interactivité
- ✅ **Terminal de hacker** - Interface interactive
- ✅ **Timeline animée** - Parcours de compétences
- ✅ **Démonstrations** - Projets en action
- ✅ **Validation temps réel** - Formulaires intelligents

### Sécurité
- ✅ **Authentification PHP sécurisée** - password_hash/password_verify
- ✅ **Protection CSRF** - Tokens de sécurité côté serveur
- ✅ **Honeypot anti-bot** - Champs cachés pour détecter les bots
- ✅ **Rate limiting** - Limitation des tentatives
- ✅ **Validation serveur** - Filtrage et nettoyage des données
- ✅ **Protection XSS** - Échappement des caractères
- ✅ **Headers sécurisés** - CSP, HSTS, X-Frame-Options

### Performance
- ✅ **Lazy loading** - Chargement différé des ressources
- ✅ **Cache local** - Sauvegarde des préférences
- ✅ **Optimisation CSS** - Variables et réutilisation
- ✅ **JavaScript modulaire** - Code organisé et performant
- ✅ **Compression GZIP** - Réduction de la taille des fichiers

## 🔒 Sécurité

### Authentification
- **PHP sessions** - Gestion sécurisée des sessions utilisateur
- **password_hash()** - Hachage bcrypt des mots de passe
- **password_verify()** - Vérification sécurisée des identifiants
- **Session timeout** - Expiration automatique des sessions

### Protection des formulaires
- **Tokens CSRF** générés côté serveur
- **Honeypot** - Champs cachés pour piéger les bots
- **Rate limiting** - 3 tentatives par 10 minutes sur le formulaire de contact
- **Validation stricte** - filter_input et htmlspecialchars

### En-têtes de sécurité (.htaccess)
```apache
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Mesures additionnelles
- **Fichiers sensibles protégés** - credentials.php exclu du versioning
- **Pages admin non indexées** - robots.txt et meta noindex
- **Redirection HTTPS** - Configuration Apache disponible
- **404 personnalisée** - Pas de divulgation d'informations

### Recommandations
- Changer le mot de passe admin par défaut
- Configurer HTTPS en production
- Mettre à jour régulièrement les dépendances
- Surveiller les logs d'erreurs

## 📊 Performance

### Optimisations
- **CSS minifié** et optimisé
- **JavaScript modulaire** avec chargement différé
- **Images SVG** pour les icônes
- **Animations GPU** accélérées
- **Cache navigateur** configuré

### Métriques
- **Temps de chargement** : < 2s
- **Score Lighthouse** : 90+
- **Accessibilité** : WCAG 2.1 AA
- **SEO** : Optimisé avec Schema.org

## 🤝 Contributions

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Mohamed Chahid**
- Email: chahidm126@gmail.com
- GitHub: [@fzazdbl](https://github.com/fzazdbl)
- LinkedIn: [Mohamed Chahid](https://www.linkedin.com/in/mohamed-chahid)

## 🙏 Remerciements

- **Font Awesome** pour les icônes
- **Google Fonts** pour les polices
- **Communauté open source** pour l'inspiration
- **BTS SIO** pour la formation technique

---

*Développé avec ❤️ et beaucoup de ☕ par Mohamed Chahid*
