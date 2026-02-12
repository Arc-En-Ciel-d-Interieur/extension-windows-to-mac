# 🔗 Win-to-Mac Link Converter

Une extension Google Chrome légère et élégante pour mettre fin à la "guerre des slashs". Elle convertit instantanément les chemins réseau Windows (UNC) en liens SMB compatibles macOS.

## 🚀 Pourquoi cette extension ?

En entreprise, les utilisateurs Windows partagent souvent des liens de serveurs sous la forme `\\SERVEUR\Dossier`. Ces liens ne sont pas cliquables sur Mac. Cette extension permet de les transformer en `smb://SERVEUR/Dossier` en un clic, directement via une interface injectée dans votre page web.

## ✨ Fonctionnalités

* **Interface Overlay :** Pas de popup restrictive ; un panneau stylisé s'affiche par-dessus votre page active.
* **Conversion Intelligente :** Remplace les antislashs (`\`) par des slashs (`/`) et ajoute le préfixe `smb:`.
* **Auto-Copy :** Le lien converti peut être copié dans votre presse-papiers après la conversion.
* **Design Moderne :** Interface sobre inspirée des outils de productivité.

## 📂 Structure du Projet

Basé sur l'arborescence standard du projet :

* `manifest.json` : Configuration de l'extension (V3).
* `background.js` : Gestionnaire d'événements pour le clic sur l'icône.
* `content.js` : Logique d'injection de l'interface et script de conversion.
* `assets/` : Icônes de l'extension (16x16, 48x48, 128x128).

## 🛠 Installation (Mode Développeur)

1. **Téléchargez** ou clonez ce dépôt sur votre machine.
2. Ouvrez Google Chrome et accédez à `chrome://extensions/`.
3. Activez le **Mode développeur** en haut à droite de la page.
4. Cliquez sur **Charger l'extension dépaquetée**.
5. Sélectionnez le dossier racine du projet.

## 📖 Utilisation

1. Cliquez sur l'icône de l'extension dans votre barre d'outils Chrome.
2. L'overlay s'affiche au centre de votre écran.
3. Collez votre chemin Windows (ex: `\\MonServeur\Pole\Projet`).
4. Cliquez sur **Convertir**.
5. Le lien Mac ou Windows est prêt à être copié ! Collez-le dans votre Finder (`Cmd + K`) ou votre explorateur Windows ou votre navigateur.

---

*Développé avec soin pour faciliter la collaboration inter-plateformes.*
