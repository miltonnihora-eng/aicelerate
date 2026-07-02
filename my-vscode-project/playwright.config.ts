import { defineConfig, devices } from '@playwright/test';

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

export default defineConfig({
  testDir: './tests',
  
  // Maak parallelle tests uit - BrowserStack kan beperkt zijn
  fullyParallel: true,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Workers configuratie
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    // Base URL voor tests
    baseURL: process.env.BASE_URL || 'https://tst.luister-cms.api.npox.nl',
    
    // Screenshot en video opties
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    
    // Timeout settings
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },

  // Global timeout
  timeout: 60000,

  // Lokale tests (development)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // BrowserStack configuratie (alleen als credentials beschikbaar zijn)
  ...(BROWSERSTACK_USERNAME && BROWSERSTACK_ACCESS_KEY && {
    webServer: {
      command: 'npx playwright test --list',
      reuseExistingServer: !process.env.CI,
    },
    use: {
      connectOptions: {
        wsEndpoint: `wss://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(
          JSON.stringify({
            'browserstack.username': BROWSERSTACK_USERNAME,
            'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
          })
        )}`,
      },
    },
    projects: [
      // Chrome Browsers
      {
        name: 'bs-chrome-windows',
        use: {
          connectOptions: {
            wsEndpoint: `wss://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(
              JSON.stringify({
                'browserstack.username': BROWSERSTACK_USERNAME,
                'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
                'browser': 'Chrome',
                'browser_version': 'latest',
                'os': 'Windows',
                'os_version': '11',
                'name': 'Playwright Chrome Test',
              })
            )}`,
          },
        },
      },
      // Firefox Browsers
      {
        name: 'bs-firefox-windows',
        use: {
          connectOptions: {
            wsEndpoint: `wss://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(
              JSON.stringify({
                'browserstack.username': BROWSERSTACK_USERNAME,
                'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
                'browser': 'Firefox',
                'browser_version': 'latest',
                'os': 'Windows',
                'os_version': '11',
                'name': 'Playwright Firefox Test',
              })
            )}`,
          },
        },
      },
      // Safari Browsers
      {
        name: 'bs-safari-macos',
        use: {
          connectOptions: {
            wsEndpoint: `wss://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(
              JSON.stringify({
                'browserstack.username': BROWSERSTACK_USERNAME,
                'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
                'browser': 'Safari',
                'browser_version': 'latest',
                'os': 'OS X',
                'os_version': 'Ventura',
                'name': 'Playwright Safari Test',
              })
            )}`,
          },
        },
      },
      // Mobile browsers
      {
        name: 'bs-android-mobile',
        use: {
          connectOptions: {
            wsEndpoint: `wss://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(
              JSON.stringify({
                'browserstack.username': BROWSERSTACK_USERNAME,
                'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
                'device': 'Samsung Galaxy S23',
                'os': 'Android',
                'os_version': '13.0',
                'name': 'Playwright Android Test',
              })
            )}`,
          },
        },
      },
      {
        name: 'bs-ios-mobile',
        use: {
          connectOptions: {
            wsEndpoint: `wss://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(
              JSON.stringify({
                'browserstack.username': BROWSERSTACK_USERNAME,
                'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
                'device': 'iPhone 15',
                'os': 'iOS',
                'os_version': '17.0',
                'name': 'Playwright iOS Test',
              })
            )}`,
          },
        },
      },
    ],
  }),

  // Web server (indien nodig)
  webServer: {
    command: 'npm start',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
