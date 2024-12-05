---
title: Alembic & SQLModel
lastUpdated: 2024-12-05
description: Utiliser Alembic & SQLModel dans Fast API.
sidebar:
    order: 4
    label: Alembic & SQLModel
---

:::note[Documentation]
[Alembic](https://alembic.sqlalchemy.org/en/latest/)<br>
[SQL Model](https://sqlmodel.tiangolo.com/)
:::

## Installer

```sh
pip install sqlmodel alembic
```

## Intégrer pour les migrations

```sh
alembic init migrations
```

## Modifier le fichier de migration

```diff
// alembic/env.py
...
+ from models import *
...
// Modifier le fichier pour importer les models
```

## Créer et lancer les migrations

```sh
alembic revision --autogenerate -m "Ajouter la table"
```

```sh
alembic upgrade head
```