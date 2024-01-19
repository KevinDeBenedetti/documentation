---
title: Installer Tailwind CSS - Vue
description: Un guide pour démarrer Tailwind CSS avec Vue.
sidebar:
    order: 1
    label: Tailwind CSS
#    badge:
#        text: New
#        variant: success
---

## Documentation officielle

Les informations ci-dessous proviennent de la [documentation officielle](https://tailwindcss.com/docs/guides/vite#vue) de Tailwind CSS.

### 1 - Installation de tailwindcss avec Vite
```sh frame="none"
npm install -D tailwindcss postcss autoprefixer
```

### 2 - Générer les fichiers nécessaires
```sh frame="none"
npx tailwindcss init -p
```

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3 - Configurer le fichier généré
```js {3-6} 
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4 - Ajout du CSS
```css
// /src/assets/main.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
