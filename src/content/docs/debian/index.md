---
title: Debian
lastUpdated: 2024-02-25
description: Un guide pour démarrer avec debian 12.
sidebar:
    order: 0
    label: Démarrer
---

## Commandes de base

```bash title="Se connecter en ssh"
ssh username@adresse_ip -p <PORT>
```

```bash title="Copier un fichier en ssh"
scp -r -P <PORT> <NOM_DU_FICHIER> username@adresse_ip4:~/ 
```