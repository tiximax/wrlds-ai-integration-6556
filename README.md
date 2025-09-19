# Welcome to your Lovable project

[![CI](https://github.com/tiximax/wrlds-ai-integration-6556/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/tiximax/wrlds-ai-integration-6556/actions/workflows/ci.yml) [![E2E Preview](https://github.com/tiximax/wrlds-ai-integration-6556/actions/workflows/e2e-preview.yml/badge.svg)](https://github.com/tiximax/wrlds-ai-integration-6556/actions/workflows/e2e-preview.yml)

## Project info

**URL**: https://lovable.dev/projects/ec1d4f1e-2506-4da5-a91b-34afa90cceb6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ec1d4f1e-2506-4da5-a91b-34afa90cceb6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

See docs/DEPLOY.md for step-by-step deploy and remote E2E verification.

GitHub Actions (Vercel deploy + E2E)
- Workflow: `.github/workflows/deploy-vercel.yml`
- Secrets required (repo settings > Actions secrets):
  - VERCEL_TOKEN
  - VERCEL_ORG_ID
  - VERCEL_PROJECT_ID
- Trigger: push to main hoặc workflow_dispatch (có thể chọn chạy E2E sau deploy)

You can deploy to Vercel or Netlify. This project includes serverless endpoints for newsletter subscribe on both platforms, and SPA fallback for Netlify.

- Vercel
  - Endpoint: `api/subscribe.ts` (deployed at `/api/subscribe`)
  - Steps:
    1. npm i && npm run build
    2. vercel (or connect repo to Vercel and deploy)
    3. Optional: set environment variables like `SUBSCRIBE_API_KEY` at Vercel project settings

- Netlify
  - Endpoint: `netlify/functions/subscribe.ts` with redirect in `netlify.toml`
  - SPA fallback: `/* -> /index.html` is already configured in `netlify.toml`
  - Steps:
    1. npm i && npm run build
    2. netlify deploy --build (or connect repo to Netlify and deploy)
    3. Optional: set environment variables in Netlify site settings

Local E2E (smoke) before/after deploy
- Dev: `npm run test:e2e -- tests/working-cart.spec.ts --reporter=line`
- Preview (build + preview): `npm run test:e2e:preview -- tests/working-cart.spec.ts --reporter=line`

### CI usage
- CI auto-runs on push/PR: unit tests (Vitest) + E2E dev (Playwright) via `.github/workflows/ci.yml`.
- E2E preview workflow: `.github/workflows/e2e-preview.yml`.
  - Kích hoạt thủ công (Actions > E2E Preview > Run workflow), hoặc
  - Trong PR, thêm nhãn `run-e2e-preview` để chạy tự động.
- E2E remote workflow: `.github/workflows/e2e-remote.yml` (workflow_dispatch, nhập BASE_URL để test môi trường đã deploy)
- Scripts tiện dụng:
  - PowerShell: `./scripts/e2e-remote.ps1 -BaseUrl https://your-domain`
  - Bash: `bash ./scripts/e2e-remote.sh https://your-domain`

## I want to use a custom domain - is that possible?

Yes, both Vercel and Netlify support custom domains. Follow the respective provider docs to configure your domain and DNS records.
