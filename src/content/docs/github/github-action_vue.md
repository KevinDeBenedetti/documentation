---
title: GitHub Actions / Vue 3 - Vite
lastUpdated: 2024-02-18
description: Un guide pour démarrer avec Github Actions.
sidebar:
    order: 1
    label: GitHub Actions / Vue 3 - Vite
    # badge:
    #   text: Nouveau
    #   variant: success
---

Vous pourrez déployer et publier votre code Vue 3 avec GitHub Actions et Github Pages.

:::tip[Documentation]
📓 [Marketplace](https://github.com/marketplace/actions/vue-to-github-pages)
:::

## Configurer un projet Vue 3 pour GitHub Actions & Pages

### Modifier `vite.config.js`

```diff lang="js"
// vite.config.js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
+  base: '/repo-name/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
```

### Créer un fichier GitHub Actions Workflow

```yml
// .github/workflows/deploy.yml

# Simple workflow for deploying static content to GitHub Pages
name: Deploy to GitHub Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          # Upload dist repository
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```