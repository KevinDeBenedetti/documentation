---
title: Docker | Démarrer
lastUpdated: 2024-02-25
description: Un guide pour démarrer avec docker.
sidebar:
    order: 0
    label: Démarrer
---

## Commandes de base

### Afficher

```bash title="Afficher tous les conteneurs démarrés"
sudo docker ps
```

```bash title="Afficher tous les conteneurs arrêtés"
sudo docker ps -a
```

```bash title="Afficher toutes les images"
sudo docker images
```

### Monter

```bash title="Monter l'image"
docker build <NOM_IMAGE>
```

```bash title="Monter l'image et le conteneur"
docker-compose up -d
```

:::tip
`-d` pour le monter en arrière plan
:::

### Sauvegarder

```bash title="Créer une sauvegarde locale de son conteneur"
docker save -o <SAUVEGARDE_.tar> <NOM_DU_CONTENEUR>
```

### Supprimer

```bash title="Supprimer tous les conteneurs non démarrés"
sudo docker rm $(sudo docker ps -a -q -f "status=exited")
```

```bash title="Supprimer un coneneur avec son ID"
sudo docker rm CONTAINER_ID
```

```bash title="Supprimer une image avec son ID"
sudo docker rmi IMAGE_ID
```