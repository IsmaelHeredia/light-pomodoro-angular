import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: !!process.env.CI ? 1 : 0,
  workers: !!process.env.CI ? 2 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run start -- --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})