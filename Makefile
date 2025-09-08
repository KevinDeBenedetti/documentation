PYTHONPATH=$(PWD)

.PHONY: help setup apps start dev build clean
.DEFAULT_GOAL := help

help: ## Show helper
	@echo "Usage: make <command>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'

lint: ## Lint Code
	@echo "Linting code..."
	cd apps/client && pnpm lint:fix

clean: ## Clean build files and dependencies
	@echo "Cleaning dev environment..."
	docker compose down
	rm -rf apps/client/docs/.vitepress/cache apps/client/docs/.vitepress/dist apps/client/node_modules
	rm -rf apps/server/.ruff_cache apps/server/.venv

setup-client: ## Install dependencies for the apps
	@echo "Setup frontend..."
	cd apps/client && pnpm install

setup-server: ## Start the development server
	@echo "Setup api..."
		cd apps/server && \
		uv venv --clear && \
		source .venv/bin/activate && \
		uv sync --no-cache && \
		uv cache clean

start: clean setup-client setup-server ## Start the development environment
	@echo "Start dev environment (no upgrade)..."
	docker compose up -d

upgrade: clean setup-client setup-server ## Upgrade Nuxt
	@echo "Upgrade client..."
	cd apps/client && pnpm upgrade
	@echo "Upgrade server..."
	cd apps/server && uv run python upgrade_pyproject.py
