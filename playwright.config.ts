import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:6006' },
  webServer: {
    command: 'bun run storybook --no-open',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'e2e', testMatch: /.*\.e2e\.spec\.ts/, use: devices['Desktop Chrome'] },
    { name: 'visual', testMatch: /.*visual.*\.spec\.ts/, use: devices['Desktop Chrome'] },
  ],
});
