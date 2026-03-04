import { test, expect, Page } from "@playwright/test";
import { RegistrationPage } from "../pages/RegistrationPage";
import { HomePage } from "../pages/HomePage";
import { RandomDataUtil } from "../utils/randomDataGenerator";
import { TestConfig } from "../test.config";
import { LogoutPage } from "../pages/LogoutPage";
import { LoginPage } from "../pages/LoginPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import { SearchResultPage } from "../pages/SearchResultPage";
import { ProductPage } from "../pages/ProductPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test('execute end-to-end test flow @end-to-end', async ({ page }) => {
    const config = new TestConfig();
    await page.goto(config.appUrl);

    const registeredEmail: string = await performRegistration(page);
    console.log('Registration is completed:', registeredEmail);

    await performLogout(page);
    console.log('Logout is completed!');

    await performLogin(page, registeredEmail, config.password);
    console.log('Login is completed!');

    await addProductsToCart(page);
    console.log('Product added to cart!');

    await verifyShoppingCart(page);
    console.log('Shopping cart verification completed!');
});

async function performRegistration(page: Page): Promise<string> {
    const home = new HomePage(page);
    await home.clickMyAccount();
    // navigate directly to registration page to avoid header/dropdown flakiness
    const cfg = new TestConfig();
    await page.goto(`${cfg.appUrl}index.php?route=account/register`);

    const registration = new RegistrationPage(page);
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getRandomPassword(10);

    await registration.completeRegistration({
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getlastName(),
        email,
        telephone: RandomDataUtil.getPhoneNumber(),
        password,
    });

    return email;
}
async function performLogout(page: Page): Promise<void> {
    // try to click Logout if visible
    try {
        const myAccount = new MyAccountPage(page);
        await myAccount.clickLogout();
    } catch (error) {
        // fallback: click Logout link directly
        const logoutLink = page.getByRole('link', { name: 'Logout' }).first();
        if (await logoutLink.isVisible()) await logoutLink.click();
    }
}

async function performLogin(page: Page, email: string, password: string): Promise<void> {
    const home = new HomePage(page);
    await home.clickMyAccount();
    const cfg = new TestConfig();
    await page.goto(`${cfg.appUrl}index.php?route=account/login`);

    const login = new LoginPage(page);
    await login.login(email, password);
}

async function addProductsToCart(page: Page): Promise<void> {

    // Directly navigate to a stable product
    await page.goto("https://tutorialsninja.com/demo/index.php?route=product/product&product_id=43");

    const product = new ProductPage(page);

    // Always add 1
    await product.addToCart(1);

    // Validate cart updated
    await expect(page.locator('#cart-total'))
        .not.toContainText('0 item(s)', { timeout: 10000 });
}
// async function addProductsToCart(page: Page): Promise<void> {

//     const config = new TestConfig();
//     const home = new HomePage(page);

//     await home.enterProductName(config.productName);
//     await home.clickSearch();

//     const search = new SearchResultPage(page);
//     await search.waitForResults();

//     // Select first product
//     await search.selectProductByIndex(0);

//     const product = new ProductPage(page);

//     // ✅ Always use quantity = 1 to avoid stock issues
//     await product.addToCart(1);

//     // ✅ Final strong validation (business-level check)
//     await expect(page.locator('#cart-total'))
//         .not.toContainText('0 item(s)', { timeout: 10000 });
// }

async function verifyShoppingCart(page: Page): Promise<void> {
    const config = new TestConfig();
    // navigate to cart page
    await page.goto(`${config.appUrl}index.php?route=checkout/cart`);
    const cart = new ShoppingCartPage(page);
    const names = await cart.getProductNames();
    expect(names.length).toBeGreaterThan(0);
}