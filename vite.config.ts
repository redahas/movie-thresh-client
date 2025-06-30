import { sentryVitePlugin } from "@sentry/vite-plugin";
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },

  plugins: [tsConfigPaths({
    projects: ['./tsconfig.json'],
  }), tanstackStart(), sentryVitePlugin({
    org: "moviethresh",
    project: "movie-thresh-client"
  })],

  build: {
    sourcemap: true
  }
})