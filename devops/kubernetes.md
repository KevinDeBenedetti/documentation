# Kubernetes

*Practical guide to Kubernetes commands and configuration for deploying applications.*

## Overview

[Kubernetes](https://kubernetes.io/) (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.

## Key Concepts

- **Pod**: Smallest deployable unit, one or more containers
- **Service**: Stable network endpoint for a set of Pods
- **Deployment**: Manages ReplicaSets and rolling updates
- **Namespace**: Virtual cluster for resource isolation
- **ConfigMap / Secret**: Configuration and sensitive data management

## Basic Commands

```bash
# View cluster info
kubectl cluster-info

# List all pods
kubectl get pods

# List all services
kubectl get services

# List all deployments
kubectl get deployments

# Describe a resource
kubectl describe pod <pod_name>

# View logs
kubectl logs <pod_name>

# Execute a command in a pod
kubectl exec -it <pod_name> -- /bin/sh
```

## Deployment Example

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: ghcr.io/user/my-app:latest
          ports:
            - containerPort: 3000
```

## Service Example

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
