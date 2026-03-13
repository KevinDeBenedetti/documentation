# Ubuntu — Configuration and Hardening Guide

*Complete guide to configure, secure and administer an Ubuntu server.*

## Overview

Ubuntu is one of the most popular Linux distributions for servers. This documentation covers essential configurations to deploy and harden an Ubuntu server for production.

Whether you deploy on a VPS, a dedicated server, or in the cloud, the first hours after provisioning are critical to establish a secure baseline.

## Prerequisites

- Root or sudo access to an Ubuntu server (22.04 LTS or later)
- Working SSH connection
- Basic Linux command-line knowledge

## System Configuration

### Keyboard Layout

```bash
# Launch the keyboard configuration wizard
sudo dpkg-reconfigure keyboard-configuration

# Restart the service
sudo service keyboard-setup restart

# Configure system locales
sudo dpkg-reconfigure locales
```

### System Update

```bash
# Update available package lists
sudo apt update

# Upgrade all installed packages
sudo apt upgrade -y

# Clean up obsolete packages
sudo apt autoremove -y
```

For a full upgrade including new kernels:

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt autoremove -y
sudo apt autoclean
sudo reboot
```

> **Warning**: A reboot can temporarily interrupt services. Plan this during a maintenance window.

### Password Management

```bash
# Change the current account password
passwd

# Change another user's password (root required)
sudo passwd username
```

## User Management

### Principle of Least Privilege

Using root directly is dangerous. Create a user with limited sudo privileges instead.

#### Create a New User

```bash
# Create a user with a home directory
sudo adduser username

# Alternative with full options
sudo useradd -m -s /bin/bash -G sudo username
```

#### Grant Sudo Privileges

```bash
# Add the user to the sudo group
sudo usermod -aG sudo username

# Verify group membership
groups username
```

#### Disable Root SSH Login

Once the sudo user is created and tested:

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Add or modify this line
# PermitRootLogin no

# Restart SSH
sudo systemctl restart ssh
```

## SSH Hardening

SSH is the main access vector to your server. Hardening it is **critical** to prevent intrusions.

### Changing the SSH Port

Benefits:
- Reduces automated scan noise (bots)
- Limits attack surface
- Cleaner logs (fewer intrusion attempts)

> **Important**: Changing the SSH port is **not sufficient** protection by itself. It's an additional defense layer, not a replacement for strong authentication (SSH keys) and a firewall.

#### Configuration for Ubuntu 23.04+

Ubuntu 23.04+ uses systemd socket activation for SSH:

```bash
# Check if ssh.socket is used
systemctl status ssh.socket

# Open the socket configuration
sudo nano /lib/systemd/system/ssh.socket
```

```ini
# /lib/systemd/system/ssh.socket
[Socket]
ListenStream=49152
Accept=no
```

> **Port choice**: Ports 49152–65535 are dynamic/private ports rarely used by other services.

```bash
# Reload systemd
sudo systemctl daemon-reload
sudo systemctl restart ssh.service
sudo systemctl status ssh.service

# Verify the new listening port
sudo ss -tlnp | grep ssh
```

#### Configure the Firewall

**Before** closing your current session, allow the new port:

```bash
sudo ufw allow 49152/tcp
sudo ufw delete allow 22/tcp
sudo ufw enable
sudo ufw status numbered
```

> **CRITICAL**: Never close your current SSH session before verifying you can connect on the new port in a **second session**.

#### Test Connection

```bash
# In a NEW terminal
ssh username@server_ip -p 49152
```

### Additional SSH Configuration

```bash
# /etc/ssh/sshd_config

# Disable root login
PermitRootLogin no

# Key-based authentication only
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no

# Disable challenge-response authentication
ChallengeResponseAuthentication no

# Restrict allowed users
AllowUsers username other_user

# Connection timeouts
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2

# Disable X11 forwarding
X11Forwarding no

# Enforce SSH protocol version 2
Protocol 2

# Limit authentication attempts
MaxAuthTries 3
MaxSessions 10
```

```bash
# Test configuration before restarting
sudo sshd -t

# If no errors, restart
sudo systemctl restart ssh
```

## Security Best Practices

- **Update regularly**: `sudo apt update && sudo apt upgrade` at least weekly
- **Use a firewall**: UFW or iptables to control inbound/outbound traffic
- **Install Fail2Ban**: Automatically ban IPs with repeated failed attempts
- **Enable unattended upgrades**: For security patches
- **Monitor logs**: `/var/log/auth.log` for login attempts
- **Back up regularly**: Automate backups with cron and rsync

### Install Fail2Ban

```bash
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

```ini
# /etc/fail2ban/jail.local
[sshd]
enabled = true
port = 49152
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
```

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
```

## Monitoring and Maintenance

### Monitor SSH Connections

```bash
# Show recent successful logins
last -a

# Show recent failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -n 20

# Active SSH sessions
who

# Real-time SSH log monitoring
sudo tail -f /var/log/auth.log
```

### Automatic Updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

## Post-Installation Checklist

- System updated (`apt update && apt upgrade`)
- Keyboard and locales configured
- Sudo user created and tested
- Root SSH login disabled
- SSH port changed and tested
- SSH key-based authentication configured
- Password authentication for SSH disabled
- UFW firewall configured and active
- Fail2Ban installed and configured
- Unattended upgrades enabled
- Backups configured

## Resources

- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [OpenSSH Manual](https://www.openssh.com/manual.html)
