# Fast API Integration

FastAPI is a modern, high-performance web framework for building APIs with Python 3.8+ using standard Python type hints. It focuses on fast development, automatic interactive documentation (OpenAPI/Swagger), and high throughput thanks to ASGI and native async support.


## UV

[UV](https://github.com/astral-sh/uv) is a lightweight tool to manage Python virtual environments and project dependencies. It provides a simple CLI to create and manage isolated .venv environments, synchronize dependencies deterministically, run commands inside the environment, and manage a local cache.

We use uv in this project documentation and examples to ensure reproducible development environments and to simplify common workflows.

Why use uv instead of pip alone?
- Automatic creation and management of .venv environments.
- Deterministic sync of dependencies (reduces "works on my machine" issues).
- Built-in caching and offline-friendly behavior for faster installs.
- Unified commands (uv venv, uv sync, uv run, uv cache) that replace multiple manual pip/venv steps.

### Install

```sh
# Initialize a new uv project
uv init --app

# Add FastAPI as a dependency
uv add fastapi --extra standard

# Run the FastAPI development server
uv run fastapi dev
```

### Common Commands

```sh
# Project initialization
uv init                   # Initialize a new project
uv init --app             # Initialize with application structure

# Dependency management
uv add <package>          # Add a dependency
uv add <package> --dev    # Add a development dependency
uv remove <package>       # Remove a dependency
uv sync                   # Sync dependencies from lockfile

# Environment management
uv venv                   # Create a virtual environment
uv venv --python 3.12     # Create with specific Python version

# Running commands
uv run <command>          # Run command in the project environment
uv run python script.py   # Run Python script
uv run fastapi dev        # Run FastAPI development server

# Package information
uv tree                   # Show dependency tree
uv list                   # List installed packages

# Cache management
uv cache clean            # Clear the cache
uv cache dir              # Show cache directory
```

### Configuration

```sh
[project]
name = "my-fastapi-app"
version = "0.1.0"
requires-python = ">=3.8"
dependencies = [
    "fastapi[standard]>=0.100.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "httpx>=0.24.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```


## RUFF

[Ruff](https://github.com/astral-sh/ruff) is an extremely fast Python linter and code formatter, written in Rust. It can replace Flake8, Black, isort, pydocstyle, pyupgrade, autoflake, and more, all while running 10-100x faster than existing tools.
Ruff is particularly well-suited for FastAPI projects as it provides excellent support for modern Python features, type hints, and can catch common API development issues early in the development process.

Why use Ruff ?

- Lightning fast: 10-100x faster than traditional Python linters
- All-in-one: Combines linting, formatting, and import sorting
- Modern Python: Full support for Python 3.8+ features and type hints
- FastAPI friendly: Built-in rules for async/await patterns and Pydantic models
- Easy integration: Works seamlessly with editors, CI/CD, and pre-commit hooks

### Install

```sh
# Add Ruff as a development dependency
uv add --dev ruff

# Or install globally
uv tool install ruff
```

### Basic Usage

```sh
# Lint your code
uv run ruff check .

# Fix auto-fixable issues
uv run ruff check --fix .

# Format your code
uv run ruff format .

# Check and format in one command
uv run ruff check --fix . && uv run ruff format .
```

### Configuration

Create a `ruff.toml` file in your project root or configure in `pyproject.toml`:

```toml
# pyproject.toml
[tool.ruff]
# Python version to target
target-version = "py38"

# Line length to match Black's default
line-length = 88

# Directories to exclude
exclude = [
    ".git",
    ".venv",
    "__pycache__",
    "build",
    "dist",
]

[tool.ruff.lint]
# Enable specific rule sets
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # Pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "UP",  # pyupgrade
    "ARG", # flake8-unused-arguments
    "SIM", # flake8-simplify
    "ICN", # flake8-import-conventions
]

# Disable specific rules
ignore = [
    "E501",  # line too long (handled by formatter)
    "B008",  # do not perform function calls in argument defaults
]

# Allow fix for all enabled rules
fixable = ["ALL"]

# Allow unused variables when underscore-prefixed
dummy-variable-rgx = "^(_+|(_+[a-zA-Z0-9_]*[a-zA-Z0-9]+?))$"

[tool.ruff.lint.per-file-ignores]
# Ignore specific rules in test files
"tests/**/*.py" = [
    "S101",  # use of assert detected
    "ARG",   # unused function args -> fixtures nevertheless are functionally relevant
    "FBT",   # don't care about booleans as positional arguments in tests
]

[tool.ruff.lint.isort]
# Sort imports
split-on-trailing-comma = true
```

### FastAPI-Specific Rules

Ruff includes several rules particularly useful for FastAPI development :

```sh
# Enable FastAPI-specific linting
[tool.ruff.lint]
select = [
    "FAST", # FastAPI-specific rules
    "ASYNC", # async/await best practices
]
```

### VS Code

Install the [Ruff extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) and add to your `settings.json`:

```json
{
    "[python]": {
        "editor.defaultFormatter": "charliermarsh.ruff",
        "editor.codeActionsOnSave": {
            "source.fixAll.ruff": "explicit",
            "source.organizeImports.ruff": "explicit"
        }
    }
}
```

### Pre-commit Hooks

Add to `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

### Common Workflows

```sh
# Complete code quality check
uv run ruff check --fix .
uv run ruff format .

# Check without making changes
uv run ruff check .
uv run ruff format --check .

# Run on specific files
uv run ruff check app/main.py app/models/

# Generate configuration
uv run ruff check --show-settings

# Explain a specific rule
uv run ruff rule F401
```

### CI / CD Integration

```yaml
# GitHub Actions example
name: Code Quality
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v3
      - name: Install dependencies
        run: uv sync --dev
      - name: Lint with Ruff
        run: |
          uv run ruff check .
          uv run ruff format --check .
```
