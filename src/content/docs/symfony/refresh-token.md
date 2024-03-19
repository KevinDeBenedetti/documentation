---
title: Refresh Token - Symfony
lastUpdated: 2024-03-19
description: Guide implémenter refresh token JWT Symfony.
sidebar:
    order: 7
    label: Refresh Token
    badge:
      text: Nouveau
      variant: success
---

:::note[Documentation]
📦 [Github](https://github.com/markitosgv/JWTRefreshTokenBundle) <br>
📓 [JSON Web Tokens](https://jwt.io/)
:::

## Installation du bundle
Pour installer le bundle, nous allons utiliser `composer`. Les autres bundles dans la documentation ont déjà été installé avec le component API Platform.
```bash title="Installation avec composer"
composer require gesdinet/jwt-refresh-token-bundle
```

## Configuration du Bundle
Le fichier `config/packages/gesdinet_jwt_refresh_token.yaml` a du être créé, dans le cas contraire vous devez le créer.
```yml
// config/packages/gesdinet_jwt_refresh_token.yaml
gesdinet_jwt_refresh_token:
    refresh_token_class: App\Entity\RefreshToken
```

## Définition de la route refresh token
Ajout de la route refresh token dans `routes.yaml`.
```diff lang="yml"
// config/routes.yaml
controllers:
  resource:
    path: ../src/Controller/
    namespace: App\Controller
  type: attribute

api_login_check:
  path: /api/login

+ api_refresh_token:
+   path: /api/token/refresh

```

Configuratin du firewall dans `config/packages/security.yaml`.
```diff lang="yml"
// config/packages/security.yaml
...

providers:
    # used to reload user from session & other features (e.g. switch_user)
    app_user_provider:  
        entity:
            class: App\Entity\User
            property: email

...

firewalls:
    dev:
        pattern: ^/(_(profiler|wdt)|css|images|js)/
        security: false
        
    login:
          pattern: ^/api/login$
          stateless: true
          json_login:
            check_path: /api/login
            username_path: email
            success_handler: lexik_jwt_authentication.handler.authentication_success
            failure_handler: lexik_jwt_authentication.handler.authentication_failure

    api:
        pattern: ^/api
        stateless: true
        entry_point: jwt
        jwt: ~  
        refresh_jwt:
+            check_path: /api/token/refresh

...

    access_control:
        - { path: ^/$, roles: PUBLIC_ACCESS } # Allows accessing the Swagger UI
        - { path: ^/docs, roles: PUBLIC_ACCESS } # Allows accessing the Swagger UI docs
+        - { path: ^/api/(login|token/refresh), roles: PUBLIC_ACCESS }
-        - { path: ^/api/login$, roles: PUBLIC_ACCESS }
        - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }

...
```

### Dépréciation des annotations
Sans la modification des annotations en attributs, vous obtiendrez un message d'erreur.

```diff lang="php"
// src/Entity/RefreshToken.php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken as BaseRefreshToken;

- /**
-  * @ORM\Entity
-  * @ORM\Table("refresh_tokens")
-  */
+ #[ORM\Entity]
+ #[ORM\Table(name: 'refresh_tokens')]
class RefreshToken extends BaseRefreshToken
{
}

```

## Modifier le `username` dans la base de données
Nous devons modifier notre entité `User` dans `src/Entity/User.php`. Pour ce cas, nous souhaitons utiliser l'id au lieu de l'email pour enregistrer nos `refreshToken` dans la base de données, nous avons une entité `src/Entity/RefreshToken.php` qui a été créé grâce à Symfony Flex.

```diff lang="php"
// src/Entity/User.php
// ...

// Supprimer la méthode suivante
-   /**
-    * Retourne le champ utilisé pour l'authentification.
-    * @return string
-    */
-   public function getUsername(): string {
-       return $this->getUserIdentifier();
-   }

// ...

// Ajouter un setter pour l'id
+   public function setId(?int $id): static
+   {
+       $this->id = $id;
+       return $this;
+   }

// Modifier les méthodes suivantes
    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
-       return (string) $this->email;
+       return (string) $this->id;
    }
```
:::tip[Ressources]
[Deprecation : user_identity_field](https://github.com/lexik/LexikJWTAuthenticationBundle/issues/1051)
:::