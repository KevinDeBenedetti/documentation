---
title: Installer Symfony - skeleton
description: Un guide pour démarrer avec Symfony.
sidebar:
    order: 0
    label: Démarrer avec Symfony
#    badge:
#        text: New
#        variant: success
---

## Les différentes étapes

Pour pouvoir lancer la commande "symfony", il faut que symfony-cli soit installé au préalable.
```shell title="Installation de symfony."
symfony new <project-name>
```

```shell title="Aller à la racine du projet."
cd <project-name>
```

```shell title="Démarrage du serveur de développement."
symfony server:start
```

## Les bundles nécessaires

### Maker
```shell frame="none"
composer require symfony/maker-bundle --dev
```

### Doctrine
```shell frame="none"
composer require orm
```

### Fixtures
```shell frame="none"
composer require orm-fixtures --dev
```

### Security
```shell frame="none"
composer require security
```

### Serializer
```shell frame="none"
composer require symfony/serializer-pack
```
### ParamConverter
```shell frame="none"
composer require sensio/framework-extra-bundle
```