---
title: Installer Fast API
lastUpdated: 2024-07-19
description: Un guide pour démarrer avec Fast API.
sidebar:
    order: 0
    label: Démarrer avec Fast API
---

:::note[Documentation]
[Fast API](https://fastapi.tiangolo.com/)
:::
## Prérequis

### Installer fastapi sur macOS
```shell frame="none"
brew install fastapi
```

### Créer un environnement de développement
```shell frame="none"
python3 -m venv venv
```

### Vérifier que l'environnement virtuel est correctement activé
```shell frame="none"
source venv/bin/activate
```

:::note
#### Désactiver l'environnement virtuel
```shell frame="none"
desactivate
```
:::

### Installer les dépendances Fast API
```shell frame="none"
pip install fastapi
```

### Créer le fichier `main.py`
```diff lang="python"
// main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

### Démarrer le serveur de développement
```shell title="Avec uvicorn (recommandé)"
uvicorn main:app --reload
```

:::tips
#### Gestion des dépendances

```shell title="Voir les dépendances"
pip freeze
```

```shell title="Générer un fichier pip freeze > requirements.txt"
pip freeze > requirements.txt
```
:::


## Automatiser le démarrage

### Ajouter un script `start.sh`
A la racine du projet.
```diff lang="shell"
// start.sh
#!venv/bin/activate
uvicorn main:app --reload
```

### Lancer le projet
Exécuter le script, avec la commande.
```shell
sh start.sh
```