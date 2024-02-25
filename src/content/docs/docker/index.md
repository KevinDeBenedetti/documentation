---
title: Docker
lastUpdated: 2024-02-25
description: Un guide pour démarrer avec docker.
sidebar:
    order: 0
    label: Démarrer avec Docker
---

## Commandes de base

### CREATE

### READ

```bash title="Afficher tous les conteneurs démarrés"
sudo docker ps
```

```bash title="Afficher tous les conteneurs arrêtés"
sudo docker ps -a
```

```bash title="Afficher toutes les images"
sudo docker images
```

### UPDATE

### DELETE

```bash title="Supprimer tous les conteneurs non démarrés"
sudo docker rm $(sudo docker ps -a -q -f "status=exited")
```

```bash title="Supprimer un coneneur avec son ID"
sudo docker rm CONTAINER_ID
```

```bash title="Supprimer une image avec son ID"
sudo docker rmi IMAGE_ID
```