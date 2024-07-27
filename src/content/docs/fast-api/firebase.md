---
title: Firebase avec Fast API
lastUpdated: 2024-07-20
description: Un guide pour démarrer avec Firebase dans Fast API.
sidebar:
    order: 3
    label: Firebase
---

:::note[Documentation]
[Firebase](https://firebase.google.com/docs/build?hl=fr) <br>
[Ajouter le SDK](https://firebase.google.com/docs/admin/setup?hl=fr#python)
:::

## Installer le SDK Firebase
```shell
pip install firebase-admin
```

## Créer .env
```diff lang="env"
// .env
ENV=dev
+GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
FRONTEND_URL="http://localhost:3000"
```

## Ajouter serivce-account.json

Télécharger, renommer et copier le fichier `service-account.json`.

Paramètres du projet => Compte de services => SDK Admin Firebase => `Générer une nouvelle clé privée`

### Configurer le SDK Admin Firebase

#### Ajouter la configuration dans `main.py`
```diff lang="python"
// main.py
from fastapi import FastAPI
from backend.router import router
+import firebase_admin
+from firebase_admin import credentials

+cred = credentials.Certificate("service-account.json")
+firebase_admin.initialize_app(cred)

app = FastAPI()

app.include_router(router)
```