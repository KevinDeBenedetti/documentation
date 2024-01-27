---
title: Authentification Json Web Token - Symfony
lastUpdated: 2024-01-27
description: Guide pour utiliser les bases de donneés avec Symfony.
sidebar:
    order: 6
    label: Authentification JWT
    badge:
      text: Nouveau
      variant: success
---

:::note[Documentation]
📓 [API-platform](https://api-platform.com/docs/core/jwt/) <br>
📓 [Symfony](https://symfony.com/doc/current/security.html#json-login) <br>
📦 [Bundle](https://symfony.com/bundles/LexikJWTAuthenticationBundle/current/index.html#prerequisites) <br>
📓 [JSON Web Tokens](https://jwt.io/)
:::

## Installation du bundle
Pour installer le bundle, nous allons utiliser `composer`.
```bash title="Installation avec composer"
composer require lexik/jwt-authentication-bundle
```

## Génération d'une paire de clés
Pour générer une paire de clés, nous utiliserons la commande du bundle. Cette commande crée 2 clés (privée et publique) dans le répertoire `config/jwt/`, `private.pem` et `public.pem`.
```bash title="Générer une paire de clés"
php bin/console lexik:jwt:generate-keypair
```

## Mise à jour du fichier security.yaml
Nous devons modifier le fichier `security.yaml`, nous pourrons l'ajuster en fonction de nos besoins.
```yaml
// config/packages/security.yaml
security:
  # https://symfony.com/doc/current/security.html#c-hashing-passwords
  password_hashers:
    App\Entity\User: 'auto'

  # https://symfony.com/doc/current/security/authenticator_manager.html
  enable_authenticator_manager: true
  # https://symfony.com/doc/current/security.html#where-do-users-come-from-user-providers
  providers:
    # used to reload user from session & other features (e.g. switch_user)
    users:
      entity:
        class: App\Entity\User
        property: email
      # mongodb:
      #    class: App\Document\User
      #    property: email    

  firewalls:
    dev:
      pattern: ^/_(profiler|wdt)
      security: false
    main:
      stateless: true
      provider: users
      json_login:
        check_path: auth # The name in routes.yaml is enough for mapping
        username_path: email
        password_path: password
        success_handler: lexik_jwt_authentication.handler.authentication_success
        failure_handler: lexik_jwt_authentication.handler.authentication_failure
      jwt: ~

  access_control:
    - { path: ^/$, roles: PUBLIC_ACCESS } # Allows accessing the Swagger UI
    - { path: ^/docs, roles: PUBLIC_ACCESS } # Allows accessing the Swagger UI docs
    - { path: ^/auth, roles: PUBLIC_ACCESS }
    - { path: ^/, roles: IS_AUTHENTICATED_FULLY }
```

## Configuration API Platform
Nous allons configurer API Platform grace au fichier `api_platform.yaml`.
```yml
// config/packages/api_platform.yaml
api_platform:
    swagger:
         api_keys:
             JWT:
                name: Authorization
                type: header
```

## Ajout des informations nécessaires pour l'authentification
Nous ajoutons un point de terminaison à SwaggerUI pour récupérer un jeton JWT LexikJWTAuthenticationBundle pour un intégration avec API Platform, cela ajoutera un point terminaison OpenAPI pour récupérer le jeton dans l'interface utilisateur Swagger.
```yml
// config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
    # ...
    api_platform:
        check_path: /auth
        username_path: email
        password_path: password
```

## Modification des routes

```yml
// config/routes.yaml
auth:
  path: /auth
  methods: ['POST']
```

## Tester l'authentification
Saisir `bearer` suivi de la `clé publique`
![Authorize JWT Authentication - API Platform](../../../assets/images/symfony/jwt-authorize.webp)

S'authentifier avec l'identifiant (email) et le mot de passe.
![Authentification API Platform](../../../assets/images/symfony/auth-api_platform.webp)

Token de réponse
![Response Authentification API Platform](../../../assets/images/symfony/auth-api_platform.webp)

Détail des informations dans le token
![Informations jwt.io](../../../assets/images/symfony/detail-token-response.webp)