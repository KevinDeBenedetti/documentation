# Docker

*Containerize applications for consistent development and deployment.*

## Overview

[Docker](https://www.docker.com/) packages applications into containers — lightweight, standalone environments that include everything needed to run.

## Key Concepts

- **Image**: A read-only template with instructions for creating a container
- **Container**: A runnable instance of an image
- **Dockerfile**: Instructions to build an image
- **Compose**: Define multi-container applications

## Dockerfile

A basic multi-stage Dockerfile for a Next.js application:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

## Docker Compose

Orchestrate multiple services:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Useful Commands

### Display

```bash
# Display running containers
docker ps
# Display stopped containers
docker ps -a
# Display images
docker images
# Access the terminal of a running container
docker exec -it <container_name> sh
```

### Build and Run

```bash
# Build an image
docker build -t myapp .
# Run a container
docker run -p 3000:3000 myapp
# Run a named container on a port
docker run --name <container_name> -p 3000:3000 <image_name>
```

### Save and Load

```bash
# Create a backup of a container
docker save -o <save_name>.tar <image_name>
# Load an image from a .tar file
docker load --input <file_name>.tar
```

### Remove

```bash
# Remove a stopped container by ID
docker rm <container_id>
# Remove all stopped containers
docker rm $(docker ps -a -q)
# Remove unused image by ID
docker rmi <image_id>
# Remove all unused images (not associated with a container)
docker image prune
# Remove unused volumes
docker volume prune
# Remove unused networks
docker network prune
```

### Clean Up

```bash
# Remove all unused objects (containers, images, volumes and networks)
docker system prune
# Remove all unused objects, including running containers
docker system prune -a
# Complete cleanup
docker system prune --volumes -a
```

### Docker Compose

```bash
docker compose up -d      # Start in background
docker compose down        # Stop all services
docker compose logs -f     # Follow logs
```

## Network

Docker provides a lightweight networking system to connect containers. User-defined networks provide internal DNS allowing containers to resolve each other by name.

Main drivers:

- **bridge**: default network for containers on the same host
- **host**: removes network isolation, shares the host's network stack
- **overlay**: communication between services across multiple hosts (Swarm, Kubernetes)
- **macvlan**: assigns MAC/IP addresses to containers on the physical network
- **none**: no network interface (complete isolation)

```bash
# Create a Docker network
docker network create --subnet 172.20.0.0/16 <network_name>
# Display networks
docker network ls
# Display network details
docker network inspect <network_name>
# Connect a container to a network with a specific IP
docker network connect --ip 172.20.0.5 <network_name> <container_name>
```

## Stack

Docker Stack deploys multi-container applications on a Docker Swarm cluster, defined by a YAML file (similar to Docker Compose).

```bash
# List services in a stack
docker stack services <stack_name>
# Display service logs (add -f for real-time)
docker service logs <stack_name_service>
# Remove a stack
docker stack rm <stack_name>
```

## Best Practices

1. **Use multi-stage builds** to minimize image size
2. **Use `.dockerignore`** to exclude unnecessary files
3. **Don't run as root** — use `USER node`
4. **Pin image versions** instead of using `latest`
5. **Use health checks** for production containers

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
