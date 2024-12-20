---
title: Ubuntu | UFW
lastUpdated: 2024-02-25
description: Un guide pour utiliser ufw avec ubuntu 23.10.
sidebar:
    order: 3
    label: UFW
---

:::note
[Hostinger tutoriel](https://www.hostinger.fr/tutoriels/comment-configurer-un-pare-feu-sur-ubuntu-avec-ufw) <br>
[Gandi_doc](https://news.gandi.net/en/2022/10/how-to-configure-a-firewall-with-ufw-on-a-gandicloud-vps-with-ubuntu-or-debian/)
:::

## Activer & installer

```bash
sudo systemctl start fail2ban
```
Activer le service UFW.

```bash
sudo ufw enable
```
Activer le démarrage automatique.

```bash
sudo apt install ufw
```
Installer UFW.

```bash
sudo ufw status
```
Vérifier le status UFW.

## Commandes de base

```bash title="Vérifier le statut"
sudo systemctl status fail2ban
```

```bash title="Relancer la configuratio"
sudo systemctl restart fail2ban
```

## Configurer le pare-feu

```bash
sudo ufw default deny incoming
```
Configuration par défaut, refuser les connexions entrantes.

```bash
sudo ufw default allow outgoing
```
Configuration par défaut, authorizer les connexions sortantes.

```bash
sudo ufw allow ssh
```
Authorizer les connexions ssh (port 22 par défaut).

```bash
sudo ufw allow htttp
```
Authorizer les connexions http (port 80).

```bash
sudo ufw allow htttps
```
Authorizer les connexions https (port 443).