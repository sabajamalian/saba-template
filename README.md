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

## Azure Secrets Configuration

The GitHub Actions workflows authenticate to Azure using OpenID Connect (OIDC) with a federated credential. You need to configure three repository secrets:

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | The Application (client) ID of your Azure AD app registration |
| `AZURE_TENANT_ID` | Your Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | The Azure subscription where resources will be deployed |

### Step-by-Step: Obtaining the Secrets

#### 1. Create an Azure AD App Registration

```bash
# Log in to Azure
az login

# Create an app registration
az ad app create --display-name "saba-template-github-actions"
```

Note the `appId` from the output; this is your `AZURE_CLIENT_ID`.

#### 2. Create a Service Principal

```bash
az ad sp create --id <AZURE_CLIENT_ID>
```

#### 3. Assign Roles to the Service Principal

Grant it Contributor access on your subscription so it can create resource groups and resources:

```bash
az role assignment create \
  --assignee <AZURE_CLIENT_ID> \
  --role Contributor \
  --scope /subscriptions/<AZURE_SUBSCRIPTION_ID>
```

#### 4. Configure Federated Credentials (OIDC)

This allows GitHub Actions to authenticate without storing long-lived secrets. Create one federated credential for the `main` branch (production deploys) and one for pull requests (preview environments):

```bash
# Get the app's object ID (not the same as appId/clientId)
APP_OBJECT_ID=$(az ad app show --id <AZURE_CLIENT_ID> --query id -o tsv)

# Federated credential for main branch deployments
az ad app federated-credential create --id $APP_OBJECT_ID --parameters '{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:<YOUR_GITHUB_USERNAME>/saba-template:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}'

# Federated credential for pull request previews
az ad app federated-credential create --id $APP_OBJECT_ID --parameters '{
  "name": "github-pr",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:<YOUR_GITHUB_USERNAME>/saba-template:pull_request",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username (e.g., `sabajamalian`).

#### 5. Find Your Tenant ID and Subscription ID

```bash
# Tenant ID
az account show --query tenantId -o tsv

# Subscription ID
az account show --query id -o tsv
```

#### 6. Add Secrets to GitHub

Go to your repository Settings, then Secrets and variables, then Actions, and add:

- `AZURE_CLIENT_ID` - the appId from step 1
- `AZURE_TENANT_ID` - from step 5
- `AZURE_SUBSCRIPTION_ID` - from step 5

Alternatively, use the GitHub CLI:

```bash
gh secret set AZURE_CLIENT_ID --body "<your-client-id>"
gh secret set AZURE_TENANT_ID --body "<your-tenant-id>"
gh secret set AZURE_SUBSCRIPTION_ID --body "<your-subscription-id>"
```

### Why OIDC Instead of Client Secrets?

This template uses OIDC federated credentials rather than traditional client secrets because:

- **No secret rotation required**: Federated credentials never expire
- **Least privilege**: Tokens are scoped to specific branches and PR contexts
- **No stored secrets to leak**: GitHub Actions receives short-lived tokens at runtime

## Marking as a Template Repository

To use this as a GitHub template:

1. Go to the repository on GitHub
2. Click Settings
3. Under "General", check "Template repository"
4. New projects can then click "Use this template" to create a copy

## License

MIT
