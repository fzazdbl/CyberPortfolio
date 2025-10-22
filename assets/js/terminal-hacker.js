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
    this.typeWriter('Bienvenue dans le terminal de Mohamed !', 50);
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
  apache-config/     - Configuration Apache2
  matomo-deploy/     - Déploiement Matomo
  vm-lab/           - Laboratoire de virtualisation
  cyber-portfolio/  - Ce portfolio
  bts-sio-notes/    - Notes de cours BTS SIO
    `.trim();
    
    this.addLine(projects);
  }

  showFile(args) {
    if (!args[0]) {
      this.addLine('Usage: cat [fichier]', 'error');
      return;
    }
    
    const files = {
      'apache-config/README.md': `
# Configuration Apache2

## Description
Installation et configuration d'un serveur web Apache2 sur Debian.

## Commandes utilisées
- sudo apt update && sudo apt install apache2
- sudo systemctl enable apache2
- sudo systemctl start apache2
- sudo a2enmod rewrite
- sudo systemctl reload apache2

## Virtual Hosts
Configuration de virtual hosts pour héberger plusieurs sites.

## Sécurité
- Configuration des permissions
- Activation du module de sécurité
- Configuration du pare-feu
      `.trim(),
      
      'matomo-deploy/setup.sh': `
#!/bin/bash
# Script de déploiement Matomo

# Installation des dépendances
sudo apt update
sudo apt install -y apache2 mysql-server php php-mysql php-gd php-xml

# Téléchargement de Matomo
cd /var/www/html
sudo wget https://builds.matomo.org/matomo.zip
sudo unzip matomo.zip
sudo chown -R www-data:www-data matomo/

# Configuration de la base de données
mysql -u root -p -e "CREATE DATABASE matomo;"
mysql -u root -p -e "CREATE USER 'matomo'@'localhost' IDENTIFIED BY 'password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON matomo.* TO 'matomo'@'localhost';"

echo "Matomo installé avec succès !"
      `.trim(),
      
      'vm-lab/README.md': `
# Laboratoire de Virtualisation

## Environnements créés
- Debian 11 (serveur web)
- Kali Linux (tests de sécurité)
- Windows Server 2019 (AD)
- Ubuntu 20.04 (développement)

## Outils utilisés
- VMware Workstation Pro
- VirtualBox
- Vagrant (automatisation)

## Configuration réseau
- Réseau isolé pour les tests
- Configuration NAT et bridge
- Tests de connectivité inter-VM
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
Spécialité: Cybersécurité et systèmes
Localisation: France
Statut: En formation active
    `.trim();
    
    this.addLine(whoami);
  }

  showSkills() {
    const skills = `
Compétences techniques:
  Développement: HTML5, CSS3, JavaScript, Python, C#
  Systèmes: Debian, Windows, Apache2, MySQL
  Réseaux: Configuration, routage, VLAN
  Sécurité: Kali Linux, bonnes pratiques
  Outils: VS Code, VMware, VirtualBox, FileZilla
  Langues: Français (natif), Anglais (technique)
    `.trim();
    
    this.addLine(skills);
  }

  showAbout() {
    const about = `
À propos de Mohamed Chahid
========================

Étudiant passionné en BTS SIO (Services Informatiques aux Organisations)
option SISR (Solutions d'Infrastructure, Systèmes et Réseaux).

Objectif: Devenir expert en cybersécurité et administration système.

Passions: 
- Sécurité informatique
- Automatisation des tâches
- Développement web
- Veille technologique

Projets en cours:
- Portfolio interactif (ce site)
- Laboratoire de cybersécurité
- Scripts d'automatisation
- Études approfondies en sécurité
    `.trim();
    
    this.addLine(about);
  }

  showContact() {
    const contact = `
Informations de contact:
  Email: chahidm126@gmail.com
  GitHub: github.com/fzazdbl
  LinkedIn: linkedin.com/in/mohamed-chahid
  Téléphone: [Disponible sur demande]
  
Disponibilité: 
  Stage: À partir de juin 2025
  Projets: En continu
  Collaboration: Ouverte
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
    this.addLine('/home/cyber/portfolio');
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
    this.addLine('Initialisation de l\'effet Matrix...');
    this.addLine('Système de sécurité activé.');
    this.addLine('Surveillance en cours...');
    
    // Créer un effet Matrix simple
    const matrixChars = '01';
    let matrixText = '';
    for (let i = 0; i < 10; i++) {
      let line = '';
      for (let j = 0; j < 50; j++) {
        line += matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
      matrixText += line + '\n';
    }
    
    this.addLine(matrixText);
    this.addLine('Effet Matrix terminé.');
  }

  startHack() {
    this.addLine('Mode hacker activé...');
    this.addLine('Connexion au serveur cible...');
    this.addLine('Scanning des ports...');
    this.addLine('Port 22 (SSH): Ouvert');
    this.addLine('Port 80 (HTTP): Ouvert');
    this.addLine('Port 443 (HTTPS): Ouvert');
    this.addLine('Tentative de connexion...');
    this.addLine('Authentification réussie !');
    this.addLine('Accès root obtenu.');
    this.addLine('Mission accomplie ! 🎯');
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
function showApacheDemo() {
  alert('Démonstration Apache2\n\nCette démo montrerait:\n- Configuration des virtual hosts\n- Gestion des modules\n- Sécurisation du serveur\n- Monitoring des logs');
}

function showMatomoDemo() {
  alert('Démonstration Matomo\n\nCette démo montrerait:\n- Interface d\'administration\n- Configuration des sites\n- Tableaux de bord personnalisés\n- Rapports d\'analytics');
}

function showVMDemo() {
  alert('Démonstration VM\n\nCette démo montrerait:\n- Gestion des machines virtuelles\n- Configuration réseau\n- Snapshots et sauvegardes\n- Monitoring des ressources');
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
