---
title: Ubuntu
lastUpdated: 2024-02-25
description: Un guide pour configurer Ubuntu 23.
sidebar:
    order: 1
    label: Configuration
---

:::note[DOCUMENTATION]
[OVH](https://help.ovhcloud.com/csm/fr-vps-security-tips?id=kb_article_view&sysparm_article=KB0047708)
:::

## Configuration

Changer la disposition du clavier, `dpkg-reconfigure` est déjà installé.
```bash title="Configurer keyboard-configuration s'il est installé"
sudo dpkg-reconfigure keyboard-configuration
```

```bash title="Rédamarrer le service"
sudo service keyboard-setup restart
```

```bash title="Modification de la langue du système"
sudo dpkg-reconfigure locales
```

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

### SSH

Modifier la configuration SSH
```bash
sudo nano /etc/ssh/ssh_config
```

Modifier le port dans le fichier de config avec un numéro entre 49152 et 65535.
```yml
// /etc/ssh/ssh_config
Port SSH_PORT
```

Redémarrer le service.
```bash
sudo service sshd restart
```

Si ce n'est pas suffisant, redémarrer le système.
```bash
sudo reboot
```

Se connecter avec le nouveau port.
```bash
ssh nomdutilisateur@IPv4_de_votre_VPS -p NouveauPort
```

