import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
export default defineConfig({
  e2e: {
    testIsolation: true,
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'npx vite --config client/vite.config.mts',
        production:
          'npx vite build --config client/vite.config.mts && npx vite preview --config client/vite.config.mts',
      },
      ciWebServerCommand: 'npx vite --config client/vite.config.mts',
      ciBaseUrl: 'http://127.0.0.1:4200',
    }),
    baseUrl: 'http://127.0.0.1:4200',
    allowCypressEnv: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
    retries: { runMode: 2, openMode: 0 },
    numTestsKeptInMemory: 0,
  },
});
