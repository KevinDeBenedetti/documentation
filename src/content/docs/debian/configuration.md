---
title: Debian
lastUpdated: 2024-02-25
description: Un guide pour configurer debian 12.
sidebar:
    order: 1
    label: Configuration
---

:::note[DOCUMENTATION]
[OVH](https://help.ovhcloud.com/csm/fr-vps-security-tips?id=kb_article_view&sysparm_article=KB0047708)
:::

## Configuration

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

### Disposition du clavier

Modification de la disposition du clavier avec KVM.

```bash
sudo dpkg-reconfigure locales
```

Désélectionner `en_US.UTF-8 UTF-8` et sélectionner `fr_FR.UTF-8 UTF-8`.

```bash title="Installer le paquet keyboard-configuration"
sudo apt install keyboard-configuration
```

```bash title="Configurer keyboard-configuration s'il est installé"
sudo dpkg-configure keyboard-configuration
```

#### Console
:::note[Ressources]
[Tuto](https://libremaster.com/comment-utiliser-le-kvm-dun-vps-ovh-et-configurer-le-clavier-en-francais-sur-debian/)
:::
```bash title="Installer le paquet console-setup"
sudo apt install console-setup
```

```bash title="Rédamarrer le service"
sudo service keyboard-setup restart
```