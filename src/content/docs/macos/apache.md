---
title: Installer Apache 
description: Installer Apache avec Homebrew sur macOS.
sidebar:
    order: 7
    label: Installer Apache
    badge:
        text: Homebrew
        variant: note
---

Installer Apache avec le gestionnaire de paquet Homebrew.

:::note[Ressources]
📓 [Documentation officielle](https://httpd.apache.org/) <br>
📦 [Paquet Homebrew](https://formulae.brew.sh/formula/httpd#default)
:::

```bash title="Installer Apache"
brew install httpd
```

```bash title="Ouvrir Apache au démarrage"
sudo brew services start httpd

# URL = http://localhost:8080
```

```bash title="Configurer httpd"
nano /usr/local/etc/httpd/httpd.conf
```

```bash title="Définir le port httpd.conf"
Listen 8080
// A modifier
Listen 80
```

```bash title="Créer un dossier racine"
mkdir sites
```

```bash title="Modifier le chemin dans httpd.conf"
# Par défaut : /usr/local/var/www
DocumentRoot /Users/<username>/sites
```

## Les commandes de base

```bash title="Lancer Apache sans alias"
sudo /usr/local/opt/apache2/bin/apachectl start
```

```bash title="Lancer Apache"
sudo apachectl start
```

```bash title="Arrêter Apache sans alias"
sudo /usr/local/opt/apache2/bin/apachectl stop
```

```bash title="Arrêter Apache"
sudo apachectl stop
```

```bash title="Redémarrer Apache"
sudo apachectl restart
```