# Firewall

*A guide to configuring a firewall for server security.*

## Basic Principle

A firewall is a security system that filters incoming and outgoing connections.

- **Inbound traffic**: Only allow necessary ports.
- **Outbound traffic**: Generally allow everything unless there are specific needs.

## Common Ports

| SSH | HTTP | HTTPS | DNS | SMTP | IMAP | POP3 | FTP |
| --- | ---- | ----- | --- | ---- | ---- | ---- | --- |
| 22  | 80   | 443   | 53  | 25   | 143  | 110  | 21  |

## Required Rules

### Inbound Traffic — Minimum

Minimal configuration for a web server:

| Protocol | Source IP | Source Port | Destination IP | Destination Port | Action |
| -------- | --------- | ----------- | -------------- | ---------------- | ------ |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 22 (ssh)         | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 80 (http)        | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 443 (https)      | ACCEPT |

### Inbound Traffic — Optional

| Protocol | Source IP | Source Port | Destination IP | Destination Port | Action |
| -------- | --------- | ----------- | -------------- | ---------------- | ------ |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 53 (dns)         | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 25 (smtp)        | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 143 (imap)       | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 110 (pop3)       | ACCEPT |
| TCP      | 0.0.0.0/0 | Any         | VPS IP         | 21 (ftp)         | ACCEPT |

### Outbound Traffic — Default

| Protocol | Source IP | Source Port | Destination IP | Destination Port | Action |
| -------- | --------- | ----------- | -------------- | ---------------- | ------ |
| All      | VPS IP    | Any         | 0.0.0.0/0      | Any              | ACCEPT |
