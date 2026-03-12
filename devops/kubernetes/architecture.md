# Architecture

> Detailed overview of the k3s cluster topology, networking model, and exposed ports.

## Cluster Topology

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                            │
│                     (HTTP :80 / HTTPS :443)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  VPS2 — Worker Node                                         │
│                                                             │
│  • k3s agent (systemd service)                              │
│  • Traefik LoadBalancer pod          → :80 / :443           │
│  • Application pods (namespace: apps)                       │
│  • local-path storage provisioner                           │
│                                                             │
│  Node IP: <WORKER_IP>                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │  Private network
                       │  Flannel VXLAN (UDP :8472)
                       │  kubelet API   (TCP :10250)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  VPS1 — Master / Control Plane                              │
│                                                             │
│  • k3s server (systemd service)                             │
│  • API server                        → TCP :6443            │
│  • etcd (embedded, single-node)                             │
│  • Controller Manager                                       │
│  • Scheduler                                                │
│                                                             │
│  Node IP / Public IP: <MASTER_IP>                           │
└─────────────────────────────────────────────────────────────┘
```

## Node Roles

| Node | Role                  | Labels             | Workloads                 |
| ---- | --------------------- | ------------------ | ------------------------- |
| VPS1 | control-plane, master | `node-role=master` | Control plane only        |
| VPS2 | worker                | `node-role=worker` | Application pods, Traefik |

## Network Ranges

| Range          | Purpose                               |
| -------------- | ------------------------------------- |
| `10.42.0.0/16` | Pod CIDR (Flannel allocates per node) |
| `10.43.0.0/16` | Service CIDR (ClusterIPs)             |

## Flannel VXLAN Overlay

k3s uses **Flannel** with the `vxlan` backend by default. Each node gets a `/24` subnet carved out of the pod CIDR:

```
VPS1 (master): 10.42.0.0/24
VPS2 (worker): 10.42.1.0/24
```

VXLAN encapsulates pod-to-pod traffic in UDP datagrams on **port 8472**, tunnelled over the nodes' private network interface.

```
Pod A (10.42.0.5) ──► VXLAN encap ──► UDP :8472 ──► VXLAN decap ──► Pod B (10.42.1.7)
```

## Port Reference

### Master (VPS1)

| Port  | Protocol | Service        | Exposed to     |
| ----- | -------- | -------------- | -------------- |
| 22    | TCP      | SSH            | Admin only     |
| 6443  | TCP      | k3s API server | Worker + local |
| 8472  | UDP      | Flannel VXLAN  | Worker         |
| 10250 | TCP      | kubelet API    | Worker         |

### Worker (VPS2)

| Port  | Protocol | Service         | Exposed to |
| ----- | -------- | --------------- | ---------- |
| 22    | TCP      | SSH             | Admin only |
| 80    | TCP      | Traefik (HTTP)  | Internet   |
| 443   | TCP      | Traefik (HTTPS) | Internet   |
| 8472  | UDP      | Flannel VXLAN   | Master     |
| 10250 | TCP      | kubelet API     | Master     |

## Ingress Flow

```
Client
  │
  │  HTTPS :443
  ▼
Traefik (LoadBalancer Service, Worker node)
  │  TLS termination
  │  cert-manager / Let's Encrypt certificate
  ▼
IngressRoute / Ingress resource
  │
  ▼
ClusterIP Service  →  Pod(s) in namespace apps
```

## TLS / Certificate Flow

```
Traefik detects IngressRoute with TLS →
cert-manager creates CertificateRequest →
ACME HTTP-01 challenge via Traefik →
Let's Encrypt issues certificate →
cert-manager stores cert in Secret →
Traefik serves HTTPS
```

## Namespace Layout

| Namespace      | Content                                                   |
| -------------- | --------------------------------------------------------- |
| `kube-system`  | k3s core components, Flannel, CoreDNS, Metrics Server     |
| `ingress`      | Traefik                                                   |
| `cert-manager` | cert-manager controller + webhook                         |
| `apps`         | Application workloads                                     |
| `monitoring`   | Prometheus, Grafana, Alertmanager (kube-prometheus-stack) |

## k3s Key Flags (Master)

| Flag                          | Purpose                                               |
| ----------------------------- | ----------------------------------------------------- |
| `--disable=traefik`           | Traefik managed via Helm instead                      |
| `--disable=servicelb`         | ServiceLB disabled (Traefik handles LoadBalancer)     |
| `--flannel-backend=vxlan`     | Explicit VXLAN overlay (stable, default)              |
| `--tls-san=<PUBLIC_IP>`       | Adds public IP to API server TLS SAN (remote kubectl) |
| `--secrets-encryption`        | Encrypts Kubernetes Secrets at rest in etcd           |
| `--protect-kernel-defaults`   | Enforces required sysctl values at startup            |
| `--write-kubeconfig-mode=600` | Restricts kubeconfig file permissions                 |
