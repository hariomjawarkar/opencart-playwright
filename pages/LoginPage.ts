import { Page, Locator } from "@playwright/test";

export class LoginPage {
    private readonly page: Page;
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertDanger: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
        this.alertDanger = page.locator('.alert.alert-danger');
    }

    async setEmail(email: string): Promise<void> {
        await this.txtEmail.waitFor({ state: 'visible' });
        await this.txtEmail.fill(email);
    }

    async setPassword(password: string): Promise<void> {
        await this.txtPassword.waitFor({ state: 'visible' });
        await this.txtPassword.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.setEmail(email);
        await this.setPassword(password);
        await this.clickLogin();
        await this.page.waitForLoadState('networkidle');
    }

    async getLoginErrorMessage(): Promise<string> {
        try {
            await this.alertDanger.waitFor({ state: 'visible', timeout: 5000 });
            return (await this.alertDanger.textContent()) ?? '';
        } catch (e) {
            return '';
        }
    }
}
