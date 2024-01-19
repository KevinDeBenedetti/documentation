---
title: Configurer Github Pages - Vue
description: Un guide pour configurer Github Pages avec Vue.
sidebar:
    order: 2
    label: Github Pages
#    badge:
#        text: New
#        variant: success
---

## Déployer son application Vite / Vue 3 pour Github Pages

Ce tutoriel est inspiré de la ressource suivante [documentation](https://mkay11.medium.com/how-to-deploy-your-vite-vue-3-application-in-github-pages-2023-2b842f50576a)

### 1 - Lier son repository Github

### 2 - Modifier le chemin
```js {3}
// vite.config.js
export default defineConfig({
  base: './',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {}
  }
})
```

### 3 - Modifier le fichier .gitignore
```diff
// .gitignore
// Supprimer les lignes suivantes
- dist
- dist-ssr
```

### 4 - Build le projet
```sh frame="none"
npm run build
```

### 5 - Déployer le build
```sh frame="none"
git subtree push --prefix dist origin gh-pages
```
