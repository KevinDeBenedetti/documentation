---
title: Ubuntu | Caddy
lastUpdated: 2024-02-27
description: Un guide pour utiliser caddy avec ubuntu 23.10.
sidebar:
    order: 1
    label: Caddy
---

:::note[Documentation]
[caddy.com](https://caddyserver.com/)
[Multi domaines ressources](https://pratikpc.medium.com/using-caddy-to-create-virtual-hosts-for-your-multi-domain-names-as-a-reverse-proxy-from-a-single-2ce0b7a53a9e)
:::

## Installer Caddy

```bash title="Installer la version stable"
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## Paramétrer pour Docker

```bash title="Modifier le Caddyfile"
editor /etc/caddy/Caddyfile
```
Dans le répertoire `/etc/caddy`, modifier le fichier Caddyfile.

```diff lang="txt"
// /etc/caddy/Caddyfile

:80 {
-        # Set this path to your site's directory.
-        # root * /usr/share/caddy
-
-        # Enable the static file server.
-        # file_server
-
-        # Another common task is to set up a reverse proxy:
-        # reverse_proxy localhost:8080
+        reverse_proxy :3000
-
-        # Or serve a PHP site through php-fpm:
-        # php_fastcgi localhost:9000
}
```

```bash title="Redémarrer caddy."
systemctl reload caddy
```
Pour que les modifications soient effectives, il faut redémarrer caddy.

## Nom de domaine

:::tip
La configuration HTTPS est générée automatiquement, les certificats TLS sont générés par Caddy.
[Documentation HTTPS](https://caddyserver.com/docs/quick-starts/https)
:::

```bash title="Tester le nom de domaine"
curl "https://cloudflare-dns.com/dns-query?name=example.com&type=A" \
  -H "accept: application/dns-json"
```

```diff lang="txt"
// /etc/caddy/Caddyfile

- :80 {
+ https://exemple.fr {
        reverse_proxy :3000
}
```
Caddy prend en charge la navigation https.

## Redirection wwww

:::tip[Ressources]
[Tuto](https://jinnabalu.medium.com/caddy-http-to-https-redirections-7321bdce0aa8) <br>
[Documentation](https://caddyserver.com/docs/caddyfile/directives/redir)
:::

```diff lang="txt"
// /etc/caddy/Caddyfile
+ https://www.example.fr {
+         redir https://exampe.fr permanent
+ }
https://exemple.fr {
        reverse_proxy :3000
}
```

Sauvegarder et relancer caddy.

## Lighthouse

:::tip[Documentation]
[encode](https://caddyserver.com/docs/caddyfile/directives/encode#encode)
:::

Pour améliorer les performances de notre site statique, il nous faudra l'encoder. Voici un exemple de configuration avec `gzip`.

```diff lang="text
// /etc/caddy/Caddyfile
https://www.example.fr {
        redir https://exampe.fr permanent
}
https://exemple.fr {
+        encode gzip
        reverse_proxy :3000
}
```