---
title: Utiliser un thème enfant WordPress
lastUpdated: 2024-09-05
description: Un guide pour créer un thème enfant WordPress.
sidebar:
    order: 1
    label: Thème enfant    
---

## `functions.php`

```php
<?php
add_action('wp_enqueue_scripts', 'theme_enqueue_styles');
function theme_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('theme-style', get_stylesheet_directory_uri() . '/assets/css/theme.css', array(), filemtime(get_stylesheet_directory() . '/assets/css/theme.css'));

    if (is_front_page()) {
        wp_enqueue_style('home-css', get_stylesheet_directory_uri() . '/assets/css/home.css', array(), filemtime(get_stylesheet_directory_uri() . '/assets/css/home.css')); 
    }

    ...

    if (is_page( 'contact' )) {
        wp_enqueue_style('contact-css', get_stylesheet_directory_uri() . '/assets/css/contact.css', array(), filemtime(get_stylesheet_directory_uri() . '/assets/css/contact.css')); 
    }
}
```

## `style.css`

```css
/*
Theme Name: nom_du_thème_enfant
Author: Kevin De Benedetti
Author URI: https://www.kevindb.dev/
Template: twentytwentyfour
*/
```

## Hiérarchie des dossiers
```
📂 /themes
└── 📁 /nom_du_theme_enfant
    ├── 📄 functions.php
    ├── 🖼️ screenshot.png
    ├── 🎨 style.css
    └── 📁 /css
        ├── 🎨 theme.css
        ├── 🎨 contact.css
        └── 📁 /layouts
            └── 🎨 header.css

```
