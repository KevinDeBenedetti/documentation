# Tree

*A guide to using the tree command for displaying directory structures.*

## Installing tree

| System / OS                | Installation                         |
| -------------------------- | ------------------------------------ |
| **macOS**                  | `brew install tree`                  |
| **Linux** (Debian, Ubuntu) | `sudo apt-get install tree`          |
| **Linux** (Fedora)         | `sudo yum install tree`              |
| **Windows** (cmd.exe)      | Natively available in Command Prompt |

## Usage Examples

```sh
# Simple tree structure (max depth 3)
tree -L 3

# Including hidden files, excluding patterns
tree -L 3 -a -I 'venv|.git|__pycache__'

# With readable sizes and dates
tree -L 3 -a -h -D -I 'venv|.git|__pycache__'

# Only directories (depth 2)
tree -d -L 2

# Display full paths
tree -f -L 3

# Redirect output to a file
tree -L 4 -a -I 'venv|.git|__pycache__' > tree.txt
```
