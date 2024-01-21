---
title: Initialiser docker
lastUpdated: 2024-01-21
description: Un guide pour démarrer docker avec Symfony.
sidebar:
    order: 1
    label: Docker
    badge:
        text: Nouveau
        variant: success
---

Bienvenue dans la documentation détaillée sur l'initialisation de Docker pour votre projet Symfony en utilisant la puissante configuration fournie par le package Composer Symfony/ORM-Pack. Docker, combiné avec Symfony, offre une solution robuste pour le développement et le déploiement d'applications web modernes. L'utilisation de Symfony/ORM-Pack simplifie considérablement la gestion des dépendances liées à la persistance des données, en intégrant les composants essentiels tels que Doctrine ORM et EasyAdmin Bundle.

## Vérifier les éléments de configuration

```yml
// docker-compose.yml
###> doctrine/doctrine-bundle ###
database:
    image: postgres:${POSTGRES_VERSION:-14}-alpine
    environment:
        POSTGRES_DB: ${POSTGRES_DB:-app}
        # You should definitely change the password in production
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-ChangeMe}
        POSTGRES_USER: ${POSTGRES_USER:-app}
volumes:
    - db-data:/var/lib/postgresql/data:rw
    # You may use a bind-mounted host directory instead, so that it is harder to accidentally remove the volume and lose all your data!
    # - ./docker/db/data:/var/lib/postgresql/data:rw
###< doctrine/doctrine-bundle ###
```

```yml
// docker-compose.override.yml
###> doctrine/doctrine-bundle ###
database:
  ports:
    - "5432"
###< doctrine/doctrine-bundle ###
```

## Démarrer Docker Compose

```bash title="Créer le conteneur et le démarrer"
docker-compose up -d
```

```bash title="Vérifier que le conteneur est fonctionnel"
docker-compose ps
```

## Base de données locale

### Accéder

```bash ="Accéder à la base de données locale"
symfony run psql
```

:::note
Si le binaire `psql` n'est pas sur la machine locale.
```bash title="Commande avec docker-compose"
docker-compose exec database psql app app
```
:::

### Sauvegarder et restaurer les données à la base

```bash title="Sauvegarder les données de la base"
symfony run pg_dump --data-only > dump.sql
```

```bash title="Restaurer les données"
symfony run psql < dump.sql
```