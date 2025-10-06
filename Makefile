PYTHONPATH=$(PWD)

.PHONY: help setup apps start dev build clean
.DEFAULT_GOAL := help

help: ## Show helper
	@echo "Usage: make <command>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'

clean: ## Clean build files and dependencies
	@echo "Removing all..."
	@find . -type d -name "node_modules" -prune -print -exec rm -rf {} +
	@find . -type d -name ".nuxt" -prune -print -exec rm -rf {} +
	@find . -type d -name ".output" -prune -print -exec rm -rf {} +

setup: ## Setup docus
	@echo "Setting up docus..."
	pnpm install

start: setup ## Start the development environment
	@echo "Start docus..."
	pnpm run dev

upgrade: clean setup ## Upgrade api dependencies
	pnpm up --latest

lint: ## Lint code
	@echo "Linting code..."

