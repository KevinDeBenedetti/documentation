# Notes

Personal reference notes for development tools and workflows, published as a static site via [VitePress](https://vitepress.dev).

## Contents

- **DevOps** — Docker, Git, GitHub, Hosting, Firewall
  - **Kubernetes** — Prerequisites, kubeadm setup, networking, worker join, storage, observability, architecture, troubleshooting
- **JavaScript** — Next.js, Nuxt, Vue
- **Linux** — Caddy, Debian, Ubuntu, SSH, UFW, Fail2ban, Tree
- **Python** — FastAPI, Ruff, uv

## Structure

```
docs/
├── devops/
│   ├── kubernetes/     # Step-by-step Kubernetes guides
│   ├── docker.md
│   ├── git.md
│   ├── github.md
│   ├── hosting.md
│   └── firewall.md
├── javascript/
├── linux/
└── python/
```

## CI/CD

On every push to `main` that touches `docs/**`, a GitHub Actions workflow dispatches a rebuild of the notes site ([kevindebenedetti.github.io](https://github.com/KevinDeBenedetti/kevindebenedetti.github.io)).
