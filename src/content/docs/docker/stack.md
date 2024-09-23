---
title: Docker Stack
lastUpdated: 2024-09-23
description: Un guide pour démarrer avec docker stack.
sidebar:
    order: 8
    label: Stack
---

## Commandes

### Lister les services d'une stack

```bash title="Afficher les services d'une stack"
docker stack services <stack_name>
```

### Consulter les logs

```bash title="Afficher les logs"
docker service logs <stack_name_service>
```

```bash title="Afficher les logs en temps réel"
docker service logs -f <stack_name_service>
```

### Supprimer

```bash title="Supprimer une stack"
docker stack rm <stack_name>
```
