// Terminal de hacker interactif
class TerminalHacker {
  constructor() {
    this.commands = {
      help: this.showHelp.bind(this),
      ls: this.listProjects.bind(this),
      cat: this.showFile.bind(this),
      whoami: this.showWhoami.bind(this),
      skills: this.showSkills.bind(this),
      projects: this.listProjects.bind(this),
      clear: this.clearTerminal.bind(this),
      about: this.showAbout.bind(this),
      contact: this.showContact.bind(this),
      github: this.openGitHub.bind(this),
      linkedin: this.openLinkedIn.bind(this),
      email: this.openEmail.bind(this),
      pwd: this.showPwd.bind(this),
      date: this.showDate.bind(this),
      uptime: this.showUptime.bind(this),
      neofetch: this.showNeofetch.bind(this),
      matrix: this.startMatrix.bind(this),
      hack: this.startHack.bind(this)
    };
    
    this.history = [];
    this.historyIndex = -1;
    this.init();
  }

  init() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (!terminalInput || !terminalOutput) return;

    terminalInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
    terminalInput.addEventListener('input', (e) => this.handleInput(e));
    
    // Focus automatique
    terminalInput.focus();
    
    // Animation de frappe
    this.typeWriter('Bienvenue dans le terminal de Mohamed — Joutes 2025 & Deezer !', 50);
  }

  handleKeyDown(e) {
    const terminalInput = document.getElementById('terminal-input');
    
    if (e.key === 'Enter') {
      e.preventDefault();
      this.executeCommand(terminalInput.value.trim());
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autoComplete(terminalInput.value);
    }
  }

  handleInput(e) {
    // Auto-complétion en temps réel
    const value = e.target.value;
    if (value.length > 0) {
      this.showSuggestions(value);
    } else {
      this.hideSuggestions();
    }
  }

  executeCommand(input) {
    if (!input) return;
    
    // Ajouter à l'historique
    this.history.push(input);
    this.historyIndex = this.history.length;
    
    // Afficher la commande
    this.addLine(`cyber@portfolio:~$ ${input}`);
    
    // Exécuter la commande
    const [command, ...args] = input.split(' ');
    
    if (this.commands[command]) {
      this.commands[command](args);
    } else {
      this.addLine(`Commande non trouvée: ${command}. Tapez 'help' pour voir les commandes disponibles.`, 'error');
    }
  }

  addLine(text, type = 'normal') {
    const terminalOutput = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    
    if (type === 'error') {
      line.innerHTML = `<span class="terminal-error">${text}</span>`;
    } else {
      line.innerHTML = `<span class="terminal-text">${text}</span>`;
    }
    
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  typeWriter(text, speed = 50) {
    let i = 0;
    const terminalOutput = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    terminalOutput.appendChild(line);
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        line.innerHTML += text.charAt(i);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);
  }

  showHelp() {
    const helpText = `
Commandes disponibles:
  help          - Afficher cette aide
  ls            - Lister les projets
  cat [fichier] - Afficher le contenu d'un fichier
  whoami        - Afficher les informations utilisateur
  skills        - Afficher les compétences
  projects      - Lister les projets détaillés
  about         - À propos de Mohamed
  contact       - Informations de contact
  github        - Ouvrir GitHub
  linkedin      - Ouvrir LinkedIn
  email         - Ouvrir l'email
  pwd           - Afficher le répertoire courant
  date          - Afficher la date actuelle
  uptime        - Temps de fonctionnement
  neofetch      - Informations système
  matrix        - Effet Matrix
  hack          - Mode hacker
  clear         - Effacer le terminal
    `.trim();
    
    this.addLine(helpText);
  }

  listProjects() {
    const projects = `
Projets disponibles:
  joutes2025/       - Site officiel des Joutes 2025
  deezer-app/       - Application Windows connectée à l'API Deezer
    `.trim();

    this.addLine(projects);
  }

  showFile(args) {
    if (!args[0]) {
      this.addLine('Usage: cat [fichier]', 'error');
      return;
    }

    const files = {
      'joutes2025/README.md': `
# Site officiel des Joutes 2025

## Objectif
Présenter l'édition 2025, faciliter les inscriptions et partager l'ambiance des joutes languedociennes.

## Pages clés
- Accueil immersif avec compte à rebours
- Programme détaillé des épreuves
- Espace partenaires et médias
- Formulaire d'inscription simplifié

## Tech & design
- HTML5/CSS3, animations CSS & JavaScript
- Design system glassmorphism
- Optimisation SEO (données structurées, Open Graph)
      `.trim(),

      'deezer-app/README.md': `
# Application Deezer — Recherche artistique

## Objectif
Permettre de rechercher un artiste, découvrir sa discographie et écouter des extraits directement depuis l'API Deezer.

## Modules principaux
- Champ de recherche avec suggestions et gestion des homonymes
- Fiches artistes avec biographie, top titres et lien Deezer
- Liste d'albums et lecture des extraits 30 secondes
- Accès direct à la radio officielle de l'artiste

## Tech & design
- C#/.NET (Windows Forms)
- Requêtes REST Deezer (axios/.NET HttpClient)
- Parsing JSON et affichage structuré
- Lecteur audio intégré et ouverture du lien Deezer
      `.trim()
    };
    
    const content = files[args[0]];
    if (content) {
      this.addLine(content);
    } else {
      this.addLine(`Fichier non trouvé: ${args[0]}`, 'error');
    }
  }

  showWhoami() {
    const whoami = `
Utilisateur: cyber
Nom: Mohamed Chahid
Rôle: Étudiant BTS SIO (SISR)
Spécialité: Design UX, intégration web & API Deezer
Localisation: France
Statut: Disponible pour projets vitrines & applications connectées
    `.trim();

    this.addLine(whoami);
  }

  showSkills() {
    const skills = `
Compétences clés:
  Design: storytelling événementiel, moodboards, maquettes Figma
  Intégration: HTML5, CSS3, animations glassmorphism, JavaScript
  API: C#/.NET, requêtes Deezer, parsing JSON, lecteur audio intégré
  SEO: métadonnées, données structurées, optimisation des performances
  Outils: Figma, VS Code, Visual Studio, Git, Postman, Notion
    `.trim();

    this.addLine(skills);
  }

  showAbout() {
    const about = `
À propos de Mohamed Chahid
========================

Étudiant BTS SIO (SISR) spécialisé dans les expériences web et applicatives.

Objectif: Concevoir des interfaces immersives et des outils connectés aux données réelles.

Focus 2025:
- Site officiel des Joutes 2025 (design, intégration, SEO)
- Application Deezer Windows (API, audio, UX desktop)
- Préparation des prochaines éditions et évolutions fonctionnelles
    `.trim();
    
    this.addLine(about);
  }

  showContact() {
    const contact = `
Informations de contact:
  Email: chahidm126@gmail.com
  GitHub: github.com/fzazdbl
  LinkedIn: linkedin.com/in/mohamed-chahid
  Site Joutes: https://joremy34.com/

Démo Deezer:
  Disponible sur rendez-vous (capture + application Windows)

Disponibilité:
  Sites vitrines & SEO: OUI
  Applications connectées: OUI
  Support communication: sur demande
    `.trim();
    
    this.addLine(contact);
  }

  openGitHub() {
    this.addLine('Ouverture de GitHub...');
    setTimeout(() => {
      window.open('https://github.com/fzazdbl', '_blank');
    }, 1000);
  }

  openLinkedIn() {
    this.addLine('Ouverture de LinkedIn...');
    setTimeout(() => {
      window.open('https://www.linkedin.com/in/mohamed-chahid', '_blank');
    }, 1000);
  }

  openEmail() {
    this.addLine('Ouverture de l\'email...');
    setTimeout(() => {
      window.open('mailto:chahidm126@gmail.com', '_blank');
    }, 1000);
  }

  showPwd() {
    this.addLine('/home/cyber/projets');
  }

  showDate() {
    const now = new Date();
    this.addLine(now.toLocaleString('fr-FR'));
  }

  showUptime() {
    const uptime = Math.floor(Math.random() * 100) + 50;
    this.addLine(`Système actif depuis ${uptime} jours, 12 heures, 34 minutes`);
  }

  showNeofetch() {
    const neofetch = `
    ╭─────────────────────────────────────╮
    │  cyber@portfolio                    │
    ├─────────────────────────────────────┤
    │  OS: Debian 11 (Bullseye)          │
    │  Kernel: 5.10.0-8-amd64            │
    │  Shell: bash 5.1.4                 │
    │  Terminal: cyber-terminal v1.0      │
    │  CPU: Intel i7-10700K               │
    │  RAM: 16GB DDR4                    │
    │  Storage: 1TB NVMe SSD             │
    │  Uptime: 15 days, 3 hours          │
    │  Packages: 2,847 installed         │
    │  Resolution: 1920x1080             │
    │  WM: i3-gaps                       │
    │  Theme: Cyber Dark                 │
    ╰─────────────────────────────────────╯
    `.trim();
    
    this.addLine(neofetch);
  }

  startMatrix() {
    this.addLine('Initialisation du rideau lumineux des Joutes & de la scène Deezer...');
    this.addLine('Animation des reflets glassmorphism.');
    this.addLine('Ambiance festive et musicale en cours...');

    // Effet lumineux simplifié
    const matrixChars = '✦✧✺✹';
    let matrixText = '';
    for (let i = 0; i < 10; i++) {
      let line = '';
      for (let j = 0; j < 50; j++) {
        line += matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
      matrixText += line + '\n';
    }

    this.addLine(matrixText);
    this.addLine('Effet lumineux terminé.');
  }

  startHack() {
    this.addLine('Mode créatif activé...');
    this.addLine('Chargement des palettes colorées...');
    this.addLine('Insertion des textures glassmorphism...');
    this.addLine('Connexion à l\'API Deezer...');
    this.addLine('Optimisation des performances...');
    this.addLine('Site des Joutes 2025 et app Deezer prêts à être présentés ! 🎉');
  }

  clearTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    terminalOutput.innerHTML = '';
  }

  navigateHistory(direction) {
    if (this.history.length === 0) return;
    
    this.historyIndex += direction;
    
    if (this.historyIndex < 0) {
      this.historyIndex = 0;
    } else if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length;
    }
    
    const terminalInput = document.getElementById('terminal-input');
    if (this.historyIndex < this.history.length) {
      terminalInput.value = this.history[this.historyIndex];
    } else {
      terminalInput.value = '';
    }
  }

  autoComplete(input) {
    const matches = Object.keys(this.commands).filter(cmd => 
      cmd.startsWith(input.toLowerCase())
    );
    
    if (matches.length === 1) {
      const terminalInput = document.getElementById('terminal-input');
      terminalInput.value = matches[0];
    } else if (matches.length > 1) {
      this.addLine(`Suggestions: ${matches.join(', ')}`);
    }
  }

  showSuggestions(input) {
    // Implémentation des suggestions en temps réel
    const matches = Object.keys(this.commands).filter(cmd => 
      cmd.startsWith(input.toLowerCase())
    );
    
    if (matches.length > 0) {
      // Afficher les suggestions (implémentation simplifiée)
      console.log('Suggestions:', matches);
    }
  }

  hideSuggestions() {
    // Cacher les suggestions
  }
}

