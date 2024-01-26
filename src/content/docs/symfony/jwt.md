---
title: Authentification Json Web Token - Symfony
lastUpdated: 2024-01-26
description: Guide pour utiliser les bases de donneés avec Symfony.
sidebar:
    order: 6
    label: Authentification JWT
    badge:
      text: Nouveau
      variant: success
---


## JWT Authentication

### Installation du bundle
```shell frame="none"
composer require lexik/jwt-authentication-bundle
```

### Génération d'une paire de clés
```shell frame="none"
php bin/console lexik:jwt:generate-keypair
```

### Mise à jour du fichier security.yaml
```yaml
// config/packages/security.yaml

...

// Voir la documentation officielle
```

### Ajout de la clé d'api
```yml
// config\packages\api_platform.yaml
api_platform:
    swagger:
         api_keys:
             JWT:
                name: Authorization
                type: header
```

### Ajout des informations nécessaires pour l'authentification
```yml
// config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
    # ...
    api_platform:
        check_path: /auth
        username_path: email
        password_path: password
```
