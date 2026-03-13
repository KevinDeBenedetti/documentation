# Prerequisites

> System, network, and security requirements before installing k3s on any node.

## Supported OS

Both nodes run **Debian 13 (Trixie)** — the officially supported and tested distribution.

```
Debian 13 (Trixie) — 64-bit (amd64)
Kernel: 6.12 (Debian default)
```

> k3s also supports Ubuntu 22.04/24.04, Raspberry Pi OS, and other mainstream distros. See [k3s installation requirements](https://docs.k3s.io/installation/requirements).

## Minimum Hardware

| Resource | Master (VPS1) | Worker (VPS2) |
| -------- | ------------- | ------------- |
| CPU      | 1 vCPU        | 1–2 vCPU      |
| RAM      | 1 GB          | 2 GB          |
| Disk     | 20 GB         | 20 GB         |

> For production workloads, 2 vCPU / 2 GB RAM per node is recommended.

## Node Bootstrap (Dotfiles)

Before installing k3s, each VPS must be provisioned with the base environment: packages, security hardening (UFW, Fail2Ban, AppArmor, SSH hardening, kernel sysctl) via the dotfiles setup script.

```bash
# From local machine (using the infra Makefile)
make setup-master   # bootstrap VPS1
make setup-worker   # bootstrap VPS2

# Or manually on each VPS as root:
bash <(curl -fsSL https://raw.githubusercontent.com/KevinDeBenedetti/dotfiles/main/os/debian/init.sh) -a
```

## Kernel Modules

The following kernel modules must be loaded on **every node** (master and worker).

```bash
modprobe overlay
modprobe br_netfilter
```

Persist them across reboots:

```bash
cat > /etc/modules-load.d/k3s.conf << 'EOF'
overlay
br_netfilter
EOF
```

## Kernel Parameters (sysctl)

k3s requires IP forwarding and bridge netfilter to be enabled. These settings override the security-hardened defaults applied by the dotfiles setup.

> **Important:** The file is named `99-z-k3s.conf` (prefixed `99-z-`) so it sorts **after** the dotfiles `99-security.conf` and correctly overrides `net.ipv4.ip_forward=0` → `1`.

```bash
cat > /etc/sysctl.d/99-z-k3s.conf << 'EOF'
# k3s networking requirements
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
net.ipv4.conf.all.forwarding        = 1
# Required by --protect-kernel-defaults
vm.panic_on_oom                     = 0
vm.overcommit_memory                = 1
kernel.panic                        = 10
kernel.panic_on_oops                = 1
EOF

sysctl --system
```

Verify:

```bash
sysctl net.ipv4.ip_forward          # should print 1
sysctl net.bridge.bridge-nf-call-iptables  # should print 1
```

## Disable Swap

Kubernetes requires swap to be disabled.

```bash
# Disable immediately
swapoff -a

# Disable permanently (comment out swap entry in /etc/fstab)
sed -i '/ swap / s/^\(.*\)$/#\1/' /etc/fstab

# Verify
free -h   # Swap line should show 0
```

## Firewall (UFW)

UFW is configured by the dotfiles setup. The k3s install scripts add the necessary rules automatically. For reference, here are the rules added per node:

### Master (VPS1)

```bash
ufw allow 6443/tcp comment 'k3s API server'
ufw allow from 10.42.0.0/16 to any comment 'k3s pod traffic'
ufw allow from 10.43.0.0/16 to any comment 'k3s service traffic'
ufw allow from <WORKER_IP> to any port 8472 proto udp comment 'flannel VXLAN from worker'
ufw allow from <WORKER_IP> to any port 10250 proto tcp comment 'k3s kubelet from worker'
```

### Worker (VPS2)

```bash
ufw allow 80/tcp  comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow from <MASTER_IP> to any port 8472 proto udp comment 'flannel VXLAN from master'
ufw allow from <MASTER_IP> to any port 10250 proto tcp comment 'k3s kubelet from master'
ufw allow from 10.42.0.0/16 to any comment 'k3s pod traffic'
ufw allow from 10.43.0.0/16 to any comment 'k3s service traffic'
```

## Local Machine Requirements

The following tools must be installed on the machine you operate from (not on the VPS nodes):

| Tool       | Purpose                                                  |
| ---------- | -------------------------------------------------------- |
| `kubectl`  | Interact with the Kubernetes cluster                     |
| `helm`     | Deploy Traefik and cert-manager via Helm charts          |
| `ssh`      | Remote access to both VPS nodes                          |
| `htpasswd` | Generate BasicAuth credentials for the Traefik dashboard |

```bash
# macOS
brew install kubernetes-cli helm httpd
```

## Environment Variables

Copy the template and fill in your values:

```bash
cp .env.example .env
```

```ini
# .env
MASTER_IP=1.2.3.4
WORKER_IP=5.6.7.8
SSH_USER=kevin
SSH_PORT=22
SSH_KEY=~/.ssh/id_ed25519

DOMAIN=example.com
EMAIL=you@example.com

K3S_VERSION=v1.32.2+k3s1
K3S_NODE_TOKEN=            # filled after master install
KUBECONFIG_CONTEXT=k3s-infra
```

> `K3S_NODE_TOKEN` is either supplied before install (used as the shared secret) or printed at the end of the master install script if not set.

## Pre-flight Checklist

- [ ] Debian 13 installed on both VPS nodes
- [ ] SSH access with key authentication working
- [ ] `make setup-master` and `make setup-worker` completed successfully
- [ ] Swap disabled (`free -h` shows 0 swap)
- [ ] Kernel modules loaded (`lsmod | grep -E 'overlay|br_netfilter'`)
- [ ] sysctl `ip_forward=1` confirmed
- [ ] UFW active and configured
- [ ] `.env` filled with correct IPs, user, and domain
- [ ] `kubectl`, `helm`, `htpasswd` available locally
