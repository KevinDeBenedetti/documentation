---
title: Docker | Base de données
lastUpdated: 2024-03-02
description: Un guide pour utiliser les bases de données dans Docker.
sidebar:
    order: 6
    label: Base de données
---

## Postgresql
:::note[Ressources]
[Tuto](https://blog.capdata.fr/index.php/containeriser-une-base-de-donnees-postgresql-avec-docker/)
:::

```bash
docker pull postgres
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