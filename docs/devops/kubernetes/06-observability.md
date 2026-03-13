# Observability — Prometheus, Grafana, Alertmanager

> Deploy the **kube-prometheus-stack** into the `monitoring` namespace to monitor your k3s cluster.

## Overview

The [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm chart bundles:

| Component               | Role                                            |
| ----------------------- | ----------------------------------------------- |
| **Prometheus**          | Metrics collection & time-series database       |
| **Grafana**             | Dashboards & visualization                      |
| **Alertmanager**        | Alert routing (email, Slack, PagerDuty, etc.)   |
| **Prometheus Operator** | Manages Prometheus via `ServiceMonitor` CRDs    |
| **kube-state-metrics**  | Kubernetes object metrics (pods, nodes, etc.)   |
| **node-exporter**       | Host-level metrics (CPU, memory, disk, network) |

The `monitoring` namespace is already declared in `kubernetes/namespaces/namespaces.yaml`.

---

## Prerequisites

- Cluster fully operational with `make nodes` showing both nodes `Ready`
- `helm` available locally
- `kubectl` connected to `k3s-infra` context

---

## Step 1 — Add the Helm Repository

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update prometheus-community
```

---

## Step 2 — Create the Values File

Create `kubernetes/monitoring/kube-prometheus-stack-values.yaml`:

```yaml
# kubernetes/monitoring/kube-prometheus-stack-values.yaml
# ---
# kube-prometheus-stack — production values for k3s (2-node cluster)
# Traefik IngressRoutes are defined separately for TLS via cert-manager.

grafana:
  adminPassword: "change-me"       # override with a Secret or DASHBOARD_PASSWORD

  persistence:
    enabled: true
    storageClassName: local-path
    size: 5Gi

  # Ingress managed separately via IngressRoute (see step 4)
  ingress:
    enabled: false

  resources:
    requests:
      cpu: "100m"
      memory: "128Mi"
    limits:
      cpu: "500m"
      memory: "256Mi"

prometheus:
  prometheusSpec:
    retention: 15d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: local-path
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi

    # Discover ServiceMonitors from all namespaces
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false

    resources:
      requests:
        cpu: "200m"
        memory: "512Mi"
      limits:
        cpu: "1000m"
        memory: "1Gi"

alertmanager:
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: local-path
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 2Gi

  # Configure receivers in Step 5
  config:
    global:
      resolve_timeout: 5m
    route:
      group_by: ["alertname", "namespace"]
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 12h
      receiver: "null"
    receivers:
      - name: "null"

# Pin to worker node (where storage will be provisioned)
nodeSelector:
  node-role: worker

# node-exporter must run on ALL nodes — so no global nodeSelector for it
prometheus-node-exporter:
  tolerations:
    - operator: Exists
```

---

## Step 3 — Install the Stack

```bash
helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --version 68.x.x \           # pin to a specific version
  --namespace monitoring \
  --create-namespace \
  --values kubernetes/monitoring/kube-prometheus-stack-values.yaml \
  --wait \
  --timeout 300s
```

> Check the latest version: `helm search repo prometheus-community/kube-prometheus-stack`

Verify:

```bash
kubectl get pods -n monitoring
# All pods should reach Running state within 2–3 minutes.
```

---

## Step 4 — Expose Grafana via IngressRoute

Create `kubernetes/monitoring/grafana-ingress.yaml`:

```yaml
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: grafana
  namespace: monitoring
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`grafana.example.com`)
      kind: Rule
      services:
        - name: kube-prometheus-stack-grafana
          port: 80
  tls:
    secretName: grafana-tls
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: grafana-tls
  namespace: monitoring
spec:
  secretName: grafana-tls
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  dnsNames:
    - grafana.example.com
```

```bash
kubectl apply -f kubernetes/monitoring/grafana-ingress.yaml
```

> Access at `https://grafana.<DOMAIN>` — default credentials: `admin` / `change-me`

---

## Step 5 — Alertmanager Notifications (optional)

Update the `alertmanager.config` section in the values file with your notification channel:

### Slack

```yaml
alertmanager:
  config:
    global:
      resolve_timeout: 5m
      slack_api_url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
    route:
      receiver: "slack"
      group_by: ["alertname", "namespace"]
    receivers:
      - name: "slack"
        slack_configs:
          - channel: "#alerts"
            title: "{{ .GroupLabels.alertname }}"
            text: "{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}"
            send_resolved: true
```

Apply the change:

```bash
helm upgrade kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values kubernetes/monitoring/kube-prometheus-stack-values.yaml \
  --reuse-values
```

---

## Step 6 — Monitor Your Applications (ServiceMonitor)

Expose metrics from your app and create a `ServiceMonitor` so Prometheus scrapes them:

```yaml
# kubernetes/apps/service-monitor.yaml
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app
  namespace: apps
  labels:
    release: kube-prometheus-stack   # must match the Helm release name
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
    - port: metrics          # the named port exposing /metrics
      interval: 30s
      path: /metrics
```

---

## Useful Commands

```bash
# Check all monitoring pods
kubectl get pods -n monitoring

# Prometheus UI (port-forward)
kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
# Open http://localhost:9090

# Grafana UI (port-forward)
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
# Open http://localhost:3000

# Alertmanager UI (port-forward)
kubectl port-forward -n monitoring svc/kube-prometheus-stack-alertmanager 9093:9093
# Open http://localhost:9093

# Check PVCs (Prometheus + Grafana)
kubectl get pvc -n monitoring

# View Prometheus targets
kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
# http://localhost:9090/targets

# Upgrade the stack
helm upgrade kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values kubernetes/monitoring/kube-prometheus-stack-values.yaml

# Uninstall (DESTRUCTIVE — also removes CRDs if --cascade)
helm uninstall kube-prometheus-stack -n monitoring
```

---

## Recommended Grafana Dashboards

Import these by ID in Grafana → Dashboards → Import:

| Dashboard                   | ID      |
| --------------------------- | ------- |
| Kubernetes cluster overview | `315`   |
| Node Exporter Full          | `1860`  |
| Traefik                     | `17346` |
| cert-manager                | `20842` |
| k3s cluster monitoring      | `16450` |

---

## Next Steps

- See [ROADMAP.md](ROADMAP.md) for the full journey including Vault and GitOps
- See [troubleshooting.md](troubleshooting.md) for common issues
