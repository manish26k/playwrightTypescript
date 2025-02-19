import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { testConfig } from './testConfig';
let ENV = process.env.ENV;

if(!ENV || ![`dev`, `Uat`].includes(ENV)) {
  console.log(`Please provide a correct environment value like "npx cross-env ENV=dev|Uat"`);
  process.exit();
}
ENV = `dev`,
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [[`html`], /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  ["allure-playwright",
    {
      detail: true,
      outputFolder: "my-allure-results",
      suiteTitle: false,
    },]
  ],
   /* Maximum time one test can run for. */
  timeout: 240000,
  /* Maximum runtime of an entire test suite. */
  globalTimeout: 30 * 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 50 * 1000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    baseURL: testConfig[ENV],
    //baseURL: (process.env.NODE_ENV === "DEV" ? "https://hah-ce-prbportal.powerappsportals.com/" : "https://hah-ce-prbportal-uat.powerappsportals.com/"),
    actionTimeout: 50 * 1000,
    navigationTimeout: 70 * 1000,
    launchOptions: {
      slowMo: 2000,
      devtools: false,
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: {
      mode: 'only-on-failure',

    },
    
  },



  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: `chromium`,
        channel: `chrome`,
        baseURL: testConfig[ENV],
        //baseURL: (process.env.NODE_ENV === "DEV" ? "https://hah-ce-prbportal.powerappsportals.com/" : "https://hah-ce-prbportal-uat.powerappsportals.com/"),
        //storageState: 'state.json',
        headless: false,
        viewport: { width: 1500, height: 730},
        acceptDownloads: true,
        screenshot: `on`,
        video: `retain-on-failure`,
        trace: `on`,
        launchOptions:{
          slowMo: 1000
        }

       },
    },
    /*{
      name: `Chromium`,
      use: {
        browserName: `chromium`,
        baseURL: testConfig[process.env.ENV],
        storageState: 'state.json',
        headless: false,
        viewport: { width: 1500, height: 730 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,
        launchOptions: {
          slowMo: 0
        }
      },
    },*/

    /* {
       name: `Firefox`,
       use: {
         browserName: `firefox`,
         baseURL: testConfig[process.env.ENV],
         storageState: 'state.json',
         headless: false,
         viewport: { width: 1500, height: 730 },
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
         screenshot: `only-on-failure`,
         video: `retain-on-failure`,
         trace: `retain-on-failure`,
         launchOptions: {
           slowMo: 0
         }
       },
     },
 
     {
       name: `Edge`,
       use: {
         browserName: `chromium`,
         channel: `msedge`,
         baseURL: testConfig[process.env.ENV],
         storageState: 'state.json',
         headless: false,
         viewport: { width: 1500, height: 730 },
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
         screenshot: `only-on-failure`,
         video: `retain-on-failure`,
         trace: `retain-on-failure`,
         launchOptions: {
           slowMo: 0
         }
       },
     },
     /*{
       name: `WebKit`,
       use: {
         browserName: `webkit`,
         baseURL: testConfig[process.env.ENV],
         storageState: 'state.json',
         headless: false,
         viewport: { width: 1500, height: 730 },
         ignoreHTTPSErrors: true,
         acceptDownloads: true,
         screenshot: `only-on-failure`,
         video: `retain-on-failure`,
         trace: `retain-on-failure`,
         launchOptions: {
           slowMo: 0
         }
       },
     },*/
    /*  {
        name: `Device`,
        use: {
          ...devices[`Pixel 4a (5G)`],
          browserName: `chromium`,
          channel: `chrome`,
          baseURL: testConfig[process.env.ENV],
          storageState: 'state.json',
          headless: false,
          ignoreHTTPSErrors: true,
          acceptDownloads: true,
          screenshot: `only-on-failure`,
          video: `retain-on-failure`,
          trace: `retain-on-failure`,
          launchOptions: {
            slowMo: 0
          }
        },
      },*/
    /* {
       name: `API`,
       use: {
         baseURL: testConfig[process.env.ENV]
       }
     }*/
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
