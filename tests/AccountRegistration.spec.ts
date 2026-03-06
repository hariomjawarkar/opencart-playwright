import { test, expect } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { RandomDataUtil } from "../utils/randomDataGenerator";
import { TestConfig } from "../test.config";

let homePage: HomePage;
let registrationPage: RegistrationPage;
let config: TestConfig;

test.beforeEach(async ({ page }) => {
  const config = new TestConfig();
  await page.goto(config.appUrl); //Navigate to application url
  homePage = new HomePage(page);
  registrationPage = new RegistrationPage(page);
});

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(1000);
});

test("User registration test", async ({ page }) => {
  await homePage.clickMyAccount();
  await homePage.clickRegister();

  const password = RandomDataUtil.getRandomPassword(10);
  await registrationPage.completeRegistration({
    firstName: RandomDataUtil.getFirstName(),
    lastName: RandomDataUtil.getlastName(),
    email: RandomDataUtil.getEmail(),
    telephone: RandomDataUtil.getPhoneNumber(),
    password: password
  });

  //validate to confirmation message
  const confirmationMsg = await registrationPage.getConfirmationMsg();
  expect(confirmationMsg).toContain('Your Account Has Been Created!');
});
