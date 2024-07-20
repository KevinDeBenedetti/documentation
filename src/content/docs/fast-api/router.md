---
title: Routeur Fast API
lastUpdated: 2024-07-20
description: Un guide pour démarrer le routeur de Fast API.
sidebar:
    order: 1
    label: Routeur
---

:::note[Documentation]
[Fast API](https://fastapi.tiangolo.com/fr/reference/apirouter/?h=apirouter)
:::

## Configurer un routeur

### Modifier le fichier `main.py`
```diff lang="python"
// main.py
from fastapi import FastAPI
from backend.router import router

app = FastAPI()

app.include_router(router)
```


### Créer le fichier `router.py`
```diff lang="python"
// router.py
from fastapi import APIRouter
router = APIRouter()

@router.get('/')
def hello():
    """Hello world route to make sure the app is working correctly"""
    return {"msg": "Hello World!"}
```