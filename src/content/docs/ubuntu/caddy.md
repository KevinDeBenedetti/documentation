---
title: Ubuntu | Caddy
lastUpdated: 2024-02-25
description: Un guide pour utiliser caddy avec ubuntu 23.10.
sidebar:
    order: 2
    label: Caddy
    badge:
      text: Nouveau
      variant: success
---

:::note[Documentation]
[caddy.com](https://caddyserver.com/)
[Multi domaines ressources](https://pratikpc.medium.com/using-caddy-to-create-virtual-hosts-for-your-multi-domain-names-as-a-reverse-proxy-from-a-single-2ce0b7a53a9e)
:::

## Installer Caddy

## Paramétrer

### Pour un conteneur Docker

```bash title="Modifier le Caddyfile"
editor /etc/caddy/Caddyfile
```
Dans le répertoire `/etc/caddy`, modifier le fichier Caddyfile.

```txt
// /etc/caddy/Caddyfile

:80 {
        # Set this path to your site's directory.
        # root * /usr/share/caddy

        # Enable the static file server.
        # file_server

        # Another common task is to set up a reverse proxy:
        # reverse_proxy localhost:8080
        reverse_proxy :3000

        # Or serve a PHP site through php-fpm:
        # php_fastcgi localhost:9000
}
```

```bash title="Redémarrer caddy."
systemctl reload caddy
```
Pour que les modifications soient effectives, il faut redémarrer caddy.

## Nom de domaine

:::tip
[Documentation officielle](https://caddyserver.com/docs/quick-starts/https)
:::

```bash title="Tester le nom de domaine"
curl "https://cloudflare-dns.com/dns-query?name=example.com&type=A" \
  -H "accept: application/dns-json"
```

```diff lang="txt"
// /etc/caddy/Caddyfile

https://exemple.fr {
        # Set this path to your site's directory.
        # root * /usr/share/caddy

        # Enable the static file server.
        # file_server

        # Another common task is to set up a reverse proxy:
        # reverse_proxy localhost:8080
        reverse_proxy :3000

        # Or serve a PHP site through php-fpm:
        # php_fastcgi localhost:9000
}
```
Caddy prend en charge la navigation https.