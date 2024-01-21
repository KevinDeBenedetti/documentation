---
title: Homebrew 
description: Utiliser Homebrew avec macOS.
sidebar:
    order: 4
    label: Homebrew
---


Homebrew est un gestionnaire de paquets pour macOS, vous permettant d'installer, mettre à jour et gérer des logiciels tiers sur votre système. Cette page vous guide à travers l'installation et l'utilisation de Homebrew. [Site officiel](https://brew.sh/fr/)

## Installation

Pour installer Homebrew, exécutez la commande suivante dans votre terminal :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Commandes de base

```bash title="Mettre à jour Homebrew"
brew update
```

```bash title="Mettre à jour les packages installés"
brew upgrade
```

```bash title="Installer un paquet"
brew install <package>
```


```bash title="Désinstaller un paquet"
brew uninstall <package>
```

```bash title="Obtenir des informations sur paquet"
brew info <package>
```

```bash title="Rechercher un paquet"
brew search <package>
```

```bash title="La liste des paquets installés"
brew list
```