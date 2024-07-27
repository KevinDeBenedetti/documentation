---
title: Dockerfile
lastUpdated: 2024-07-27
description: Des exemples de Dockerfile.
sidebar:
    order: 7
    label: Dockerfile
---

## Dockerfile

## Dockerfiles

### Nuxt JS
```diff lang="dockerfile"
# syntax=docker/dockerfile:1
ARG NODE_VERSION=21.0.0

ARG PORT=3000

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

FROM base as build

COPY package.json /app/
COPY pnpm-lock.yaml /app/

# Install pnpm
RUN npm install -g pnpm

# Install all depencies
RUN pnpm install

ADD . /app

RUN pnpm run build

FROM base

EXPOSE $PORT

COPY --from=build /app/.output /app/.output

CMD ["node", ".output/server/index.mjs"]
```

### Fastapi
```diff lang="dockerfile"
FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "80"]
```