import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './api',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.API_BASE_URL ?? 'http://localhost:8000',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(process.env.API_TOKEN
        ? { 'Authorization': `Bearer ${process.env.API_TOKEN}` }
        : {}),
    },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'api',

    },
  ],
});
