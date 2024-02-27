---
title: Ubuntu | Docker
lastUpdated: 2024-02-27
description: Un guide pour utiliser docker avec ubuntu 23.10.
sidebar:
    order: 5
    label: Docker
---

## Installer docker

## Sans privilèges root

Pour pouvoir utiliser Docker sans privilèges root, nous devons utiliser cette commande et redémarrer le système. Voir la documentation [Hostinger](https://www.hostinger.fr/tutoriels/installer-docker-sur-ubuntu#Comment_utiliser_Docker_sur_Ubuntu_1804)

```bash
sudo usermod -aG docker $(whoami)
```

```bash
sudo reboot
```