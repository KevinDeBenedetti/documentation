---
title: GHCR & GitHub Actions
lastUpdated: 2024-07-27
description: Un guide pour utiliser GHCR & GitHub Actions avec Docker.
sidebar:
    order: 4
    label: GHCR & GitHub Actions
---

## GitHub Actions

Nous utiliserons GitHub Actions avec ghcr pour construire et mettre en ligne nos images.

Créer les dossiers `.github/workflows/`, à la racine du projet.
```diff lang="yaml"
// .github/workflows/ghcr.yaml
name: GitHub Container Registry 

on:
  push:
    branches:
      - main
```

## GHCR

Pour monter et pousser nos images docker nous utiliserons ghcr, dans le fichier `ghcr.yaml` ajouter les commandes suivantes.

### Configurer
```diff lang="yaml"
// .github/workflows/ghcr.yaml
name: GitHub Container Registry 

on:
  push:
    branches:
      - main

+jobs:
+  ghcr:
+    runs-on: ubuntu-latest
+    permissions:
+      contents: write
+      packages: write
+      attestations: write
+      id-token: write

+    steps:
+    - name: Checkout repository
+      uses: actions/checkout@v4
```

### Se connecter
```diff lang="yaml"
// .github/workflows/ghcr.yaml
name: GitHub Container Registry 

on:
  push:
    branches:
      - main

jobs:
  ghcr:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      attestations: write
      id-token: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

+    - name: Log in to GitHub Container Registry
+      uses: docker/login-action@v3
+      with:
+        registry: ghcr.io
+        username: ${{ github.actor }}
+        password: ${{ secrets.GITHUB_TOKEN }}

+    - name: Logout from GHCR
+      run: docker logout ghcr.io
```

### Construire et pousser l'image
```diff lang="yaml"
// .github/workflows/ghcr.yaml
name: GitHub Container Registry 

on:
  push:
    branches:
      - main

jobs:
  ghcr:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      attestations: write
      id-token: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

+    - name: Set lowercase repository owner
+      run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV

+    - name: Build and push Api Docker image
+      run: |
+        docker build -t ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest ./<APP_CODE>
+        docker push ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest

    - name: Logout from GHCR
      run: docker logout ghcr.io
```

### Déployer sur un VPS
```diff lang="yaml"
// .github/workflows/ghcr.yaml
name: GitHub Container Registry 

on:
  push:
    branches:
      - main

jobs:
  ghcr:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      attestations: write
      id-token: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Set lowercase repository owner
      run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV

    - name: Build and push Api Docker image
      run: |
        docker build -t ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest ./<APP_CODE>
        docker push ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest

    - name: Logout from GHCR
      run: docker logout ghcr.io

+  deploy:
+    needs: [ghcr]
+    runs-on: ubuntu-latest
+    steps:
+        - name: Deploy using ssh
+          uses: appleboy/ssh-action@v1.0.3
+          with:
+            host: ${{ secrets.SSH_HOST }}
+            username: ${{ secrets.SSH_USERNAME }}
+            password: ${{ secrets.SSH_PASSWORD }}
+            port: ${{ secrets.SSH_PORT }}
+            script: |
+              docker pull ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest
+              docker compose.prod.yaml
```

### Configurer le VPS

#### Créer un fichier `compose.prod.yaml`
```diff lang="yaml"
// ./<PROJECT_NAME>/compose.prod.yaml
services:
  app:
    image: ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest
    ports:
    - "XXXX:XXXX"
```

#### Se connecter au VPS
Dans le terminal, se connecter au service ghcr avec un personnal access tokens.

Se connecter à GitHub, aller dans `Settings` puis `Developer settings`. Une fois dans `Developer Settings`, dans `Personal access tokens` choisir `Tokens (classic)` et générer un nouveau token avec les droits sélectionnés.

```diff lang="shell"
docker login ghcr.io -u <github_username>
```

```diff lang="shell"
Password: <personal_access_tokens>
```

:::tip[Ressources]
[GitHube Docs](https://docs.github.com/fr/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

[Medium](https://medium.com/@ajay-er/automate-docker-image-deployment-to-ghcr-with-github-actions-97bb9a318d7c)

[Programonaut](https://www.programonaut.com/how-to-deploy-a-docker-image-to-a-server-using-github-actions/)
:::