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
        await this.txtEmail.fill(email);
    }

    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.setEmail(email);
        await this.setPassword(password);
        await this.clickLogin();
    }

    async getLoginErrorMessage(): Promise<string> {
        if (await this.alertDanger.isVisible()) {
            return (await this.alertDanger.textContent()) ?? '';
        }
        return '';
    }
}
