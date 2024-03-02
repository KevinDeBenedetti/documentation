---
title: Docker | Network
lastUpdated: 2024-03-02
description: Un guide pour utiliser network dans Docker.
sidebar:
    order: 4
    label: Network
---

:::note[Documenation]
🔖 [Tuto](https://dev.to/rizkyrajitha/connect-api-and-a-database-with-docker-network-299g)
🔖 [Doc](https://spacelift.io/blog/docker-networking)
:::

```bash title="Créer une docker network"
docker network create --subnet 172.20.0.0/16 <network_name>
```
Tout d'abord, nous devons créer un network dans docker avec la spécification d'un sous réseau.

```bash title="Visualiser les docker networks"
docker network ls
```
Nous pouvons maintenant vérifier que le docker network fonctionne.

```bash title="Voir le détail d'un docker network"
docker network inspect <docker_network_name>
```
Nous pouvons également visualiser le contenu d'un docker network.

```bash title="Lier un docker container"
docker network connect --ip 172.20.0.5 <network_name> <container_name>
```
Avec cette commande, nous lierons un docker network à un conteneur.