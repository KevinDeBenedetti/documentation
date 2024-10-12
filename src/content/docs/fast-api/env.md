---
title: Variables d'environnement
lastUpdated: 2024-07-20
description: Un guide pour démarrer avec Firebase dans Fast API.
sidebar:
    order: 2
    label: Variables d'environnement
---

:::note[Documentation]
[Fast API](https://fastapi.tiangolo.com/advanced/settings/#environment-variables)
:::

## Configurer les variables d'environneemnt

### Créer un fichier .env
```diff
// .env
ENV=dev
FRONTEND_URL="http://localhost:3000"
```

### Créer un script config.py
```diff lang="python"
// config.py
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Main settings"""
    app_name: str = "demofirebase"
    env: str
    frontend_url: str
    
    model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_settings() -> Settings:
    """Retrieves the fastapi settings"""
    return Settings()
```

### Accéder aux variables d'environnment
```diff lang="python"
// main.py
from fastapi import FastAPI
from router import router
+from config import get_settings

+settings = get_settings()

+print(settings.frontend_url)

app = FastAPI()

app.include_router(router)
```