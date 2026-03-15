# Networking

> Pod networking (Flannel VXLAN), ingress controller (Traefik), and TLS (cert-manager).

## 1. Pod Networking — Flannel VXLAN

k3s ships with **Flannel** as its built-in CNI. No separate installation is required. The VXLAN backend is explicitly configured at install time.

### Configuration

Set at k3s server install:

```bash
--flannel-backend=vxlan
```

### How it works

Flannel allocates a `/24` subnet per node from the pod CIDR `10.42.0.0/16`:

| Node | Pod Subnet     |
| ---- | -------------- |
| VPS1 | `10.42.0.0/24` |
| VPS2 | `10.42.1.0/24` |

Pod-to-pod traffic across nodes is encapsulated in **VXLAN** datagrams over **UDP port 8472** on the nodes' private network interface.

### Verify Flannel

```bash
# Check Flannel pod
kubectl get pods -n kube-system -l app=flannel

# Check node subnets
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.podCIDR}{"\n"}{end}'

# Test inter-pod connectivity
kubectl run test-a --image=alpine --restart=Never -- sleep 600
kubectl run test-b --image=alpine --restart=Never -- sleep 600
kubectl exec test-a -- ping -c 3 $(kubectl get pod test-b -o jsonpath='{.status.podIP}')
kubectl delete pod test-a test-b
```

### CoreDNS

CoreDNS is deployed automatically by k3s and handles DNS resolution within the cluster:

```bash
# Check CoreDNS
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Test DNS resolution from a pod
kubectl run dns-test --image=alpine --restart=Never --rm -it -- \
  nslookup kubernetes.default.svc.cluster.local
```

---

## 2. Ingress Controller — Traefik

Traefik is deployed via **Helm** (not the k3s bundled version, which is disabled). This gives full control over the configuration.

### Install

```bash
helm repo add traefik https://helm.traefik.io/traefik
helm repo update traefik

helm upgrade --install traefik traefik/traefik \
  --version 34.4.0 \
  --namespace ingress \
  --create-namespace \
  --values kubernetes/ingress/traefik-values.yaml \
  --wait
```

Or via the deploy script:

```bash
make deploy      # deploys the full stack including Traefik
```

### Key Configuration (traefik-values.yaml)

```yaml
# HTTP → HTTPS redirect
ports:
  web:
    redirectTo:
      port: websecure

# TLS 1.2+ only, hardened cipher suites
tlsOptions:
  default:
    minVersion: VersionTLS12
    cipherSuites:
      - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
      - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
      - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
      - TLS_AES_128_GCM_SHA256
      - TLS_AES_256_GCM_SHA384
      - TLS_CHACHA20_POLY1305_SHA256
    sniStrict: true

# Runs as non-root
securityContext:
  capabilities:
    drop: [ALL]
    add: [NET_BIND_SERVICE]
  readOnlyRootFilesystem: true
  runAsGroup: 65532
```

### Expose an Application via Ingress

The actual pattern used in the repo (`kubernetes/apps/service-ingress.yaml`) combines a `Service` and an `Ingress` with Traefik-specific annotations:

```yaml
# kubernetes/apps/service-ingress.yaml
---
apiVersion: v1
kind: Service
metadata:
  name: example-app
  namespace: apps
spec:
  selector:
    app: example-app
  ports:
    - name: http
      port: 80
      targetPort: http
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-app
  namespace: apps
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
    cert-manager.io/cluster-issuer: letsencrypt-production
spec:
  ingressClassName: traefik
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: example-app
                port:
                  name: http
  tls:
    - hosts:
        - app.example.com
      secretName: example-app-tls
```

### Verify Traefik

```bash
# Check pod
kubectl get pods -n ingress

# Check LoadBalancer external IP (should be the worker's public IP)
kubectl get svc -n ingress traefik

# Check Traefik logs
kubectl logs -n ingress -l app.kubernetes.io/name=traefik -f
```

### Traefik Dashboard

The dashboard is deployed as a Traefik-native `IngressRoute` (not a standard Kubernetes `Ingress`), protected by BasicAuth middleware and a cert-manager `Certificate`.

