# saba-template

A boilerplate repository template for standalone Azure web applications with a React frontend, Express backend, Cosmos DB database, and full CI/CD pipeline with PR preview environments.

## Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + TypeScript
- **Database**: Azure Cosmos DB (NoSQL API)
- **Infrastructure**: Azure Bicep
- **CI/CD**: GitHub Actions

## Features

- Basic user-facing UI
- Admin panel with role-based authentication (JWT)
- Cosmos DB integration
- Azure App Service deployment
- PR preview environments (ephemeral resource groups)
- Monorepo with npm workspaces

## Getting Started

### Prerequisites

- Node.js 20+
- Azure CLI
- Azure subscription

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Cosmos DB credentials and JWT secret

# Run backend (port 3001)
npm run dev:backend

# Run frontend (port 5173)
npm run dev:frontend
```

### Build

```bash
npm run build
```

### Deploy

Production deploys automatically on push to `main`. For manual deployment:

```bash
az deployment sub create \
  --location eastus \
  --template-file infra/main.bicep \
  --parameters infra/parameters/prod.bicepparam
```

## Project Structure

```
packages/
  frontend/    # React + Vite app
  backend/     # Express API server
infra/         # Bicep infrastructure-as-code
.github/       # GitHub Actions workflows
```

## CI/CD

| Workflow | Trigger | Action |
|----------|---------|--------|
| ci.yml | Push/PR to any branch | Lint, typecheck, test, build |
| deploy.yml | Push to main | Deploy to production |
| preview.yml | PR open/sync/close | Create/update/destroy preview environment |

## Preview Environments

Every pull request gets its own isolated Azure environment:
- Dedicated resource group (`rg-preview-pr-{number}`)
- Own Cosmos DB instance and App Service
- Preview URL posted as a PR comment
- Automatically torn down when the PR is closed or merged

## License

MIT
