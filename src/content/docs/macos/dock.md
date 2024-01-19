---
title: Personnaliser le Dock
description: Personnaliser le Dock pour macOS.
sidebar:
    order: 2
    label: Personnaliser le Dock
---

:::note[Introduction]
Le Dock de macOS est un élément essentiel de l'interface utilisateur qui offre un accès rapide à vos applications préférées et aux fonctionnalités du système. Vous pouvez personnaliser le comportement du Dock en utilisant des commandes de terminal.
:::

## Faire apparaître le Dock sans délai

Par défaut, le Dock peut avoir un léger délai avant de s'afficher lorsque vous approchez le curseur. Pour éliminer ce délai, vous pouvez utiliser les commandes suivantes :

```bash title="Modifier le délai."
defaults write com.apple.dock autohide-time-modifier -int 0
```

```bash title="Relancer le Dock pour appliquer les changements."
killall Dock
```

:::caution[Information]
Cette commande ajuste le temps de disparition automatique du Dock à zéro, ce qui signifie qu'il apparaîtra instantanément lorsque vous le faites glisser vers le bas de l'écran.
:::

## Retour au délai par défaut

Ces commandes suppriment le paramètre que nous avons précédemment ajouté, rétablissant ainsi le délai d'apparition du Dock selon la configuration d'origine.

```bash title="Délai usine."
defaults delete com.apple.dock autohide-time-modifier
```

```bash title="Relancer le Dock pour appliquer les changements."
killall Dock
```

## Position du Dock

Vous pouvez ajuster la position du Dock en utilisant les paramètres `left`, `bottom`, `right` ou `top`.

```bash title="Modifier [position] pour la commande"
defaults write com.apple.dock orientation -string [position]
```

## Taille des icônes

Vous pouvez ajuster la taille des icônes dans le Dock, les tailles sont en pixels.

```bash title="Modifier [taille] pour la commande"
defaults write com.apple.dock tilesize -int [taille]
```

```bash title="Exemple : pour des icônes de 48 pixels"
defaults write com.apple.dock tilesize -int 48
```

## Réinitilisation complète du Dock

```bash title="Réinitialiser les paramètres du Dock."
defaults delete com.apple.dock
```

```bash title="Relancer le Dock pour appliquer les changements."
killall Dock
```