// Fonctions pour les démonstrations
function showHeroDemo() {
  alert('Hero animé\n\nCette démo montrerait:\n- Halo lumineux et reflets glassmorphism\n- Compte à rebours dynamique\n- CTA mis en avant pour les inscriptions\n- Adaptation mobile instantanée');
}

function showScheduleDemo() {
  alert('Programme interactif\n\nCette démo montrerait:\n- Chronologie filtrable par journée\n- Mise en avant des temps forts\n- Badges pour différencier les catégories\n- Effets de survol pour plus d\'infos');
}

function showDeezerDemo() {
  alert('Recherche Deezer\n\nCette démo montrerait:\n- Saisie du nom d\'un artiste et suggestions immédiates\n- Affichage de la discographie (albums, top titres)\n- Lecture de courts extraits audio et accès à la radio Deezer\n- Lien direct vers la page officielle Deezer');
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  new TerminalHacker();
  
  // Gestion des onglets de compétences
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillPanels = document.querySelectorAll('.skill-panel');
  
  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const skill = tab.dataset.skill;
      
      // Retirer la classe active de tous les onglets et panneaux
      skillTabs.forEach(t => t.classList.remove('active'));
      skillPanels.forEach(p => p.classList.remove('active'));
      
      // Ajouter la classe active à l'onglet et au panneau sélectionnés
      tab.classList.add('active');
      document.getElementById(`${skill}-panel`).classList.add('active');
      
      // Animer les barres de progression
      animateProgressBars();
    });
  });
  
  // Animation des barres de progression
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      const progress = bar.dataset.progress;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = `${progress}%`;
      }, 100);
    });
  }
  
  // Animation initiale
  animateProgressBars();
});
