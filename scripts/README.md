# Scripts

## Sentry Sourcemap Upload

The `upload-sourcemaps.js` script uploads sourcemaps to Sentry for better error tracking and debugging.

### Setup

1. **Get Sentry Auth Token**:
   - Go to Sentry > Settings > Auth Tokens
   - Create a new token with `project:write` and `org:read` scopes

2. **Set Environment Variables**:
   ```bash
   # Required
   SENTRY_ORG=your-organization-slug
   SENTRY_AUTH_TOKEN=your-auth-token-here

   # Optional (defaults to package.json version)
   SENTRY_RELEASE=v1.2.3
   SENTRY_PROJECT=movie-thresh-client
   ```

3. **Add to .env.local**:
   ```bash
   SENTRY_ORG=your-org-slug
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

### Usage

```bash
# Build and upload sourcemaps
npm run build:with-sentry

# Or upload sourcemaps separately
npm run upload-sourcemaps
```

### What it does

1. Validates required environment variables
2. Checks that the build directory exists
3. Creates a new Sentry release
4. Uploads sourcemaps from `./dist`
5. Finalizes the release

### Troubleshooting

- **"Build directory not found"**: Run `npm run build` first
- **"Auth token required"**: Set `SENTRY_AUTH_TOKEN` environment variable
- **"Org required"**: Set `SENTRY_ORG` environment variable
