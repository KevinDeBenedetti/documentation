# Fail2Ban

*A guide to configuring Fail2Ban for intrusion prevention.*

## Overview

Fail2Ban is an intrusion prevention tool designed to block IP addresses used by bots or attackers attempting to compromise your system. It detects and mitigates unauthorized access attempts like brute-force login attempts or DoS attacks.

## Installation

```bash
# Install the package
sudo apt install fail2ban
```

## Configuration

```bash
# Create a local configuration file
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Open the file in a text editor
sudo nano /etc/fail2ban/jail.local
```

Modify the SSH section:

```ini
# /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
findtime = 5m
bantime = 30m
backend = systemd
```

## Restart the Service

```bash
sudo service fail2ban restart
```

## Resources

- [Fail2Ban GitHub](https://github.com/fail2ban/fail2ban)
- [OVH Security Guide](https://help.ovhcloud.com/csm/fr-vps-security-tips?id=kb_article_view&sysparm_article=KB0047708)
