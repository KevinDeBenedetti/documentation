---
title: API Platform - Symfony
description: Guide pour utiliser API Platform avec Symfony.
sidebar:
    order: 4
    label: API Platform
---

## Installer API Platform

```sh frame="none"
symfony composer require api
```

### Modification des routes
```yml
// config\routes\api_platform.yaml
api_platform:
    resource: .
    type: api_platform
    prefix: /apip
```

### Modification des authorisations d'accès
```yml
// config\packages\security.yaml
access_control:
    - { path: ^/api/login, roles: PUBLIC_ACCESS }
    - { path: ^/api/doc, roles: PUBLIC_ACCESS }
    - { path: ^/apip, roles: PUBLIC_ACCESS }
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

### Créer une entité
```bash
php bin/console make:entity --api-resource
```