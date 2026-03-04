import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import { TestConfig } from "../test.config";
import { RandomDataUtil } from "../utils/randomDataGenerator";
import { RegistrationPage } from "../pages/RegistrationPage";
import { LogoutPage } from "../pages/LogoutPage";

let homePage: HomePage;
let loginPage: LoginPage;
let myAccountPage: MyAccountPage;
let config: TestConfig;

test.beforeEach(async ({ page }) => {
  config = new TestConfig();
  await page.goto(config.appUrl);
  homePage = new HomePage(page);
  loginPage = new LoginPage(page);
});

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(2000);
  await page.close();
});

test("Valid login should land on My Account page", async ({ page }) => {
  // Register a new user to ensure valid credentials
  await homePage.clickMyAccount();
  await homePage.clickRegister();
  const registrationPage = new RegistrationPage(page);

  const firstName = RandomDataUtil.getFirstName();
  const lastName = RandomDataUtil.getlastName();
  const email = `${RandomDataUtil.getRandomUUID()}@example.com`;
  const telephone = RandomDataUtil.getPhoneNumber();
  const password = RandomDataUtil.getRandomPassword(10);

  await registrationPage.completeRegistration({
    firstName,
    lastName,
    email,
    telephone,
    password,
  });

  // After registration, logout then login with same credentials
  myAccountPage = new MyAccountPage(page);
  const logoutPage = await myAccountPage.clickLogout();
  await logoutPage.clickContinue();

  await homePage.clickMyAccount();
  await homePage.clickLogin();
  await loginPage.login(email, password);
  myAccountPage = new MyAccountPage(page);
  const exists = await myAccountPage.isMyAccountPageExists();
  expect(exists).toBeTruthy();
});

test("Invalid login shows error message", async ({ page }) => {
  await homePage.clickMyAccount();
  await homePage.clickLogin();
  await loginPage.login(
    RandomDataUtil.getEmail(),
    RandomDataUtil.getRandomPassword(8),
  );
  const err = await loginPage.getLoginErrorMessage();
  expect(err).toContain("No match for E-Mail Address and/or Password");
});
