---
title: Docker | PostgreSQL & pgAdmin
lastUpdated: 2024-05-27
description: Un guide pour utiliser PostgreSQL et pgAdmin avec Docker.
sidebar:
    order: 6
    label: PostgreSQL & pgAdmin
---

## Installer Postgresql seul
:::note[Ressources]
[Tuto](https://blog.capdata.fr/index.php/containeriser-une-base-de-donnees-postgresql-avec-docker/)
:::

```bash
docker pull postgres:latest
```
Nous pouvons créer une base de données postgresql, cette commande récupère la dernière image.

:::tip
```bash
docker pull --platform linux/amd64 postgres
```
:::

```bash
docker run --name postgresql -p 5442:5432 -e POSTGRES_USERNAME=me -e POSTGRES_PASSWORD=post -d postgres 
```
Nous pouvons démarrer l'image `postgres`.

## Installer PostgreSQL et pgAdmin

Dans ce tutoriel, nous allons vous guider à travers le processus d'installation et de configuration de PostgreSQL et pgAdmin en utilisant Docker. Docker facilite la gestion des conteneurs et offre une méthode rapide pour déployer des bases de données et des outils d'administration sans les complexités liées à l'installation traditionnelle. Nous utiliserons Docker Compose pour définir et orchestrer nos services, et Docker Swarm pour gérer les secrets et assurer une sécurité optimale de nos informations sensibles.

PostgreSQL est une base de données relationnelle puissante et open-source, largement utilisée pour ses performances et sa robustesse. pgAdmin est un outil de gestion et d'administration pour PostgreSQL, offrant une interface utilisateur conviviale pour gérer les bases de données, les utilisateurs et les données. Ce tutoriel vous montrera comment configurer ces outils dans un environnement de production sécurisé, en utilisant les secrets Docker pour protéger vos mots de passe et autres informations sensibles.

### Étapes Préliminaires

Avant de commencer, assurez-vous d'avoir Docker et Docker Compose installés sur votre machine. Vous pouvez télécharger et installer Docker depuis le site officiel [Docker](https://www.docker.com/).

### Créer un fichier `docker-compose.yml`

Voici le fichier docker-compose.yml que nous utiliserons pour configurer nos services PostgreSQL et pgAdmin :

```yml
version: '3.8'

services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER_FILE: /run/secrets/postgres_user
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
      POSTGRES_DB_FILE: /run/secrets/postgres_db
    secrets:
      - postgres_user
      - postgres_password
      - postgres_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - postgres_network
    deploy:
      restart_policy:
        condition: any
      resources:
        limits:
          cpus: "0.5"
          memory: "512M"
      labels:
        - "com.exemple.project=postgresql_setup"
        - "com.exemple.service=database"
        - "com.exemple.environment=production"

  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: /run/secrets/pgadmin_email
      PGADMIN_DEFAULT_PASSWORD_FILE: /run/secrets/pgadmin_password
    secrets:
      - pgadmin_email
      - pgadmin_password
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - postgres_network
    deploy:
      restart_policy:
        condition: any
      resources:
        limits:
          cpus: "0.25"
          memory: "256M"
      labels:
        - "com.exemple.project=postgresql_setup"
        - "com.exemple.service=admin_tool"
        - "com.exemple.environment=production"

volumes:
  postgres_data:
  pgadmin_data:

secrets:
  postgres_user:
    external: true
  postgres_password:
    external: true
  postgres_db:
    external: true
  pgadmin_email:
    external: true
  pgadmin_password:
    external: true

networks:
  postgres_network:
```

### Initialiser Swarm

Pour utiliser les secrets Docker, nous devons initialiser Docker Swarm :

```bash
docker swarm init
```

### Création des secrets

Pour sécuriser les informations sensibles comme les mots de passe, nous allons créer des secrets Docker :

```bash title="Secrets pour PostgreSQL"
echo "admin" | docker secret create postgres_user -
echo "admin_password" | docker secret create postgres_password -
echo "mydatabase" | docker secret create postgres_db -
```

```bash title="Secrets pour pgAdmin"
echo "admin@admin.com" | docker secret create pgadmin_email -
echo "pgadmin_password" | docker secret create pgadmin_password -
```

:::tip[Autres commandes pour les secrets]
```bash title="Vérifier l'état du Swarm"
docker node ls
```
```bash title="Montrer les secrets"
docker secret ls
```
:::

### Déploiement de la stack

Pour déployer notre stack, nous utilisons la commande suivante :

```bash
docker stack deploy -c docker-compose.yml db_stack
```

:::tip[Autres commandes pour la stack]
```bash title="Voir les stacks en cours"
docker stack ls
```

```bash title="Lister les services d'une stack"
docker stack services `stack_name`
```

```bash title="Inspecter les tâches d'un service"
docker service ps `service_name`
```

```bash title="Supprimer la stack"
docker stack rm `stack_name`
```
:::

### Accéder à pgAdmin

Après avoir déployé la stack, vous pouvez accéder à pgAdmin via votre navigateur web à l'adresse suivante :

```bash
https://<your_vps_ip>:5050
```

### Se connecter à pgAdmin

Utilisez les informations d'identification suivantes pour vous connecter à pgAdmin :

- Email : `admin@admin.com`
- Password : `pgadmin_password`

### Ajouter une connexion à PostgreSQL

- Cliquez sur le bouton "Ajouter un Nouveau Serveur"
- Dans l'onglet "General", donnez un nom à votre serveur (par exemple, `PostgreSQL`)
- Dans l'onglet "Connexion", remplissez les champs suivants :
    - "Nom d'hôte / Adresse": `postgres` (le nom du service Docker pour PostgreSQL)
    - "Port": `5432` (le port par défaut de PostgreSQL)
    - "Base de données de maintenance" : `postgres` (ou le nom de votre base de données)
    - "Nom utilisateur" : le contenu du secret `postgres_user`
    - "Mot de passe" : le contenu du secret `postgres_password`

### Conclusion

En suivant ce tutoriel, vous avez appris à configurer et déployer PostgreSQL et pgAdmin en utilisant Docker Compose et Docker Swarm. Nous avons utilisé les secrets Docker pour sécuriser les informations sensibles et avons déployé notre stack de manière sécurisée et optimisée. Avec PostgreSQL et pgAdmin correctement configurés, vous êtes maintenant prêt à gérer efficacement vos bases de données dans un environnement de production sécurisé.

N'oubliez pas de vérifier régulièrement les mises à jour pour PostgreSQL, pgAdmin, et Docker afin de maintenir la sécurité et la performance de votre infrastructure.
