# UV

*Modern manager for Python virtual environments and dependencies.*

[UV](https://github.com/astral-sh/uv) is a lightweight and high-performance tool designed to manage Python virtual environments and project dependencies.

## Why Use UV Instead of pip?

- **Automatic management**: Automatic creation and management of `.venv` environments
- **Deterministic sync**: Eliminates "works on my machine" problems
- **Optimized performance**: Built-in cache and offline mode for faster installs

## Quick Start

```sh
# Initialize a new uv project
uv init --app my-project

# Move into the project
cd my-project

# Add FastAPI as a dependency
uv add fastapi --extra standard

# Run the FastAPI dev server
uv run fastapi dev
```

## Recommended Workflow

### Project Initialization

```sh
# Initialize the project
uv init --app my-project
```

### Environment Configuration

```sh
# Create the environment with Python 3.12
uv venv --python 3.12
```

## Best Practices

- **Lock your versions**: Use `uv lock` and `uv sync` to ensure all team members use the same dependency versions. Always commit the `uv.lock` file.
- **Optimized cache**: UV's local cache speeds up repeated installs and enables offline work. The cache is shared across projects.

## Resources

- [Official UV Documentation](https://github.com/astral-sh/uv)
- [Astral Blog](https://astral.sh/blog)
