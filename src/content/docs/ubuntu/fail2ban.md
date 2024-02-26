---
title: Debian | Fail2ban
lastUpdated: 2024-02-25
description: Un guide pour configurer fail2ban debian 12.
sidebar:
    order: 3
    label: Fail2ban
    badge:
      text: Nouveau
      variant: success
---

:::note[Documenation]
[Github](https://github.com/fail2ban/fail2ban) <br>
[OVH](https://help.ovhcloud.com/csm/fr-vps-security-tips?id=kb_article_view&sysparm_article=KB0047708) <br>
[Wiki Ubuntu](https://doc.ubuntu-fr.org/fail2ban)
:::

## Fail2ban

Fail2ban est un outil de prévention des intrusions conçu pour bloquer les adresses IP utilisées par des bots ou des attaquants qui cherchent à infiltrer votre système. Son objectif principal est d'identifier et de neutraliser les tentatives d'accès non autorisées. Ce package est fortement recommandé, voire essentiel dans certaines circonstances, afin de renforcer la sécurité de votre serveur contre des attaques telles que les tentatives d'accès par force brute ou les attaques de type Déni de Service (DoS).

```bash title="Installer le package logiciel"
sudo apt install fail2ban
```

```bash title="Créer un fichier de configuration locale"
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

```bash title="Ouvrir le fichier dans un éditeur de texte"
sudo nano /etc/fail2ban/jail.local
```

```txt title="Modifier les lignes"
[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
findtime = 5m
bantime = 30m
# Modifier / Correctif
backend = stystemd
```

```bash title="Redémarrer le service"
sudo service fail2ban restart
```