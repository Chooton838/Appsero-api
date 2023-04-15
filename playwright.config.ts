import type { PlaywrightTestConfig } from "@playwright/test";

require("dotenv").config();

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 30 * 1000 * 10,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ["html", { open: "never" }],
        ["list", { printSteps: true }],
        ["junit", { outputFile: "playwright-report/results.xml" }],
        ["allure-playwright"],
      ]
    : [
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["list", { printSteps: true }],
        ["junit", { outputFile: "playwright-report/results.xml" }],
        ["allure-playwright"],
      ],
  use: {
    actionTimeout: 0,
    headless: true,
    trace: "on-first-retry",

    baseURL:
      process.env.STAGING === "1"
        ? "https://staging.api.appsero.com"
        : "https://api.appsero.com",
    httpCredentials:
      process.env.STAGING === "1"
        ? {
            username: process.env.STAGING_USER_NAME!,
            password: process.env.STAGING_PASSWORD!,
          }
        : {
            username: process.env.USER_NAME!,
            password: process.env.PASSWORD!,
          },

    extraHTTPHeaders: { authorization: "" },
  },
};

export default config;
