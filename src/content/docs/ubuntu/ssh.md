---
title: Ubuntu | SSH
lastUpdated: 2024-02-27
description: Un guide pour configurer SSH de Ubuntu 23.
sidebar:
    order: 2
    label: SSH
---

:::note
Pour Ubuntu 23.04 et versions ultérieures
[OVH](https://help.ovhcloud.com/csm/fr-vps-security-tips?id=kb_article_view&sysparm_article=KB0047708)
:::

## Modifier le port SSH

Le port par défaut pour se connecter en SSH est 22, nous allons le modifier.

Modifier la configuration SSH, modifier le fichier `ssh.socket` dans le répertoire `/lib/systemd/system`.
```bash
sudo nano /lib/systemd/system/ssh.socket
```

Modifier le port dans le fichier de config avec un numéro entre 49152 et 65535.
```yml
// /lib/systemd/system/ssh.socket
[Socket]
ListenStream=49152
Accept=no
```

Enregistrer les modifications.
```bash
sudo systemctl daemon-reload
sudo systemctl restart ssh.service
```

Si ce n'est pas suffisant, redémarrer le système.
```bash
sudo reboot
```

Se connecter avec le nouveau port.
```bash
ssh <username>@<IPv4_VPS> -p <ssh_port>
```

## Copier un fichier


```bash title="Copier un fichier en ssh."
scp -r <NOM_DU_FICHIER> username@adresse_ip:~/ 
```

```bash title="Copier un fichier en ssh, sur un port personnalisé"
scp -r -P <PORT> <NOM_DU_FICHIER> username@adresse_ip:~/ 
```