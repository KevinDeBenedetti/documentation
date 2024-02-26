---
title: Docker
lastUpdated: 2024-02-25
description: Un guide pour utiliser les images dans docker.
sidebar:
    order: 2
    label: Images
    badge:
      text: Nouveau
      variant: success
---

:::note
[Deployer docker node js sur VPS](https://dev.to/arnu515/deploy-your-nodejs-app-to-a-server-with-docker-1hcd)
:::
## Construire une image

```bash title="Construire une image"
docker build -t node .
```
:::tip[Apple Silicon]
Pour que l'image soit compatible avec le vps, il faut la monter sur la plateforme appropriée.
```bash title="Construire une image multiplateformes (apple silicon)"
docker buildx build --platform linux/amd64 -t <image_name> .
```

[Buildx tuto](https://medium.com/@alishgiri/build-compatible-docker-image-from-apple-silicon-m-series-chip-873fe538d671)

Réglages dans docker desktop macOS, [ressources](https://dev.to/docker/run-x86-containers-on-apple-mac-m1-with-rosetta-2-417a), voir également [docker officiel](https://docs.docker.com/build/building/multi-platform/) et [docker article](https://www.docker.com/blog/multi-arch-images/)
:::

```bash title="Construire une image multiplateformes (apple silicon)"
    docker save -o <file_name>.tar <image_name>
```
Sauvegarder une copie de l'image, à partir du container.

## Charger une image

```bash
sudo docker load --input test.tar
```
Charger une image à partir d'une sauvegarde.

## Monter l'image
```bash
sudo docker build -t node .
```

## Démarrer une image

```bash title="Démarrer l'image"
docker run --name <container_name> <image_name>
```

```bash title="Démarrer l'image dans un VPS"
sudo docker run --name <container_name> -p 3000:3000 <image_name>
```
[Ressources](https://medium.com/@wimadev.de/deploy-a-node-js-app-with-docker-on-a-vps-minimal-setup-c28208fc231a), il faut lier le port 3000 du conteneur et le port 3000 du VPS.