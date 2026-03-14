# Notes

Personal reference notes for development tools and workflows, published as a static site via [VitePress](https://vitepress.dev).

[![📚 View Documentation](https://img.shields.io/badge/📚%20View%20Documentation-kevindebenedetti.github.io%2Fnotes-blue?style=for-the-badge)](https://kevindebenedetti.github.io/notes/)

## Topics

| Category | Topics |
|---|---|
| **DevOps** | Docker, Git, GitHub, Hosting, Firewall, Kubernetes |
| **JavaScript** | Next.js, Nuxt, Vue |
| **Linux** | Caddy, Debian, Ubuntu, SSH, UFW, Fail2ban, Tree |
| **Python** | FastAPI, Ruff, uv |

## CI/CD

On every push to `main` that touches `docs/**`, a GitHub Actions workflow dispatches a rebuild of the [notes site](https://kevindebenedetti.github.io/notes/).
