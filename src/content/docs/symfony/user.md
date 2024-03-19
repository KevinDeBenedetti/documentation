---
title: User - Symfony
lastUpdated: 2024-03-19
description: Guide pour utiliser API Platform avec Symfony.
sidebar:
    order: 5
    label: User - API
    badge:
      text: Nouveau
      variant: success
---

:::note[Documentation]
📓 [API-platform](https://github.com/KevinDeBenedetti/fsp_backend_gestion/blob/main/config/packages/security.yaml) <br>
📓 [Symfony](https://symfony.com/doc/current/security.html#the-user)
:::

## Création d'une entité User
Nous allons créer notre entité User, nous pouvons y définir un email, mot de passe, des rôles etc.
```shell title="Symfony CLI"
symfony console make:user
```

```shell title="Commande "classique""
php bin/console make:user
```

## Ajout de la méthode getUsername
Nous devons ajouter cette méthode dans notre entité pour définir `getUsername()` avec le champ utilisé pour l'authentification. Dans notre cas `email`.
```diff lang="php"
// src\Entity\User.php
...

+    /**
+     * Retourne le champ utilisé pour l'authentification.
+     * @return string
+     */
+    public function getUsername(): string {
+        return $this->getUserIdentifier();
+    }

...
```

## Générer un mot de passe hashé
Nous pouvons générer un mot de passe hashé grâce à la commande suivante.
```shell title="Commande "classique""
symfony console security:hash-password
```

```shell title="Commande "classique""
php bin/console security:hash-password
```

## Modifier l'entité User pour API Platform
Pour pouvoir utiliser pleinement notre entité avec API Platform, il faut procéder à quelques modifications dans notre code.
```diff lang="php"
// src/Entity/User.php

...

+ // Importer la classe ApiResource
+ use ApiPlatform\Metadata\ApiResource;

...

+ // Ajouter l'attribut ci dessous
+ #[ApiResource]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{

...
```

## Créer un utilisateur de test

Nous souhaitons tester notre API avec un utilisateur de test, pour ce faire il existe plusieurs méthodes. Nous allons créer un contrôleur que nous pourrons réutiliser plus tard.

```php
// src/Controller/UserController.php

<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/user/create', name: 'app_user_create')]
    public function createUser(ManagerRegistry $doctrine) {
        $entityManager = $doctrine->getManager();

        // Création d'un nouvel utilisateur
        $newUser = new User();
        $newUser->setEmail('test@test.fr');
        $newUser->setPassword('$2y$13$7vwmMNiDGI2JSwAmXd7hZO7wwXJdb14gRaLh5aiPii9otp5lEjb1u');

        // Enregistrement de l'entité dans Doctrine
        $entityManager->persist($newUser);
        // Exécution des requêtes SQL pour mettre à jour la base de données
        $entityManager->flush();

        return $this->json([
            'message' => sprintf('Utilisateur créé', $newUser->getEmail())
        ]);
    }
}

```

## Modifier la route pour la connexion
Pour pouvoir se connecter en utilisant les routes de notre api, nous devons modifier notre fichier `config/routes.yaml`.
```diff lang="yml"
// config/routes.yaml

controllers:
    resource:
        path: ../src/Controller/
        namespace: App\Controller
    type: attribute

+ api_login_check:
+     path: /api/login_check
```