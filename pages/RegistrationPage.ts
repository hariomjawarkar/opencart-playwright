import { Page, Locator, expect } from "@playwright/test";

export class RegistrationPage {
    private readonly page: Page;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly msgConfirmation: Locator;

    constructor(page: Page) {
        this.page = page;

        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtConfirmPassword = page.locator('#input-confirm');
        this.chkPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('input[value="Continue"]');
        this.msgConfirmation = page.getByRole('heading', {
            name: 'Your Account Has Been Created!'
        });
    }

    // 🔹 Wait until registration page is fully loaded
    private async waitForRegistrationPage(): Promise<void> {
        await this.page.waitForURL('**route=account/register**');
        await this.txtFirstName.waitFor({ state: 'visible' });
    }

    async setFirstName(fname: string): Promise<void> {
        await this.txtFirstName.fill(fname);
    }

    async setLastName(lname: string): Promise<void> {
        await this.txtLastName.fill(lname);
    }

    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    async setTelephone(tel: string): Promise<void> {
        await this.txtTelephone.fill(tel);
    }

    async setPassword(pwd: string): Promise<void> {
        await this.txtPassword.fill(pwd);
    }

    async setConfirmPassword(pwd: string): Promise<void> {
        await this.txtConfirmPassword.fill(pwd);
    }

    async setPrivacyPolicy(): Promise<void> {
        await this.chkPolicy.check();
    }

    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    async getConfirmationMsg(): Promise<string> {
        await expect(this.msgConfirmation).toBeVisible();
        return (await this.msgConfirmation.textContent()) ?? '';
    }

    async completeRegistration(userData: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        password: string;
    }): Promise<void> {

        // ✅ Ensure page is fully loaded before interacting
        await this.waitForRegistrationPage();

        await this.setFirstName(userData.firstName);
        await this.setLastName(userData.lastName);
        await this.setEmail(userData.email);
        await this.setTelephone(userData.telephone);
        await this.setPassword(userData.password);
        await this.setConfirmPassword(userData.password);
        await this.setPrivacyPolicy();
        await this.clickContinue();

        // ✅ Wait for confirmation page
        await expect(this.msgConfirmation).toBeVisible();
    }
}