---
title: Ubuntu | SSH
lastUpdated: 2024-02-26
description: Un guide pour configurer SSH de Ubuntu 23.
sidebar:
    order: 2
    label: SSH
    badge:
      text: Nouveau
      variant: success
---

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