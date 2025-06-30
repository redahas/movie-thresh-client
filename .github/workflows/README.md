# GitHub Actions Workflows

This repository has two GitHub Actions workflows for CI/CD.

## Workflows

### 1. Pull Request Validation (`pr-validation.yml`)
Runs on every pull request to validate code quality before merging.

**Triggers:**
- Pull request opened
- Pull request updated (new commits)
- Pull request reopened

**Steps:**
- Install dependencies
- Run linting (`npm run lint`)
- Run unit tests (`npm run test:run`)
- Check TypeScript types (`npm run build`)
- Comment on PR with validation status

### 2. Deploy to Production (`deploy.yml`)
Runs on pull request merges to main for deployment.

**Triggers:**
- Push to main branch
- Pull request closed (merged) to main

**Steps:**
- Test and build job (linting, tests, build, Sentry upload)
- Deploy job (placeholder for actual deployment)

## Required GitHub Secrets

Set these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

### Sentry Configuration
- `SENTRY_ORG` - Your Sentry organization slug
- `SENTRY_PROJECT` - Your Sentry project name (e.g., "movie-thresh-client")
- `SENTRY_AUTH_TOKEN` - Sentry auth token with `project:write` and `org:read` scopes

### Build Environment Variables
- `VITE_SENTRY_DSN` - Your Sentry DSN for the client
- `VITE_ENVIRONMENT` - Environment name (e.g., "production")

### Deployment Secrets (when ready)
- `VERCEL_TOKEN` - For Vercel deployment
- `NETLIFY_AUTH_TOKEN` - For Netlify deployment
- `AWS_ACCESS_KEY_ID` - For AWS S3 deployment
- `AWS_SECRET_ACCESS_KEY` - For AWS S3 deployment
- `AWS_S3_BUCKET` - S3 bucket name
- `AWS_CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

## Workflow Behavior

### Pull Request Flow:
1. **PR opened/updated** → `pr-validation.yml` runs
2. **Validation passes** → PR can be merged
3. **PR merged to main** → `deploy.yml` runs
4. **Deployment completes** → Production updated

### Branch Protection (Recommended):
Set up branch protection rules in GitHub:
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require pull request reviews before merging

## Customization

To enable actual deployment, uncomment and configure one of the deployment methods in the `deploy.yml` workflow file:

- **Vercel**: Uncomment the Vercel deployment section
- **Netlify**: Uncomment the Netlify deployment section
- **AWS S3**: Uncomment the AWS S3 deployment section
- **Custom**: Replace the placeholder with your deployment commands
