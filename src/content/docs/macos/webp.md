---
title: Convertir des images WebP sur macOS.
description: Utiliser WebP sur macOS.
sidebar:
    order: 7
    label: WebP
---

Dans ce tutoriel, nous allons apprendre à convertir des images en format WebP sur macOS en utilisant Homebrew, Automator et un script shell. Le format WebP est connu pour ses capacités de compression supérieure par rapport aux formats JPEG et PNG, tout en maintenant une haute qualité d'image. Suivez ces étapes pour mettre en place un workflow efficace sur votre Mac.

![WebP](../../../assets/images/macos/webp.webp)

:::note[Prérequis]
1. **Homebrew :** Un gestionnaire de paquets pour macOS qui facilite l'installation de logiciels.
2. **Automator :** Une application intégrée à macOS pour automatiser des tâches.
3. **Terminal :** Pour exécuter des commandes shell.
:::

## Installer WebP
Pour commencer, nous devons installer l'outil WebP en utilisant Homebrew. Ouvrez votre Terminal et exécutez la commande suivante :
```bash
brew install webp
```
## Terminal



## Automator

### Configurer le PATH pour Automator
Nous devons nous assurer qu'Automator puisse accéder à Homebrew et aux outils installés. Pour cela, nous allons modifier le fichier .zshrc.

Ouvrez le fichier `.zshrc` dans votre éditeur de texte préféré :
```bash
nano ~/.zshrc
```

Ajoutez les lignes suivants à la fin du fichier :
```bash
# Automator
PATH=$PATH:"/opt/homebrew/bin"
export PATH
```

Sauvegardez le fichier et rechargez la configuration :
```bash
source ~/.zshrc
```

### Créer un script shell pour la conversion
Ensuite, nous allons créer un script shell qui convertira les images au format WebP. Créez un nouveau fichier nommé `convert_to_webp.sh` et ajoutez-y le contenu suivant :

```shell
source ~/.zshrc

for FILE in "$@"
do
	echo "converting file: $FILE"
	EXT=${FILE##*.}
	cwebp "$FILE" -o "${FILE/%.$EXT/.webp}"
done
```

### Automatiser la conversion avec Automator
1. Ouvrez Automator : Lancez Automator depuis votre dossier Applications.
2. Créer un nouveau document : Choisissez "Action rapide" comme type de document. Et y ajouter les informations suivantes :
    - Le processus reçoit l'élément actuel `fichiers image` dans `Finder`
3. Ajouter une action de script shell : Dans la bibliothèque d'actions, recherchez `Exécuter le script Shell` et faites-la glisser dans le flux de travail. Configuration :
      - Shell `/bin/zsh`
      - Données en entrée : `comme arguments`
4. Configurer le script shell : En ajoutant le code ci-dessus.

### Utiliser votre nouvel outil
Pour convertir une image en WebP, il suffit de faire un clic droit sur l'image, `Actions rapides`, `Convert to WebP`. Le fichier WebP sera généré dans le même répertoire que l'image originale.

