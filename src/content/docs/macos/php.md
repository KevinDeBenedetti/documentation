---
title: Installer PHP 
description: Installer PHP avec Homebrew sur macOS.
sidebar:
    order: 5
    label: Installer PHP
    badge:
        text: Homebrew
        variant: note
---

Installer PHP avec le gestionnaire de paquet Homebrew.

:::note[Ressources]
📓 [Documentation officielle](https://www.php.net/manual/fr/intro-whatis.php) <br>
📦 [Paquet Homebrew](https://formulae.brew.sh/formula/php#default)
:::

```bash title="Chercher les versions de PHP"
brew search php
```

```bash title="Installer la version choisie (ex: 8.2)"
brew install php@8.2
```

:::tip
```bash title="Pour accéder au répertoire d'installation :"
cd /usr/local/etc
ls /usr/local/etc
```
:::