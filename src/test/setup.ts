import '@testing-library/jest-dom';

// Mock Vite's import.meta.env
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SENTRY_DSN: 'test-dsn',
    VITE_ENVIRONMENT: 'test',
    VITE_SENTRY_TRACES_SAMPLE_RATE: '1.0',
    VITE_SENTRY_TRACE_PROPAGATION_TARGETS: 'localhost,test.com',
  },
  writable: true,
});
