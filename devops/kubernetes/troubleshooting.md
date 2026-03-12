# Troubleshooting

> Common errors encountered when setting up and operating the k3s cluster.

---

## Node Issues

### Node stays `NotReady`

**Symptoms:**

```
kubectl get nodes
NAME   STATUS     ROLES                  AGE   VERSION
vps1   NotReady   control-plane,master   2m    v1.32.2+k3s1
```

**Possible causes and fixes:**

**1. k3s service not running**

```bash
# On the affected node:
systemctl status k3s           # master
systemctl status k3s-agent     # worker

# If failed:
journalctl -u k3s -f --since "5 minutes ago"
systemctl restart k3s
```

**2. `ip_forward` disabled**

```bash
sysctl net.ipv4.ip_forward
# If 0:
sysctl -w net.ipv4.ip_forward=1
# Make permanent:
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.d/99-z-k3s.conf
sysctl --system
```

**3. Kernel modules missing**

```bash
lsmod | grep -E 'overlay|br_netfilter'
# If not listed:
modprobe overlay
modprobe br_netfilter
```

---

### Worker joins but shows `NotReady`

**Symptoms:** Worker appears in `kubectl get nodes` but its status is `NotReady`.

**Cause:** VXLAN tunnel between nodes not established due to firewall or token mismatch.

```bash
# On master — verify VXLAN port is open to worker:
ufw status | grep 8472

# If missing:
ufw allow from <WORKER_IP> to any port 8472 proto udp comment 'flannel VXLAN from worker'
ufw reload

# Check Flannel pod logs on the worker node:
kubectl logs -n kube-system -l app=flannel --all-containers
```

---

### `--protect-kernel-defaults` causes k3s to fail to start

**Symptoms:**

```
FATA[0000] Rancher k3s not supported on this system: ...
flag --protect-kernel-defaults set but sysctl vm.panic_on_oom=X ≠ required value
```

**Fix:** Apply the k3s sysctl file:

```bash
cat > /etc/sysctl.d/99-z-k3s.conf << 'EOF'
vm.panic_on_oom                     = 0
vm.overcommit_memory                = 1
kernel.panic                        = 10
kernel.panic_on_oops                = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
systemctl restart k3s
```

---

## Networking Issues

### Pods can't communicate across nodes

**Symptoms:** Ping between pods on different nodes times out.

**Diagnosis:**

```bash
# Check Flannel pods (should be Running on every node)
kubectl get pods -n kube-system -l app=flannel -o wide

# Check VXLAN interface on each node
ip link show flannel.1

# Check routes
ip route | grep flannel
```

**Fix:** Ensure UDP 8472 is open between nodes in both directions:

```bash
# On master:
ufw allow from <WORKER_IP> to any port 8472 proto udp
# On worker:
ufw allow from <MASTER_IP> to any port 8472 proto udp
ufw reload
```

---

### Traefik shows no `EXTERNAL-IP`

**Symptoms:**

```
kubectl get svc -n ingress
NAME      TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)
traefik   LoadBalancer   10.43.x.x      <pending>     80:xxx/TCP,443:xxx/TCP
```

**Cause:** ServiceLB (the k3s built-in load balancer) was disabled and nothing else assigns external IPs.

**Fix:** k3s's `servicelb` was intentionally disabled. Traefik gets its external IP assigned differently — it uses the worker node's IP directly when the pod is scheduled. Check if the pod is running:

```bash
kubectl get pods -n ingress -o wide
# Verify it's on the worker node
```

If still `<pending>`, check that `NodePort` or host network mode is not needed and that the Helm values have `service.type: LoadBalancer`.

---

### DNS resolution not working inside pods

**Symptoms:** `nslookup` or `curl` to service names fails inside pods.

```bash
# Test from a pod:
kubectl run dns-test --image=alpine --restart=Never --rm -it -- \
  nslookup kubernetes.default.svc.cluster.local
```

**Check CoreDNS:**

```bash
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns
```

**Fix:**

```bash
# Restart CoreDNS
kubectl rollout restart deployment/coredns -n kube-system
```

---

## TLS / cert-manager Issues

### Certificate stuck in `False` / not issuing

