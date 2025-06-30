#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuration
const SENTRY_CONFIG = {
  org: process.env.SENTRY_ORG || 'your-org-slug',
  project: process.env.SENTRY_PROJECT || 'movie-thresh-client',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: process.env.SENTRY_RELEASE || process.env.npm_package_version || '1.0.0',
  environment: process.env.NODE_ENV || 'production',
  distPath: './.output/public', // TanStack Start public assets
  urlPrefix: '~/'
};

// Validate required environment variables
if (!SENTRY_CONFIG.authToken) {
  console.error('❌ SENTRY_AUTH_TOKEN environment variable is required');
  console.error('You can get this from Sentry > Settings > Auth Tokens');
  process.exit(1);
}

if (!SENTRY_CONFIG.org || SENTRY_CONFIG.org === 'your-org-slug') {
  console.error('❌ SENTRY_ORG environment variable is required');
  console.error('This is your Sentry organization slug');
  process.exit(1);
}

// Check if dist directory exists
if (!existsSync(SENTRY_CONFIG.distPath)) {
  console.error(`❌ Build directory not found: ${SENTRY_CONFIG.distPath}`);
  console.error('Please run "npm run build" first');
  process.exit(1);
}

console.log('🚀 Starting Sentry sourcemap upload...');
console.log(`📦 Release: ${SENTRY_CONFIG.release}`);
console.log(`🌍 Environment: ${SENTRY_CONFIG.environment}`);
console.log(`📁 Source: ${SENTRY_CONFIG.distPath}`);

try {
  // Create a new release
  console.log('📝 Creating Sentry release...');
  execSync(
    `npx @sentry/cli releases new ${SENTRY_CONFIG.release}`,
    {
      env: {
        ...process.env,
        SENTRY_ORG: SENTRY_CONFIG.org,
        SENTRY_PROJECT: SENTRY_CONFIG.project,
        SENTRY_AUTH_TOKEN: SENTRY_CONFIG.authToken,
      },
      stdio: 'inherit'
    }
  );

  // Upload sourcemaps
  console.log('📤 Uploading sourcemaps...');
  execSync(
    `npx @sentry/cli releases files ${SENTRY_CONFIG.release} upload-sourcemaps ${SENTRY_CONFIG.distPath} --url-prefix '${SENTRY_CONFIG.urlPrefix}'`,
    {
      env: {
        ...process.env,
        SENTRY_ORG: SENTRY_CONFIG.org,
        SENTRY_PROJECT: SENTRY_CONFIG.project,
        SENTRY_AUTH_TOKEN: SENTRY_CONFIG.authToken,
      },
      stdio: 'inherit'
    }
  );

  // Finalize the release
  console.log('✅ Finalizing release...');
  execSync(
    `npx @sentry/cli releases finalize ${SENTRY_CONFIG.release}`,
    {
      env: {
        ...process.env,
        SENTRY_ORG: SENTRY_CONFIG.org,
        SENTRY_PROJECT: SENTRY_CONFIG.project,
        SENTRY_AUTH_TOKEN: SENTRY_CONFIG.authToken,
      },
      stdio: 'inherit'
    }
  );

  console.log('🎉 Sourcemaps uploaded successfully!');
  console.log(`🔗 View release: https://sentry.io/organizations/${SENTRY_CONFIG.org}/releases/${SENTRY_CONFIG.release}/`);

} catch (error) {
  console.error('❌ Failed to upload sourcemaps:', error.message);
  process.exit(1);
}
