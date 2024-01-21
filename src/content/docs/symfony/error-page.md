---
title: Pages d'erreurs
lastUpdated: 2024-01-21
description: Un guide pour modifier les pages d'erreurs avec Symfony.
sidebar:
    order: 10
    label: Les page d'erreurs
    badge:
        text: Nouveau
        variant: success
---
Vous trouverez une documentation pour modifier les pages d'erreur de Symfony avec Twig.

:::tip
📓 [Voir la documentation](https://symfony.com/doc/current/controller/error_pages.html#security-404-pages)
:::

## Installer Twig
Le langage de modélisation Twig vous permet d’écrire des modèles concis et lisibles qui sont plus conviviaux pour les concepteurs Web et, à plusieurs égards, plus puissants que les modèles PHP.
```bash title="Installer le bundle symfony/twig-pack"
composer require symfony/twig-pack
```
:::note[symfony/twig-pack]
📓 [Documentation](https://symfony.com/doc/current/templates.html) <br>
📦 [Component](https://symfony.com/components/Twig%20Pack)
:::

## Personnaliser les pages d'erreur

```shell title="Créer les répertoires et templates"
- templates/
    - bundles/
        - Exception/
            - error403.html.twig
            - error403.html.twig
            - error500.html.twig
            - error.html.twig
```