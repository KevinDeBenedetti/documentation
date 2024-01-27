---
title: API Platform - Symfony
lastUpdated: 2024-01-26
description: Guide pour utiliser API Platform avec Symfony.
sidebar:
    order: 4
    label: API Platform
    badge:
      text: Nouveau
      variant: success
---

:::note[Documentation]
📓 [API-platform](https://api-platform.com/docs/distribution/) <br>
📓 [Symfony](https://symfony.com/doc/current/the-fast-track/en/26-api.html#installing-api-platform)
:::

## Installer API Platform

Installer le composant d'API Platform dans notre projet Symfony skeleton.

```sh title="Commande pour installer le composant"
php bin/console composer require api
```

```sh title="Symfony CLI"
symfony composer require api
```

:::tip[Création de la base de données et de son schéma :]
```bash title="Créer la base de données"
php bin/console doctrine:database:create
```

```bash title="Créer le schéma"
php bin/console doctrine:schema:create
```
:::

```sh title="Lancer l'environnement de développement"
symfony serve
```

## Modification des routes
Maintenant, il faut s'assurer que nos routes soient bien configurées pour API Platform, ou les modifier si besoin. Nous pouvons modifier le fichier `api_platform.yaml`.
```yml
// config\routes\api_platform.yaml
api_platform:
    resource: .
    type: api_platform
    prefix: /api
```

## Modification des authorisations d'accès
Pour modifier les authorisations à notre api, nous devons modifier le fichier `security.yaml`.
```yml
// config\packages\security.yaml
...
firewalls:
  api:
    pattern: ^/api
    stateless: true
    
# Configuration du login en json
  main:
    json_login:
      check_path: api_login
      username_path: email
      password_path: password
      
# Modification des authorisations
access_control:
    - { path: ^/api/login, roles: PUBLIC_ACCESS }
    - { path: ^/api/doc, roles: PUBLIC_ACCESS }
    - { path: ^/apip, roles: PUBLIC_ACCESS }
```

## Créer une entité ApiResource
```bash
php bin/console make:entity --api-resource
```