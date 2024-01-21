---
title: Installer Symfony - skeleton
lastUpdated: 2024-01-21
description: Un guide pour démarrer avec Symfony.
sidebar:
    order: 0
    label: Démarrer avec Symfony
---
Symfony est un framework PHP moderne et robuste conçu pour simplifier le processus de développement web. Il offre une architecture flexible et extensible qui favorise la création d'applications web performantes et évolutives. En tant que développeur, vous serez en mesure de gagner du temps et d'optimiser votre workflow grâce à de nombreuses fonctionnalités intégrées, telles que la gestion des routes, la manipulation de la base de données, la sécurité, et bien plus encore.

## Les différentes étapes

### Installation
Pour pouvoir lancer la commande "symfony", il faut que symfony-cli soit installé au préalable.
```shell title="Installation de symfony."
symfony new <project-name>
```
:::tip[Options]
```shell title="Installation de symfony."
# --version="7.0.*" pour installer une version spécifique
# --webapp pour installer tous les paquets nécessaires à une application
symfony new <project-name>
```
:::

```shell title="Aller à la racine du projet."
cd <project-name>
```

```shell title="Démarrer le serveur de développement."
symfony serve
```
:::tip[Options]
```bash title="Démarrer le serveur de développement."
# --port (pour spécifier le port)
# --docroot (pour spécifier le document root)
symfony server:start
```
:::

## Les bundles nécessaires

### Maker
Symfony Maker vous aide à créer des commandes vides, des contrôleurs, des classes de formulaire, des tests et plus encore afin que vous puissiez oublier l’écriture de code standard.
```bash
composer require symfony/maker-bundle --dev
```
:::note[symfony/maker-bundle]
📓 [Documentation](https://symfony.com/bundles/SymfonyMakerBundle/current/index.html) <br>
📦 [Packagist](https://packagist.org/packages/symfony/maker-bundle)
:::

### Doctrine
Pour manipuler la base de données facilement et initialiser docker. <br>
```bash
composer require symfony/orm-pack
```
:::note[symfony/orm-pack]
📓 [Documentation](https://symfony.com/doc/current/doctrine.html) <br>
📦 [Component](https://symfony.com/components/ORM%20Pack)
:::

### Fixtures
Les fixtures dans Symfony sont des données fictives utilisées pour alimenter la base de données pendant le développement, les tests ou d'autres environnements non productifs. Elles permettent de peupler la base de données avec des données préconfigurées, facilitant ainsi le processus de développement et de test.
```bash
composer require orm-fixtures --dev
```
:::note[orm-fixtures]
📓 [Documentation](https://symfony.com/bundles/DoctrineFixturesBundle/current/index.html)
:::

### Security
Outils de sécurité liés à HTTP, comme les cookies de session sécurisés et la protection CSRF sont fournis par défaut. Les fonctionnalités d’authentification et d’autorisation nécessaires pour sécuriser votre application.
```bash
composer require symfony/security-bundle
```
:::note[symfony/security-bundle]
📓 [Documentation](https://symfony.com/doc/current/security.html) <br>
📦 [Component](https://symfony.com/components/Security%20Bundle)
:::

### Serializer
Pour sérialiser / désérialiser vers et depuis des objets et différents formats (par ex. JSON ou XML).
```shell
composer require symfony/serializer-pack
```
:::note[symfony/serializer-pack]
📓 [Documentation](https://symfony.com/doc/current/serializer.html) <br>
📦 [Component](https://symfony.com/components/Serializer%20Pack)
:::