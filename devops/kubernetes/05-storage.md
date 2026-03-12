# Storage — Persistent Volumes with local-path

> Using the local-path-provisioner bundled with k3s to provide dynamic persistent storage.

## Overview

k3s ships with [rancher/local-path-provisioner](https://github.com/rancher/local-path-provisioner) as its default storage provider. It dynamically creates host-path-based `PersistentVolumes` on the node where the pod is scheduled.

| StorageClass | Provisioner             | Reclaim Policy | Binding              |
| ------------ | ----------------------- | -------------- | -------------------- |
| `local-path` | `rancher.io/local-path` | Delete         | WaitForFirstConsumer |

> **Note:** `local-path` volumes are node-local. If the pod is rescheduled to a different node, it **cannot** access the original data. It is suitable for development, testing, or stateful apps pinned to a node (e.g., a database that never needs to migrate).

## Verify the StorageClass

```bash
kubectl get storageclass
# NAME                   PROVISIONER             ...
# local-path (default)   rancher.io/local-path   ...
```

## Creating a PersistentVolumeClaim

```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-app-data
  namespace: apps
spec:
  storageClassName: local-path
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

```bash
kubectl apply -f pvc.yaml

# Should be Pending until a pod consumes it (WaitForFirstConsumer)
kubectl get pvc -n apps
```

## Using a PVC in a Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: apps
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      # Pin to the worker node to ensure the volume is always available
      nodeSelector:
        node-role: worker
      containers:
        - name: my-app
          image: my-image:latest
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: my-app-data
```

> **Important:** Because `local-path` volumes are node-local, add a `nodeSelector` to pin the pod to the same node. This prevents the pod from being rescheduled to a node where the volume does not exist.

## Verify PVC Binding

```bash
# After the pod is created, the PVC should transition to Bound
kubectl get pvc -n apps
# NAME           STATUS   VOLUME                                     CAPACITY   ...
# my-app-data    Bound    pvc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   1Gi        ...

# Check PV details
kubectl get pv
kubectl describe pv <pv-name>
# The node affinity and HostPath will show where data is stored
```

## Data Location on the Node

By default, local-path stores data at:

```
/var/lib/rancher/k3s/storage/<pvc-name>/
```

On **VPS2** (worker):

```bash
ls /var/lib/rancher/k3s/storage/
```

## Common Use Cases

### PostgreSQL

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
  namespace: apps
spec:
  storageClassName: local-path
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: apps
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      nodeSelector:
        node-role: worker
      containers:
        - name: postgres
          image: postgres:16-alpine
          env:
            - name: POSTGRES_DB
              value: mydb
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: username
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: postgres-data
```

### Redis

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-data
  namespace: apps
spec:
  storageClassName: local-path
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: apps
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      nodeSelector:
        node-role: worker
      containers:
        - name: redis
          image: redis:7-alpine
          command: ["redis-server", "--appendonly", "yes"]
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: redis-data
```

## Secrets for Database Credentials

Never put credentials in plain environment variables. Use Kubernetes Secrets:

```bash
# Create the secret imperatively
kubectl create secret generic postgres-secret \
  --from-literal=username=myuser \
  --from-literal=password=supersecret \
  --namespace apps
```

Or declaratively (base64-encoded values):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: apps
type: Opaque
data:
  username: bXl1c2Vy          # echo -n 'myuser' | base64
  password: c3VwZXJzZWNyZXQ=  # echo -n 'supersecret' | base64
```

## Limitations of local-path

| Limitation           | Impact                               |
| -------------------- | ------------------------------------ |
| Node-local           | Data is lost if the node is replaced |
| No replication       | Single point of failure              |
| No snapshots         | Manual backups required              |
| `ReadWriteOnce` only | One pod can mount a PVC at a time    |

For production workloads requiring HA storage, consider:

- [Longhorn](https://longhorn.io) — distributed block storage for k3s
- [Rook/Ceph](https://rook.io) — more complex, full-featured
- Managed cloud NFS (e.g., Hetzner Storage Boxes)

## Backup Strategy (local-path)

Since volumes are plain directories on the node, back them up with standard tools:

```bash
# On VPS2 (worker):
tar -czf /tmp/postgres-backup-$(date +%Y%m%d).tar.gz \
  /var/lib/rancher/k3s/storage/<pvc-name>

# Transfer to a safe location
scp kevin@<WORKER_IP>:/tmp/postgres-backup-*.tar.gz ./backups/
```

## Useful Commands

```bash
# List all PVCs
kubectl get pvc -A

# List all PVs
kubectl get pv

# Inspect a PVC
kubectl describe pvc <name> -n apps

# Delete a PVC (and its PV if Reclaim Policy is Delete)
kubectl delete pvc <name> -n apps

# Force-delete a stuck PVC
kubectl patch pvc <name> -n apps -p '{"metadata":{"finalizers":null}}'
```
