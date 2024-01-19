---
title: Installer MySQL 
description: Installer MySQL avec Homebrew sur macOS.
sidebar:
    order: 6
    label: Installer MySQL
    badge:
        text: Homebrew
        variant: note
---

:::note[Introduction]
Installer MySQL avec le gestionnaire de paquet Homebrew.

- Ressources :
    - [Paquet Homebrew](https://formulae.brew.sh/formula/mysql#default)
    - [Documentation officielle](https://www.mysql.com/fr/)
:::

```bash title="Installer MySQL"
brew install mysql
```

## Les commandes de base

```bash title="Se connecter avec l'utilisateur root"
mysql -u root -p
```

```bash title="Charger une base de données à partir d'un fichier"
mysql -u root -p nom_de_la_base_de_donnees < nom_du_fichier.sql
```

```bash title="Démarrer MySQL"
brew services start mysql
```

```bash title="Arrêter MySQL"
brew services stop mysql
```