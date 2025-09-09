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
	pnpm lint:fix

clean: ## Clean build files and dependencies
	@echo "Cleaning dev environment..."
	docker compose down
	rm -rf docs/.vitepress/cache docs/.vitepress/dist node_modules

setup-client: ## Install dependencies for the apps
	@echo "Setup frontend..."
	pnpm install

start: clean setup-client ## Start the development environment
	@echo "Start dev environment (no upgrade)..."
	docker compose up -d

upgrade: clean setup-client ## Upgrade Nuxt
	@echo "Upgrade client..."
	pnpm upgrade
