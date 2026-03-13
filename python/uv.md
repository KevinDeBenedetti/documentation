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

## VS Code With Many Repos: Isolate Environments Properly

If one repo's `.venv` appears in another repo, it is usually because the same terminal shell is still active.
Virtual environment activation is shell state, not repository state.

### Why It Happens

- `source .venv/bin/activate` only affects the current shell process
- VS Code terminals are persistent tabs
- If you `cd` to another repo in that same tab, the old env remains active

### Recommended Setup (Per Repo)

```sh
# from each project root
uv venv --python 3.12
```

Create `.vscode/settings.json` in each Python repo:

```json
{
	"python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python"
}
```

Notes:

- Set this at repository level, not global user settings
- In multi-root workspaces, keep this setting inside each folder

### Daily Workflow

Prefer project commands through uv to avoid cross-repo shell pollution:

```sh
uv run python -V
uv run pytest
```

If you manually activate an env:

```sh
source .venv/bin/activate
# ...work...
deactivate
```

Quick checks when switching repos:

```sh
echo "$VIRTUAL_ENV"
which python
```

### Optional: Auto Activate/Deactivate With direnv

Add `.envrc` in each project:

```sh
source .venv/bin/activate
```

Then allow it once per repo:

```sh
direnv allow .
```

`direnv` will load env vars on directory enter and unload them on exit, which is ideal for many repositories.

## Resources

- [Official UV Documentation](https://github.com/astral-sh/uv)
- [Astral Blog](https://astral.sh/blog)
- [VS Code Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
- [direnv](https://direnv.net/)
