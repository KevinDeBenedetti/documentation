---
title: Docker | Déploiement VPS
lastUpdated: 2024-02-25
description: Un guide pour des déploiements automatiser avec Docker.
sidebar:
    order: 3
    label: Déploiement VPS
---

:::note[Documenation]
🔖 [Tuto](https://medium.com/@odenigbo67/docker-ci-cd-in-vpc-vps-environments-automating-deployment-with-github-actions-via-ssh-or-web-e2192bb75a69)
🔖 [Tuto Ruby](https://dev.to/2nit/rails-cd-with-docker-github-actions-and-vps-4hi4)
🔖 [Container Registry Github](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
:::

## Déployer un container

### A partir d'une image `.tar`

A partir d'une copie d'image au format `.tar` dans le VPS.

```bash title="Charger l'image dans son VPS"
sudo docker load --input <file_name>.tar 
```

```bash title="Démarrer l'image"
sudo docker run -d --name <container_name> -p 3001:3001 <image_name>
```
Démarrage d'une image sur le port 3001 du VPS.

```bash title="Mettre à jour Caddyfile"
sudo editor /etc/caddy/Caddyfile
```

```bash title="Redémarrer Caddyfile"
sudo systemctl reload caddy
```