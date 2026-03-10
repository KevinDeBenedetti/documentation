# Debian

*Configuration and hardening guide for a Debian system.*

## Initial Setup

The initial system setup is crucial for your server's security and stability.

```bash
# Change the root password
passwd

# Update the package lists
sudo apt update

# Upgrade all installed packages
sudo apt upgrade -y

# Clean up obsolete packages
sudo apt autoremove -y
sudo apt autoclean

# Reboot the system to apply kernel updates
sudo reboot
```

> **Best practice**: Schedule regular updates with `cron` or enable automatic security updates using `unattended-upgrades`.

## SSH Configuration

### Securing the SSH Service

Changing the SSH port is a first useful step to reduce automated intrusion attempts.

```bash
# Edit the SSH configuration file
sudo nano /etc/ssh/sshd_config
```

### Recommended Security Settings

Modify the following settings in `/etc/ssh/sshd_config`:

```bash
# Change the default port (choose between 49152 and 65535)
Port 54321

# Disable direct root login
PermitRootLogin no

# Use public key authentication only
PubkeyAuthentication yes
PasswordAuthentication no

# Disable empty password authentication
PermitEmptyPasswords no

# Limit authentication attempts
MaxAuthTries 3

# Set a timeout for inactive connections
ClientAliveInterval 300
ClientAliveCountMax 2

# Use SSH protocol 2 only
Protocol 2
```

### Restart the SSH Service

```bash
# Validate the configuration file syntax
sudo sshd -t

# Restart the SSH service
sudo systemctl restart sshd

# Check the service status
sudo systemctl status sshd

# Test connection with the new port BEFORE closing your current session
ssh your_user@server_ip -p 54321
```

> **WARNING**: Do not close your current SSH session before testing the new settings in a separate terminal.

### Firewall Configuration

```bash
# Install UFW
sudo apt install ufw -y

# Allow the new SSH port
sudo ufw allow 54321/tcp

# Enable the firewall
sudo ufw enable

# Check active rules
sudo ufw status verbose
```

## Keyboard Configuration

### System Locales

```bash
# Reconfigure locales
sudo dpkg-reconfigure locales
```

### Keyboard Layout

```bash
# Install keyboard configuration packages
sudo apt install keyboard-configuration console-setup -y

# Reconfigure the keyboard layout
sudo dpkg-reconfigure keyboard-configuration
```

### Set Layout Permanently

```ini
# /etc/default/keyboard
XKBMODEL="pc105"
XKBLAYOUT="fr"
XKBVARIANT=""
XKBOPTIONS=""
BACKSPACE="guess"
```

```bash
# Apply changes
sudo dpkg-reconfigure -phigh console-setup
```

## Additional Optimizations

### Timezone

```bash
# Set the timezone
sudo timedatectl set-timezone Europe/Paris

# Verify configuration
timedatectl
```

### Create a Non-root User

```bash
# Create a new user
sudo adduser your_user

# Add the user to the sudo group
sudo usermod -aG sudo your_user

# Check the user's groups
groups your_user
```

> **Security**: Always use a standard user account for daily operations and reserve the root account for critical administrative tasks.

## Resources

- [OVH Security Guide](https://help.ovhcloud.com/csm/fr-vps-security-tips?id=kb_article_view&sysparm_article=KB0047708)
- [Debian Documentation](https://www.debian.org/doc/)
