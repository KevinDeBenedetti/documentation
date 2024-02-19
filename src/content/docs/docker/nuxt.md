---
title: Docker avec Nuxt js
lastUpdated: 2024-02-19
description: Un guide pour démarrer avec docker et Nuxt js.
sidebar:
    order: 1
    label: Docker & Nuxt js
    badge:
      text: Nouveau
      variant: success
---

:::tip[Documentation]
📓 [Tutoriel](https://dev.to/nklsw/how-to-create-a-dockerized-nuxt-3-development-environment-1p0a)
:::

## Configurer un conteneur de développement
Créer un fichier `docker-compose.yml` et y ajouter le contenu suivant.
```yml
// docker-compose.yml
version: '3.3'

services:
  nuxt:
    build:
      context: .
    image: your-image-name
    container_name: your-container-name
    command: npm run dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
```

Créer un fichier `Dockerfile` et y ajouter le contenu suivant.
```yml
// Dockerfile.yml
# Le nom du fichier est `Dockerfile` sans extension.
FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY ./package*.json /app/

RUN npm install && npm cache clean --force

COPY . .

ENV PATH ./node_modules/.bin/:$PATH
```

Exécuter le conteneur : 
```shell title="Commande pour exécuter le conteneur"
docker-compose up
```

