import{defineConfig,devices} from "@playwright/test";
export default defineConfig({
  timeout:30*1000,
  testDir:'./tests',
  fullyParallel:false,
  retries:process.env.CI?2:0,
  workers:process.env.CI?1:undefined,
  reporter:[
    ['html',{outputFolder:'../reports/html-report'}],
    ['allure-playwright',{outputFolder:'../reports/allure-results'}]
  ],
  use:
  { trace:'on-first-retry',
    screenshot:'only-on-failure',
    video:'retain-on-failure',
  },
  // Removed grep filter so all tests are discovered by default
  projects:[
    {name:'chromium',use:{...devices['Desktop Chrome']}},
    {name:'firefox',use:{...devices['Desktop Firefox']}}
  ],
});