**1. Create the BasicAuth secret (once):**

```bash
DASHBOARD_PASSWORD=<your-password> make deploy-dashboard-secret

# Or manually:
kubectl create secret generic traefik-dashboard-auth \
  --from-literal=users="$(htpasswd -nb admin <YOUR_PASSWORD>)" \
  -n ingress \
  --dry-run=client -o yaml | kubectl apply -f -
```

**2. Apply the IngressRoute resources:**

```yaml
# kubernetes/ingress/traefik-dashboard.yaml
---
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: dashboard-basicauth
  namespace: ingress
spec:
  basicAuth:
    secret: traefik-dashboard-auth
    removeHeader: true
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: traefik-dashboard
  namespace: ingress
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`dashboard.example.com`) && (PathPrefix(`/dashboard`) || PathPrefix(`/api`))
      kind: Rule
      middlewares:
        - name: dashboard-basicauth
          namespace: ingress
      services:
        - name: api@internal
          kind: TraefikService
  tls:
    secretName: traefik-dashboard-tls
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: traefik-dashboard-tls
  namespace: ingress
spec:
  secretName: traefik-dashboard-tls
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  dnsNames:
    - dashboard.example.com
```

```bash
kubectl apply -f kubernetes/ingress/traefik-dashboard.yaml
```

> Dashboard is accessible at `https://dashboard.<DOMAIN>` — credentials: `admin` / `<DASHBOARD_PASSWORD>`

---

## 3. TLS — cert-manager

cert-manager is deployed via Helm and provisions TLS certificates from **Let's Encrypt** using the **HTTP-01 ACME challenge** via Traefik.

### Install

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update jetstack

helm upgrade --install cert-manager jetstack/cert-manager \
  --version v1.17.1 \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true \
  --wait
```

### ClusterIssuers

Two issuers are configured — staging (for testing) and production (trusted certificates):

```yaml
# kubernetes/cert-manager/clusterissuer.yaml
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: you@example.com
    privateKeySecretRef:
      name: letsencrypt-staging-account-key
    solvers:
      - http01:
          ingress:
            ingressClassName: traefik
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: you@example.com
    privateKeySecretRef:
      name: letsencrypt-production-account-key
    solvers:
      - http01:
          ingress:
            ingressClassName: traefik
```

```bash
kubectl apply -f kubernetes/cert-manager/clusterissuer.yaml
```

### Certificate Issuance Flow

1. Ingress resource references `cert-manager.io/cluster-issuer: letsencrypt-production`
2. cert-manager creates a `CertificateRequest` and an HTTP-01 challenge pod/ingress
3. Let's Encrypt hits `http://<domain>/.well-known/acme-challenge/<token>` via Traefik
4. cert-manager validates the response, Let's Encrypt issues the certificate
5. cert-manager stores the certificate in the referenced `Secret`
6. Traefik reads the Secret and serves HTTPS

### Verify cert-manager

```bash
# Check pods
kubectl get pods -n cert-manager

# Check ClusterIssuers
kubectl get clusterissuer

# Check a certificate status
kubectl get certificate -A
kubectl describe certificate <name> -n apps

# Check certificate requests
kubectl get certificaterequest -A
```

### Test with Staging First

Use `letsencrypt-staging` initially to avoid Let's Encrypt rate limits:

```yaml
annotations:
  cert-manager.io/cluster-issuer: letsencrypt-staging
```

Once confirmed working, switch to:

```yaml
annotations:
  cert-manager.io/cluster-issuer: letsencrypt-production
```

Then delete the staging secret to trigger re-issuance:

```bash
kubectl delete secret <tls-secret-name> -n apps
```

---

## Networking Checklist

- k3s master installed with `--flannel-backend=vxlan`
- UDP port 8472 open between master and worker
- Traefik deployed and showing an `EXTERNAL-IP`
- Ports 80 and 443 open on the worker VPS
- cert-manager deployed and `ClusterIssuer` is `Ready`
- DNS A record for your domain points to the worker IP
- Test certificate issued (staging) before switching to production
