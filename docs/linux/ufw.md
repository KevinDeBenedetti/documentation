# UFW

*Uncomplicated Firewall configuration for Debian/Ubuntu — including k3s cluster rules.*

## Install and Enable

```bash
sudo apt install ufw -y

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Enable (apply rules immediately)
sudo ufw enable
sudo ufw status verbose
```

---

## Base Rules

```bash
# SSH
sudo ufw allow 22/tcp comment 'SSH'

# HTTP / HTTPS
sudo ufw allow 80/tcp  comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
```

---

## k3s Cluster Rules

The k3s install scripts configure UFW automatically. These are the rules applied per node.

### Master Node (VPS1)

```bash
# API server — accessed by workers and local kubectl
sudo ufw allow 6443/tcp comment 'k3s API server'

# Pod and service CIDR traffic (Flannel)
sudo ufw allow from 10.42.0.0/16 to any comment 'k3s pod traffic'
sudo ufw allow from 10.43.0.0/16 to any comment 'k3s service traffic'

# VXLAN overlay from worker (Flannel)
sudo ufw allow from <WORKER_IP> to any port 8472 proto udp comment 'flannel VXLAN from worker'

# kubelet API from worker
sudo ufw allow from <WORKER_IP> to any port 10250 proto tcp comment 'k3s kubelet from worker'
```

### Worker Node (VPS2)

```bash
# Public HTTP/HTTPS (Traefik LoadBalancer)
sudo ufw allow 80/tcp  comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Pod and service CIDR traffic (Flannel)
sudo ufw allow from 10.42.0.0/16 to any comment 'k3s pod traffic'
sudo ufw allow from 10.43.0.0/16 to any comment 'k3s service traffic'

# VXLAN overlay from master (Flannel)
sudo ufw allow from <MASTER_IP> to any port 8472 proto udp comment 'flannel VXLAN from master'

# kubelet API from master
sudo ufw allow from <MASTER_IP> to any port 10250 proto tcp comment 'k3s kubelet from master'
```

### Apply Changes

```bash
sudo ufw reload
sudo ufw status numbered
```

---

## Managing Rules

```bash
# List rules with line numbers
sudo ufw status numbered

# Delete a rule by number
sudo ufw delete <number>

# Delete a rule by spec
sudo ufw delete allow 8080/tcp

# Insert at a specific position
sudo ufw insert 1 allow from 1.2.3.4 to any port 22

# Disable UFW (not recommended in production)
sudo ufw disable
```

---

## Logging

```bash
# Enable logging
sudo ufw logging on       # low (default)
sudo ufw logging medium   # includes blocked + allowed
sudo ufw logging full     # verbose

# View logs
sudo tail -f /var/log/ufw.log

# via journalctl
sudo journalctl -u ufw -f
sudo journalctl -u ufw --since "1 hour ago"
```

---

## Fail2Ban Integration

Fail2Ban writes its ban rules to the `f2b-*` chains in iptables — it integrates transparently with UFW without extra configuration.

```bash
# Verify Fail2Ban is running alongside UFW
sudo systemctl status fail2ban
sudo fail2ban-client status sshd
```

See [fail2ban.md](fail2ban.md) for configuration details.

---

## Port Reference

| Port  | Protocol | Service         | Notes                          |
| ----- | -------- | --------------- | ------------------------------ |
| 22    | TCP      | SSH             | Restrict source IP if possible |
| 80    | TCP      | HTTP (Traefik)  | Worker node                    |
| 443   | TCP      | HTTPS (Traefik) | Worker node                    |
| 6443  | TCP      | k3s API server  | Master — worker + local only   |
| 8472  | UDP      | Flannel VXLAN   | Between master and worker      |
| 10250 | TCP      | kubelet API     | Between master and worker      |

---

## Resources

- [UFW Manual](https://manpages.ubuntu.com/manpages/jammy/en/man8/ufw.8.html)
- [k3s networking requirements](https://docs.k3s.io/installation/requirements#networking)
