import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  timeout: 30 * 1000,
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use:
  {
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  // Removed grep filter so all tests are discovered by default
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } }
  ],
});