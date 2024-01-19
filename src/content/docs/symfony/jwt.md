---
title: Authentification Json Web Token - Symfony
description: Guide pour utiliser les bases de donneés avec Symfony.
sidebar:
    order: 2
    label: Authentification JWT
---

## Au préalable

### Créer une entité User
```shell frame="none"
php bin/console make:user
```

### Ajout de la méthode getUsername
```php
// src\Entity\User.php
// ...
    /**
     * Retourne le champ utilisé pour l'authentification.
     * @return string
     */
    public function getUsername(): string {
        return $this->getUserIdentifier();
    }
```

### Générer un mot de passe hashé
```shell frame="none"
php bin/console security:hash-password
```

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
