import { defineConfig } from 'cypress'

export default defineConfig({
  blockedHosts: ['*.awsstatic.com', '*omtrdc.net', '*.shortbread.aws.dev'],
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  retries: {
    runMode: 2,
    openMode: 1,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
