# Caddy

*A guide to configuring Caddy as a reverse proxy with automatic HTTPS.*

## Installing Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## Configuring for Docker

```bash
# Edit the Caddyfile
editor /etc/caddy/Caddyfile
```

```txt
# /etc/caddy/Caddyfile
:80 {
    reverse_proxy :3000
}
```

```bash
# Restart Caddy
systemctl reload caddy
```

## Domain Name

HTTPS configuration is automatically generated, and TLS certificates are issued by Caddy.

```bash
# Test the domain name
curl "https://cloudflare-dns.com/dns-query?name=example.com&type=A" \
  -H "accept: application/dns-json"
```

```txt
# /etc/caddy/Caddyfile
https://example.com {
    reverse_proxy :3000
}
```

## Redirect www

```txt
# /etc/caddy/Caddyfile
https://www.example.com {
    redir https://example.com permanent
}
https://example.com {
    reverse_proxy :3000
}
```

## Performance with gzip

To improve performance, enable encoding:

```txt
# /etc/caddy/Caddyfile
https://www.example.com {
    redir https://example.com permanent
}
https://example.com {
    encode gzip
    reverse_proxy :3000
}
```

## Resources

- [Caddy Documentation](https://caddyserver.com/)
- [HTTPS Quick Start](https://caddyserver.com/docs/quick-starts/https)
- [Encode Directive](https://caddyserver.com/docs/caddyfile/directives/encode)
