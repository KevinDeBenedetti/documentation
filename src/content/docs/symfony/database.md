---
title: Bases de données
lastUpdated: 2024-01-21
description: Guide pour utiliser les bases de donneés avec Symfony.
sidebar:
    order: 3
    label: Base de données
---

:::note[Doctrine]
📓 [Documentation](https://symfony.com/doc/current/doctrine.html) <br>
📦 [doctrine-project.org](https://www.doctrine-project.org/)
:::

## Céer une base de données
Après avoir paramétré la base de données, vous pouvez créer la base de données avec la commande suivante.
```bash title="Créer la base de données"
php bin/console doctrine:database:create
```
:::tip
Si vous préférez utiliser Symfony CLI plutôt que le raccourci php bin/console, vous pouvez également exécuter la commande de création de base de données de la manière suivante :
```bash title="Créer la base de données avec Symfony CLI"
symfony console doctrine:database:create
```
:::

## Créer une entité
Après la création de la base de données, vous pouvez procéder à la création d'une entité. Une entité dans Symfony est une classe PHP qui représente une table dans votre base de données. Pour créer une entité, utilisez la commande suivante :
```bash title="Créer une entité"
symfony console make:entity
```
Suivez les instructions interactives pour définir les champs de votre entité. Une fois l'entité créée, vous devrez migrer les changements vers la base de données.

## Migrer les changements
Symfony utilise des migrations pour appliquer les changements de schéma à la base de données. Après avoir créé votre entité, générez une migration avec la commande suivante :
```bash title="Générer une migration"
symfony console make:migration
```
Cela créera un fichier de migration dans le répertoire migrations/. Pour appliquer ces changements à la base de données, exécutez la commande de migration :
```bash title="Exécuter la migration"
symfony console doctrine:migrations:migrate
```
Cela exécutera toutes les migrations en attente et mettra à jour votre base de données selon les spécifications définies dans vos entités.

Avec ces étapes, vous pouvez créer une base de données, définir une entité et migrer les changements vers la base de données à l'aide des commandes Symfony CLI.