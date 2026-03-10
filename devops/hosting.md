# Hosting

*A guide to configuring hosting, domains and Dokploy.*

## Domains

### Modify DNS Records

Modify the `A` record, add the VPS IP address (`IPv4` and `IPv6`). Modify the `data` field: VPS IP address.

### Add the Domain Name

Add a domain in the Secondary DNS section. Follow the instructions to add the domain to a secondary DNS.

> This information is provided by the domain provider and/or hosting provider.

### Subdomains

Add a subdomain in the DNS section.

#### Add a CNAME Record

`Name` corresponds to the subdomain, and `Data` corresponds to the domain name.

> **Resource**: [GoDaddy Documentation](https://www.godaddy.com/help/add-a-cname-record-19236)

## Dokploy

[Dokploy](https://docs.dokploy.com/) is an open-source continuous deployment tool that automates application deployment on remote servers via SSH.

### Telegram Notifications

To configure Telegram notifications:

1. **Name**: enter a name for the bot.
2. **Bot Token**: enter the bot token. Available on the `@BotFather` Telegram app.
3. **Chat ID**: enter the chat ID. To retrieve the channel ID, go to `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`

## Resources

- [Dokploy GitHub](https://github.com/Dokploy/dokploy)
- [Dokploy — Telegram Notifications](https://docs.dokploy.com/docs/core/telegram)
