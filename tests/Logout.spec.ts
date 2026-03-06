import { test, expect } from "@playwright/test";
import { TestConfig } from "../test.config";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { RandomDataUtil } from "../utils/randomDataGenerator";

let config: TestConfig;
let homePage: HomePage;
let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  config = new TestConfig();
  await page.goto(config.appUrl);
  homePage = new HomePage(page);
  loginPage = new LoginPage(page);
});

test("User Logout test @master @regression", async ({ page }) => {
  await homePage.clickMyAccount();
  await homePage.clickRegister();

  const registrationPage = new RegistrationPage(page);

  const email = RandomDataUtil.getEmail();
  const password = RandomDataUtil.getRandomPassword(10);

  await registrationPage.completeRegistration({
    firstName: RandomDataUtil.getFirstName(),
    lastName: RandomDataUtil.getlastName(),
    email,
    telephone: RandomDataUtil.getPhoneNumber(),
    password,
  });

  const myAccountPage = new MyAccountPage(page);
  const logoutPage = await myAccountPage.clickLogout();

  const logoutMsg = await logoutPage.getConfirmationMsg();
  expect(logoutMsg.toLowerCase()).toContain("logout");
});
