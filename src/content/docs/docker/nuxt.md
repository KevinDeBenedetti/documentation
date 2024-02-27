---
title: Docker avec Nuxt js
lastUpdated: 2024-02-27
description: Un guide pour démarrer avec docker et Nuxt js.
sidebar:
    order: 2
    label: Nuxt js
---

## Développement et Production

:::tip[Ressources]
🔖 [Tuto](https://markus.oberlehner.net/blog/running-nuxt-3-in-a-docker-container/)
:::

### Production

Créer les fichiers `Dockerfile` et `docker-compose.yml`.

```yml title="Dockerfile"
# syntax = docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine as base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /src

  # Build
FROM base as build

COPY --link package.json package-lock.json .
RUN npm install --production=false

COPY --link . .

RUN npm run build
RUN npm prune

  # Run
FROM base

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output
  # Optional, only needed if you rely on unbundled dependencies
  # COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]
```

```yml
// docker-compose.yml

version: "3"
services:
  production:
    # Ajout de la plateforme de destination
    platform: linux/amd64
    build:
      context: .
    ports:
      - "3001:3000"
```

### Développement

```yml title="Dockerfile.dev"
# syntax = docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim as base

ENV NODE_ENV=development

WORKDIR /src

  # Build
FROM base as build

COPY --link package.json package-lock.json .
RUN npm install

  # Run
FROM base

COPY --from=build /src/node_modules /src/node_modules

CMD [ "npm", "run", "dev" ]
```

```yml
// docker-compose.dev.yml

version: "3"

volumes:
  node_modules:
services:
  development:
    build:
      context: .
      dockerfile: ./Dockerfile.dev
    ports:
      - "3000:3000"
      - "24678:24678"
    volumes:
      - .:/src
      - node_modules:/src/node_modules
```

### Commandes

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Développement uniquement

:::tip[Ressources]
🔖 [Tuto](https://dev.to/nklsw/how-to-create-a-dockerized-nuxt-3-development-environment-1p0a)
🔖 [Tuto](https://medium.com/@jkpeyi/deploying-a-nuxt-js-application-with-docker-69bf822c066d)
:::

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

