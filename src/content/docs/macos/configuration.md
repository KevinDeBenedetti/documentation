---
title: Configurer macOS
description: Guide de configuration macOS.
sidebar:
    order: 1
    label: Configuration
---

:::note[Introduction]
Ce guide détaille les étapes nécessaires pour configurer votre machine macOS en utilisant un script 'setup.sh'. Ce script est conçu pour automatiser certaines tâches de configuration afin de faciliter le processus d'installation.
:::

## Rendre le script exécutable

Pour pouvoir exécuter le script, vous devez d'abord rendre le fichier `setup.sh` exécutable. Cela permettra au système d'exploitation de le traiter comme un script exécutable.
Tout d'abord, ouvrir un terminal et utilisez la commande 'chmod' pour définir les permissions d'exécution du script : 

```bash title="Bien spécifier le chemin vers le fichier 'setup.sh'"
chmod +x setup.sh
```

## Exécuter le script

Une fois le script rendu exécutable, vous pouvez lancer le processus de configuration en exécutant le script. Assurez-vous d'être dans le répertoire où se trouve le fichier `setup.sh`.

```bash title="Exécution de 'setup.sh'"
./setup.sh
```

:::caution[Sudo user]
Pour pouvoir exécuter la commande suivante, il faut les droits appropriés.
:::

## Exemple de script `setup.sh`

```sh
// setup.sh

# Installer Xcode
xcode-select --install

# Installer Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Mettre à jour Homebrew
brew update

# Pour le développement :
brew install git
brew install node
brew install php
brew install mysql
brew install webp
brew install composer
brew install --cask github
brew install --cask visual-studio-code
brew install --cask phpstorm
brew install --cask webstorm
brew install --cask iterm2
brew install --cask docker
brew install --cask mamp
brew install --cask insomnia
brew install --cask figma

# Démarre MySQL automatiquement au démarrage
brew services start mysql

# social
brew install --cask discord
brew install --cask whatsapp

# Outils
brew install --cask notion
brew install --cask google-drive
brew install --cask reverso
brew install --cask vlc

# Customisation de l'OS
brew install --cask amethyst

# Sécurité
brew install --cask macs-fan-control
brew install --cask radio-silence
brew install --cask onyx

# Autres
brew install --cask raspberry-pi-imager
```