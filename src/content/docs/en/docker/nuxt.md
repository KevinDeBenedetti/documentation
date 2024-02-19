---
title: Docker with Nuxt js
lastUpdated: 2024-02-19
description: A guide to getting started with docker and Nuxt js..
sidebar:
    order: 1
    label: Docker & Nuxt js
    badge:
      text: New
      variant: success
---

:::tip[Documentation]
📓 [Tutorial](https://dev.to/nklsw/how-to-create-a-dockerized-nuxt-3-development-environment-1p0a)
:::

## Configure a development container
Create a `docker-compose.yml` file and add the following content.
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

Create a `Dockerfile` file and add the following content.
```yml
// Dockerfile.yml
# The name is `Dockerfile` without extension

version: '3.3'

FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY ./package*.json /app/

RUN npm install && npm cache clean --force

COPY . .

ENV PATH ./node_modules/.bin/:$PATH
```

Execute the container : 
```shell title="Command to execute the container"
docker-compose up
```

