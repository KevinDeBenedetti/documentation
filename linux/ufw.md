# UFW

*A guide to configuring the UFW (Uncomplicated Firewall).*

## Install and Enable

```bash
# Install UFW
sudo apt install ufw

# Enable the UFW firewall
sudo ufw enable

# Check UFW status
sudo ufw status
```

## Configure the Firewall

```bash
# Default policy: deny incoming connections
sudo ufw default deny incoming

# Default policy: allow outgoing connections
sudo ufw default allow outgoing

# Allow SSH connections (port 22 by default)
sudo ufw allow ssh

# Allow HTTP connections (port 80)
sudo ufw allow http

# Allow HTTPS connections (port 443)
sudo ufw allow https
```

## Fail2Ban Integration

```bash
# Start the Fail2Ban service
sudo systemctl start fail2ban

# Check Fail2Ban status
sudo systemctl status fail2ban

# Restart Fail2Ban configuration
sudo systemctl restart fail2ban
```

## Resources

- [Hostinger — UFW Tutorial](https://www.hostinger.fr/tutoriels/comment-configurer-un-pare-feu-sur-ubuntu-avec-ufw)
- [Gandi — UFW Guide](https://news.gandi.net/en/2022/10/how-to-configure-a-firewall-with-ufw-on-a-gandicloud-vps-with-ubuntu-or-debian/)
