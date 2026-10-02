import { defineConfig, devices } from '@playwright/test';

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const webPort = process.env.PLAYWRIGHT_WEB_PORT || '3000';
const apiPort = process.env.PLAYWRIGHT_API_PORT || '4000';
const isolatedServers = Boolean(process.env.PLAYWRIGHT_WEB_PORT || process.env.PLAYWRIGHT_API_PORT);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: externalBaseUrl || `http://127.0.0.1:${webPort}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: externalBaseUrl ? [] : [
    {
      command: 'npm --workspace=@katl/api run start',
      url: `http://127.0.0.1:${apiPort}/health/live`,
      env: { API_PORT: apiPort },
      reuseExistingServer: !process.env.CI && !isolatedServers,
      timeout: 60_000,
    },
    {
      command: `npm --workspace=@katl/web exec next -- start -p ${webPort}`,
      url: `http://127.0.0.1:${webPort}/uk-UA`,
      env: { API_URL: `http://127.0.0.1:${apiPort}` },
      reuseExistingServer: !process.env.CI && !isolatedServers,
      timeout: 60_000,
    },
  ],
});
