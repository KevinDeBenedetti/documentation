---
title: Ubuntu
lastUpdated: 2024-02-25
description: Un guide pour démarrer avec debian 23.
sidebar:
    order: 0
    label: Démarrer
---

:::tip
[Doc Hostinger / Sécuriser VPS](https://www.hostinger.fr/tutoriels/securite-vps#1_Recherchez_la_securisation_de_votre_hebergement_Web)
:::

## Commandes de base

Les commandes Linux de base selon [Hostinger](https://www.hostinger.fr/tutoriels/commandes-linux).

```bash title="Se connecter en ssh"
ssh username@adresse_ip -p <PORT>
```

```bash title="Copier un fichier en ssh."
scp -r <NOM_DU_FICHIER> username@adresse_ip:~/ 
```

```bash title="Copier un fichier en ssh, sur un port personnalisé"
scp -r -P <PORT> <NOM_DU_FICHIER> username@adresse_ip:~/ 
```