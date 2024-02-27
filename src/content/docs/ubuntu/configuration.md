---
title: Ubuntu | Configuration
lastUpdated: 2024-02-26
description: Un guide pour configurer Ubuntu 23.
sidebar:
    order: 1
    label: Configuration
---

:::note[DOCUMENTATION]
[OVH](https://help.ovhcloud.com/csm/fr-vps-security-tips?id=kb_article_view&sysparm_article=KB0047708)
:::

## Configurer son système

### Le clavier

Changer la disposition du clavier, `dpkg-reconfigure` est déjà installé.
```bash title="Configurer keyboard-configuration s'il est installé"
sudo dpkg-reconfigure keyboard-configuration
```

```bash title="Rédamarrer le service"
sudo service keyboard-setup restart
```

### La langue

```bash title="Modification de la langue du système"
sudo dpkg-reconfigure locales
```

## Sécuriser son VPS

### Modifier le mot de passe

Modifier le mot de passe du compte.
```bash
passwd
```

Mettre à jour le système.
```bash
sudo apt update
sudo apt upgrade
sudo reboot
```

### Modifier le port SSH

Le port SSH est 22 par défaut, nous allons le [modifier](/documentation/ubuntu/ssh/).

### Configurer fail2ban

Nous allons configurer fail2ban pour renforcer la sécurité de notre VPS.
[fail2ban](/documentation/ubuntu/fail2ban/)

## Configurer le serveur Web

### Caddy

[Caddy](/documentation/ubuntu/caddy/)

## Pare-feu
### UFW

Nous allons utiliser UFW pour configurer le pare-feu de notre VPS, il est utilisé avec iptables.
[UFW](/documentation/ubuntu/ufw/)
