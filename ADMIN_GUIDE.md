# Guide d'administration du CyberPortfolio

## 🔐 Accès à l'administration

1. **Accédez à la page admin** : `http://localhost:8000/admin.html`
2. **Mot de passe par défaut** : `admin123`
3. **Connexion** : Entrez le mot de passe et cliquez sur "Se connecter"

## 📝 Modification du contenu

### Page d'accueil
- **Étiquette hero** : Texte qui apparaît en haut de la page
- **Titre principal** : Le titre principal de votre portfolio
- **Sous-titre** : Description de votre profil
- **Section vision** : Votre approche et philosophie
- **Domaines clés** : Titre de la section de vos compétences
- **Appel à l'action** : Message d'encouragement au contact

### Page compétences
- **Titre principal** : Titre de la page compétences
- **Sous-titre** : Description de votre niveau et parcours
- **Sections** : Titres des différentes sections (compétences, outils, apprentissage, projets)

### Page projets
- **Titre principal** : Titre de la page projets
- **Sous-titre** : Description de votre approche projet
- **Sections** : Titres des sections (projets marquants, prototypes)

### Page contact
- **Titre principal** : Titre de la page contact
- **Sous-titre** : Message d'invitation au contact
- **Formulaire** : Titre et instructions du formulaire
- **Message de confirmation** : Message affiché après envoi

## 🧭 Navigation

Modifiez les labels et liens de navigation :
- **Accueil** : Label et lien vers la page d'accueil
- **Compétences** : Label et lien vers la page compétences
- **Projets** : Label et lien vers la page projets
- **Contact** : Label et lien vers la page contact
- **Admin** : Label et lien vers la page admin

## 🔗 Réseaux sociaux

Mettez à jour vos liens :
- **GitHub** : URL de votre profil GitHub
- **LinkedIn** : URL de votre profil LinkedIn
- **E-mail** : Votre adresse email (format mailto:)

## 🎨 Personnalisation des couleurs

Modifiez les couleurs du thème :
- **Accent bleu** : Couleur principale du thème
- **Accent violet** : Couleur secondaire
- **Accent cyan** : Couleur d'accent

Les changements de couleurs sont appliqués en temps réel !

## 💾 Sauvegarde

1. **Remplissez** les champs que vous souhaitez modifier
2. **Cliquez** sur "Enregistrer les modifications"
3. **Confirmez** le rechargement de la page pour voir les changements

## 🔒 Sécurité

- **Changement de mot de passe** : Utilisez le formulaire en bas de page
- **Déconnexion** : Cliquez sur "Se déconnecter" pour fermer la session
- **Session** : Reste active jusqu'à la déconnexion ou fermeture du navigateur

## 📱 Responsive

L'interface d'administration s'adapte automatiquement :
- **Desktop** : Formulaire en colonnes
- **Tablet** : Formulaire adapté
- **Mobile** : Formulaire en une colonne

## 🚀 Fonctionnalités avancées

### Chargement automatique
- Les données sont chargées automatiquement depuis `assets/data/content.json`
- Les modifications sont sauvegardées dans le localStorage du navigateur

### Mise à jour en temps réel
- Les couleurs sont mises à jour instantanément
- Les changements sont visibles immédiatement

### Validation
- Les champs requis sont validés
- Messages d'erreur et de succès affichés

## 🛠️ Structure des données

Le fichier `assets/data/content.json` contient :
```json
{
  "home": { /* Contenu page d'accueil */ },
  "competences": { /* Contenu page compétences */ },
  "projects": { /* Contenu page projets */ },
  "contact": { /* Contenu page contact */ },
  "navigation": { /* Liens de navigation */ },
  "social": { /* Liens réseaux sociaux */ },
  "footer": { /* Texte du footer */ },
  "theme": { /* Couleurs du thème */ }
}
```

## 🔧 Dépannage

### Problèmes courants
1. **Mot de passe incorrect** : Vérifiez que vous utilisez `admin123`
2. **Changements non sauvegardés** : Vérifiez votre connexion internet
3. **Couleurs non appliquées** : Rechargez la page

### Support
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que tous les fichiers sont présents
- Le serveur local doit être démarré (`python -m http.server 8000`)

## 📋 Checklist de mise à jour

- [ ] Modifier les titres et descriptions
- [ ] Mettre à jour les liens sociaux
- [ ] Ajuster les couleurs du thème
- [ ] Tester sur mobile et desktop
- [ ] Sauvegarder les modifications
- [ ] Vérifier que tout fonctionne

Votre CyberPortfolio est maintenant entièrement personnalisable via l'interface d'administration !
