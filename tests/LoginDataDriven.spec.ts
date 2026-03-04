import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import { DataProvider } from "../utils/dataProvider";
import { TestConfig } from "../test.config";
import { HomePage } from "../pages/HomePage";
// load the JSON file data
const jsonPath = "testdata/logindata.json";
const jsonTestData = DataProvider.getTestDataFromJson(jsonPath);

for (const data of jsonTestData) {
  test(`Login test with Json data:${data.testName} @datadriven`, async ({
    page,
  }) => {
    const config = new TestConfig();
    await page.goto(config.appUrl);

    const homePage = new HomePage(page);
    await homePage.clickMyAccount();
    await homePage.clickLogin();

    const loginPage = new LoginPage(page);
    // use configured valid credentials for expected-success scenarios
    if (data.expected && data.expected.toLowerCase() === 'success') {
      await loginPage.login(config.email, config.password);
    } else {
      await loginPage.login(data.email, data.password);
    }

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
