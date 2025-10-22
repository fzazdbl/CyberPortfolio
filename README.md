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

CyberPortfolio est un portfolio professionnel développé pour Mohamed Chahid, étudiant en BTS SIO (Services Informatiques aux Organisations) option SISR. Le site présente ses compétences en cybersécurité, développement web et administration système à travers une interface moderne et interactive.

### Caractéristiques principales

- **Design cyber futuriste** avec effets glassmorphism
- **Mode sombre/clair** avec toggle dynamique
- **Terminal de hacker interactif** pour explorer les projets
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
- **MySQL** - Base de données (pour Matomo)

### Outils et bibliothèques
- **Liquid Glass Renderer** - Effets de transparence
- **Intersection Observer API** - Animations au scroll
- **LocalStorage** - Sauvegarde des préférences
- **Schema.org** - Microdonnées SEO

## 📁 Structure du projet

```
CyberPortfolio/
├── index.html                          # Page d'accueil
├── admin.html                          # Interface d'administration
├── competences/
│   └── index.html                      # Page compétences
├── projets/
│   └── index.html                      # Page projets
├── projets-interactifs/
│   └── index.html                      # Terminal de hacker
├── contact/
│   ├── contact.html                    # Page contact
│   ├── contact.php                     # Traitement email
│   └── traitement.php                  # Traitement sécurisé
├── assets/
│   ├── css/
│   │   ├── style.css                   # Styles principaux
│   │   ├── theme.css                   # Variables de thème
│   │   ├── dark-mode.css               # Mode sombre/clair
│   │   ├── admin.css                   # Styles admin
│   │   └── liquid-glass-renderer.css   # Effets glassmorphism
│   ├── js/
│   │   ├── main.js                     # Scripts principaux
│   │   ├── form-validation.js          # Validation formulaires
│   │   ├── dark-mode.js                # Gestion thèmes
│   │   ├── scroll-animations.js        # Animations scroll
│   │   ├── terminal-hacker.js          # Terminal interactif
│   │   ├── admin-enhanced.js           # Administration
│   │   ├── content-manager.js          # Gestion contenu
│   │   └── liquid-glass-renderer.js    # Effets visuels
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

2. **Démarrer le serveur de développement**
   ```bash
   # Avec Python
   python -m http.server 8000
   
   # Avec PHP
   php -S localhost:8000
   
   # Avec Node.js (si http-server installé)
   npx http-server -p 8000
   ```

3. **Accéder au site**
   Ouvrir `http://localhost:8000` dans votre navigateur

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
L'interface d'administration permet de :
- Modifier tous les contenus du site
- Changer les couleurs du thème
- Mettre à jour les liens sociaux
- Gérer la navigation
- Changer le mot de passe admin

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
- ✅ **Protection CSRF** - Tokens de sécurité
- ✅ **Validation serveur** - Filtrage et nettoyage des données
- ✅ **Protection XSS** - Échappement des caractères
- ✅ **Headers sécurisés** - Configuration HTTP

### Performance
- ✅ **Lazy loading** - Chargement différé des ressources
- ✅ **Cache local** - Sauvegarde des préférences
- ✅ **Optimisation CSS** - Variables et réutilisation
- ✅ **JavaScript modulaire** - Code organisé et performant

## 🔒 Sécurité

### Mesures implémentées
- **Protection CSRF** avec tokens aléatoires
- **Validation et filtrage** des données d'entrée
- **Échappement HTML** pour prévenir les attaques XSS
- **Headers de sécurité** appropriés
- **Validation côté client et serveur**

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
