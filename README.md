# Documentation Repository

> Monorepo: VitePress documentation + FastAPI markdown translation service

## 🚀 Quick Start

```bash
# Using Docker Compose
docker compose up -d

# Or using Makefile
make start
```

## 🛠️ Makefile Commands

```bash
make help          # Show all available commands
make start          # Clean, setup and start dev environment
make setup-client   # Install frontend dependencies
make setup-server   # Setup Python environment
make lint           # Lint and fix code
make upgrade        # Upgrade all dependencies
make clean          # Clean build files and dependencies
```

## 📁 Structure

```
apps/
├── client/     # VitePress documentation site
└── server/     # FastAPI translation service
```