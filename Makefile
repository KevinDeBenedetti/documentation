PYTHONPATH=$(PWD)

.PHONY: help for datasets generator
.DEFAULT_GOAL := help clean lint dev

help: ## Show helper
	@echo "Usage: make <command>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'

clean: ## Clean project
	@echo "Removing all..."
	@find . -type f -name "pnpm-lock.yaml" -prune -print -exec rm -rf {} +
	@find . -type d -name "node_modules" -prune -print -exec rm -rf {} +

	@echo "Client cleaning..."
	pnpm store prune

lint:  ## Run linting
	@echo "Client linting..."
	pnpm lint && \
	pnpm format

husky: ## Setup husky git hooks
	@echo "Setting up husky..."
	pnpm install
	chmod +x .husky/pre-commit

setup: ## Initialize
	@echo "Initializing..."
	pnpm install

update: setup ## Upgrade client dependencies
	@echo "Upgrading client dependencies..."
	pnpm up --latest

dev: clean husky setup ## Start the Nuxt Docus development server
	@echo "Starting Nuxt Docus development server..."
	pnpm run dev

build: setup ## Build the Nuxt Docus project
	@echo "Building Nuxt Docus project..."
	pnpm run build