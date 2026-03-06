import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import { DataProvider } from "../utils/dataProvider";
import { TestConfig } from "../test.config";
import { HomePage } from "../pages/HomePage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { RandomDataUtil } from "../utils/randomDataGenerator";
// load the JSON file data
const jsonPath = "testdata/logindata.json";
const jsonTestData = DataProvider.getTestDataFromJson(jsonPath);

for (const data of jsonTestData) {
  test(`Login test with Json data: ${data.testName} @datadriven`, async ({
    page,
  }) => {
    const config = new TestConfig();
    await page.goto(config.appUrl);

    const homePage = new HomePage(page);

    let loginEmail = data.email;
    let loginPassword = data.password;

    // If success is expected, register a new user first
    if (data.expected && data.expected.toLowerCase() === 'success') {
      await homePage.clickMyAccount();
      await homePage.clickRegister();
      const registrationPage = new RegistrationPage(page);
      loginEmail = `test_${RandomDataUtil.getRandomUUID().substring(0, 8)}@example.com`;
      loginPassword = RandomDataUtil.getRandomPassword(10);

      await registrationPage.completeRegistration({
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getlastName(),
        email: loginEmail,
        telephone: RandomDataUtil.getPhoneNumber(),
        password: loginPassword,
      });

      // Logout to prepare for login test
      const myAccountPage = new MyAccountPage(page);
      const logoutPage = await myAccountPage.clickLogout();
      await logoutPage.clickContinue();
    }

    await homePage.clickMyAccount();
    await homePage.clickLogin();

    const loginPage = new LoginPage(page);
    await loginPage.login(loginEmail, loginPassword);

    if (data.expected && data.expected.toLowerCase() === "success") {
      const myAccountPage = new MyAccountPage(page);
      const isLoggedIn = await myAccountPage.isMyAccountPageExists();
      expect(isLoggedIn).toBeTruthy();
    } else {
      const errorMessage = await loginPage.getLoginErrorMessage();
      expect(errorMessage).toContain(
        "No match for E-Mail Address and/or Password",
      );
    }
  });
}
