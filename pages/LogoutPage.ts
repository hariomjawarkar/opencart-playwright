import { Page, Locator } from "@playwright/test";
import { HomePage } from "./HomePage";

export class LogoutPage {
    private readonly page: Page;
    private readonly btnContinue: Locator;
    private readonly msgConfirmation: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnContinue = page.locator('.btn.btn-primary');
        this.msgConfirmation = page.getByRole('heading', { name: /Logout/i });
    }

    async clickContinue(): Promise<HomePage> {
        await this.btnContinue.click();
        return new HomePage(this.page);
    }

    async isContinueButtonVisible(): Promise<boolean> {
        return await this.btnContinue.isVisible();
    }

    async getConfirmationMsg(): Promise<string> {
        // Wait for the confirmation header to be visible
        await this.msgConfirmation.waitFor({ state: 'visible', timeout: 10000 });
        const text = await this.msgConfirmation.innerText();
        return text.trim();
    }
}
