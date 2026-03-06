import { Page, Locator, expect } from "@playwright/test";
import { LogoutPage } from "./LogoutPage";

export class MyAccountPage {
    private readonly page: Page;
    private readonly msgHeading: Locator;
    private readonly lnkLogout: Locator;

    constructor(page: Page) {
        this.page = page;
        // Look for heading in multiple places and use a resilient logout locator
        this.msgHeading = page.locator('h1:has-text("My Account"), h2:has-text("My Account")');
        this.lnkLogout = page.getByRole('link', { name: 'Logout' }).first();
    }
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            // Wait for elements that indicate we are on the account page
            await Promise.allSettled([
                this.msgHeading.first().waitFor({ state: 'visible', timeout: 5000 }),
                this.lnkLogout.waitFor({ state: 'visible', timeout: 5000 })
            ]);

            const hasHeading = await this.msgHeading.first().isVisible();
            const hasLogout = await this.lnkLogout.isVisible();
            const hasUrl = this.page.url().includes('route=account/account');

            return hasHeading || hasLogout || hasUrl;
        }
        catch (error) {
            console.log(`Error checking My Account page presence: ${error}`)
            return false;
        }
    }
    async clickLogout(): Promise<LogoutPage> {
        try {
            await this.lnkLogout.click();
            return new LogoutPage(this.page);
        }
        catch (error) {
            console.log(`Unable to click logout link:${error}`)
            throw error;
        }
    }

    async getPageTitle(): Promise<string> {
        return (this.page.title());
    }


}