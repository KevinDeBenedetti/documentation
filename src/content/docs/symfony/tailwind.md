---
title: Tailwind CSS
lastUpdated: 2024-02-18
description: Un guide pour modifier les pages d'erreurs avec Symfony.
sidebar:
    order: 11
    label: Tailwind CSS
---

Vous trouverez une documentation pour intégrer tailwind dans un projet Symfony.

:::tip[Documentation]
📓 [Tailwind CSS](https://tailwindcss.com/docs/guides/symfony)
📓 [Symfony](https://symfony.com/doc/current/frontend/asset_mapper.html#using-tailwind-css)
:::

## Installer le bundle webpack encore
Installez Webpack Encore, ce bundle gère la construction des assets.
```shell title="Installer le bundle symfony/webpack-encore-bundle"
composer require symfony/webpack-encore-bundle
```
:::note[symfony/webpack-encore-bundle]
📓 [Documentation](https://symfony.com/doc/current/frontend/encore/installation.html) <br>
📦 [Component](https://symfony.com/doc/current/frontend.html)
:::

## Installer Tailwind CSS
En utilisant npm, installez tailwindcss et ses dépendances, ainsi que postcss-loader, puis exécutez la commande init pour générer à la fois tailwind.config.js et postcss.config.js.
```shell title="Installer le bundle symfony/webpack-encore-bundle"
npm install -D tailwindcss postcss postcss-loader autoprefixer
npx tailwindcss init -p
```

## Activer le support PostCSS
Activez PostCSS Loader dans le script webpack.config.js.
```diff lang="js"
// webpack.config.js
// ...
+ .enablePostCssLoader();
```
:::note[PostCSS]
📓 [Documentation](https://symfony.com/doc/current/frontend/encore/postcss.html) <br>
📦 [PostCSS](https://postcss.org/)
:::

## Configurer vos chemins
Ajoutez les chemins d’accès à tous vos fichiers de modèle dans votre fichier tailwind.config.js.
```diff lang="js"
// webpack.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
+  content: [
+    "./assets/**/*.js",
+    "./templates/**/*.html.twig",
+  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Ajoutez les directives Tailwind à votre CSS
Ajoutez les directives @tailwind pour chacune des couches de Tailwind à votre fichier ./assets/styles/app.css.
```diff lang="css"
// ./assets/styles/app.css
+ @tailwind base;
+ @tailwind components;
+ @tailwind utilities;
```

## Processus de construction
Exécutez votre processus de compilation avec npm run watch..
```shell title="Exécuter le processus
npm run watch
```