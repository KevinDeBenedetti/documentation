# GitHub

*Practical guide to GitHub, GHCR and GitHub Actions for deploying applications.*

## GHCR

GitHub Container Registry (GHCR) is a container registry service that allows you to store and manage Docker images and OCI artifacts directly in GitHub.

### 1. Generate a Personal Access Token (PAT)

Go to [GitHub](https://github.com/settings/tokens/new) and generate a PAT with `repo` and `packages` permissions.

Log in to GitHub, go to **Settings** then **Developer settings**. Under **Personal access tokens**, choose **Tokens (classic)** and generate a new token with the selected permissions.

### 2. Log in to GHCR with Docker

```shell
echo "<TOKEN>" | docker login ghcr.io -u <USERNAME> --password-stdin
```

### 3. Pull and run an image

```shell
docker pull ghcr.io/<USERNAME>/<IMAGE_NAME>
docker run -d -p <HOST_PORT>:<CONTAINER_PORT> ghcr.io/<USERNAME>/<IMAGE_NAME>
```

### 4. Log out of GHCR

```shell
docker logout ghcr.io
```

## GitHub Actions

We will use GitHub Actions with GHCR to build and push our images.

Create the `.github/workflows/` folders at the root of the project.

## Workflows

To build and push Docker images we will use GHCR. For SSH deployment, we will use the GitHub Actions utility [appleboy](https://github.com/appleboy/ssh-action).

### GHCR Workflow

```yaml
# .github/workflows/ghcr.yaml
name: GitHub Container Registry

on:
  push:
    branches:
      - main

jobs:
  ghcr:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      attestations: write
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set lowercase repository owner
        run: echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV

      - name: Build and push Docker image
        run: |
          docker build -t ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest ./<APP_CODE>
          docker push ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest

      - name: Logout from GHCR
        run: docker logout ghcr.io
```

### Deploy Workflow

```yaml
# .github/workflows/deploy.yaml
deploy:
  needs: [ghcr]
  runs-on: ubuntu-latest
  steps:
    - name: Deploy using ssh
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        port: ${{ secrets.SSH_PORT }}
        script: |
          echo ${{ secrets.GHCR_PAT }} | docker login ghcr.io -u ${{ github.REPOSITORY_OWNER }} --password-stdin
          docker pull ghcr.io/${{ env.REPO_OWNER }}/<TAG_NAME>:latest
          docker compose -f compose.prod.yaml up -d
          docker logout ghcr.io
```

### Configure on the VPS

#### Create a `compose.prod.yaml` file

```yaml
# compose.prod.yaml
services:
  app:
    image: ghcr.io/<REPO_OWNER>/<TAG_NAME>:latest
    ports:
      - "XXXX:XXXX"
```

## Resources

- [GitHub Docs — Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Medium — Automate Docker Image Deployment](https://medium.com/@ajay-er/automate-docker-image-deployment-to-ghcr-with-github-actions-97bb9a318d7c)
- [Programonaut — Deploy a Docker Image](https://www.programonaut.com/how-to-deploy-a-docker-image-to-a-server-using-github-actions/)
