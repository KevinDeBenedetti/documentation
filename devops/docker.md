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

```bash
# Build an image
docker build -t myapp .

# Run a container
docker run -p 3000:3000 myapp

# Docker Compose
docker compose up -d      # Start in background
docker compose down        # Stop all services
docker compose logs -f     # Follow logs

# Cleanup
docker system prune -af    # Remove unused resources
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
