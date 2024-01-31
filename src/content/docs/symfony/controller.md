---
title: Controller
lastUpdated: 2024-01-21
description: Un guide pour créer des contrôleurs avec Symfony.
sidebar:
    order: 2
    label: Controller
---

Un contrôleur est une fonction PHP que vous créez qui lit les informations de l’objet Request et crée et renvoie un objet Response. La réponse pourrait être une page HTML, JSON, XML, un téléchargement de fichier, une redirection, une erreur 404 ou toute autre chose. Le contrôleur exécute toute logique arbitraire dont votre application a besoin pour rendre le contenu d’une page.

:::tip
Cette commande va créer un controller nommé HomeController, ainsi qu'un template avec Twig.
:::
```bash title="Créer un controller avec Maker"
symfony console make:controller HomeController
```