**Diagnosis:**

```bash
kubectl get certificate -A
kubectl describe certificate <name> -n apps
kubectl get certificaterequest -A
kubectl describe certificaterequest <name> -n apps

# Check cert-manager controller logs
kubectl logs -n cert-manager -l app=cert-manager -f
```

**Common causes:**

**1. ClusterIssuer not `Ready`**

```bash
kubectl get clusterissuer
kubectl describe clusterissuer letsencrypt-production
```

If `Not Ready`, check that cert-manager pods are running and the ACME account email is valid.

**2. HTTP-01 challenge failing**

The ACME challenge requires that `http://<domain>/.well-known/acme-challenge/` is reachable from the internet.

- DNS A record for the domain must point to the **worker node's public IP**
- Ports 80 and 443 must be open on the worker
- Traefik must be running and routing traffic

```bash
# Verify DNS (from local machine):
dig +short app.example.com
# Should return the worker's public IP

# Verify port 80 is reachable:
curl -I http://app.example.com/.well-known/acme-challenge/test
```

**3. Let's Encrypt rate limit hit**

Switch to the staging issuer first, confirm it issues a certificate, then switch to production:

```yaml
cert-manager.io/cluster-issuer: letsencrypt-staging
```

Delete the existing secret to force re-issuance after switching:

```bash
kubectl delete secret <tls-secret-name> -n apps
```

---

### TLS certificate using staging (untrusted) when production expected

```bash
# Check which issuer is annotated
kubectl get ingress <name> -n apps -o yaml | grep cluster-issuer

# Delete the staging secret and re-apply with production issuer
kubectl delete secret <tls-secret-name> -n apps
kubectl annotate ingress <name> -n apps \
  cert-manager.io/cluster-issuer=letsencrypt-production --overwrite
```

---

## Access Issues

### `kubectl` can't reach the API server

**Symptoms:**

```
Unable to connect to the server: dial tcp <MASTER_IP>:6443: connect: connection refused
```

**Check:**

```bash
# Is k3s running on master?
ssh kevin@<MASTER_IP> "systemctl status k3s"

# Is port 6443 open?
nc -zv <MASTER_IP> 6443

# UFW on master:
ssh kevin@<MASTER_IP> "ufw status | grep 6443"
```

**Fix:**

```bash
# On master — ensure API port is open:
ufw allow 6443/tcp comment 'k3s API server'
ufw reload
```

---

### kubeconfig has wrong IP / context

**Symptoms:** `kubectl` connects but shows wrong cluster or wrong nodes.

**Fix:** Re-fetch the kubeconfig:

```bash
make kubeconfig
# or:
./scripts/get-kubeconfig.sh <MASTER_IP> <SSH_USER> k3s-infra

kubectl config use-context k3s-infra
kubectl get nodes
```

---

## Storage Issues

### PVC stuck in `Pending`

**Symptoms:**

```
kubectl get pvc -n apps
NAME   STATUS    VOLUME   CAPACITY   ...
data   Pending
```

**Cause:** `local-path` uses `WaitForFirstConsumer` — the PVC remains `Pending` until a pod consumesit.

**Fix:** Create/apply the pod/deployment that uses the PVC. Once the pod is scheduled, the PV is created and the PVC transitions to `Bound`.

---

### PVC stuck in `Terminating`

```bash
# Remove the finalizer blocking deletion:
kubectl patch pvc <name> -n apps -p '{"metadata":{"finalizers":null}}'
```

---

## Useful Diagnostic Commands

```bash
# Overall cluster health
kubectl get nodes -o wide
kubectl get pods -A
kubectl top nodes     # requires metrics-server

# Events (most useful for debugging)
kubectl get events -A --sort-by='.lastTimestamp' | tail -30
kubectl get events -n apps --sort-by='.lastTimestamp'

# Describe a failing pod
kubectl describe pod <name> -n <namespace>
kubectl logs <name> -n <namespace> --previous  # previous container logs

# k3s logs on nodes
journalctl -u k3s -n 100 --no-pager           # master
journalctl -u k3s-agent -n 100 --no-pager     # worker

# Verify all components
kubectl get componentstatuses
kubectl cluster-info
```
