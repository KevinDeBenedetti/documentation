---
title: MacOS | SSH 
description: Utiliser SSH sur macOS.
sidebar:
    order: 7
    label: SSH
---

## Ajouter une connexion SSH

### Créer la paire de clés

```bash
ssh-keygen -t rsa -f ~/.ssh/<key_name>_rsa -b 4096
```

Générer une nouvelle paire de clés, que l’on stocke dans le dossier .ssh dans le fichier `<key_name>_rsa` avec une sécurité de 4096 bits. Une fois la commande terminée, nous avons 2 clés dans le dossier .ssh, la clé privée et la clé publique.

### Éditer le fichier de configuration

```bash
nano ~/.ssh/config
```

:::tip
```bash title="Éditer le fichier de configuration"
code ~/.ssh/config
```
Utiliser Visual Studio Code pour éditer le fichier de configuration.
:::

```txt
// ./.ssh/config
Host <command_name>
    Hostname <host_name>
    User <username>
    IdentityFile ~/.ssh/<key_name>_rsa
    IdentitiesOnly yes
```

Compléter le fichier de configuration avec les informations nécessaires.

### Copier la clé sur le serveur

```bash
ssh-copy-id -i /Users/<username>/.ssh/<key_name>_rsa.pub <command_name>
```

Copie de la clé ssh sur le serveur par ligne de commande. Demande du mot de passe ssh.

### Utiliser la clé

```bash
ssh <command_name>
```

:::note
Configuration de l’accès à Github avec Private Authentification Token. Pour cloner le repository, l’identifiant est le même et le mot de passe est le token qu’il faut stocker dans un endroit sûr.
:::