import{Page,Locator,expect} from "@playwright/test";
import { LogoutPage } from "./LogoutPage";

export class MyAccountPage{
    private readonly page:Page;
    private readonly msgHeading:Locator;
    private readonly lnkLogout:Locator;

    constructor(page:Page)
    {
        this.page=page;
        // Look for heading in multiple places and use a resilient logout locator
        this.msgHeading = page.locator('h1:has-text("My Account"), h2:has-text("My Account")');
        this.lnkLogout = page.getByRole('link', { name: 'Logout' }).first();
    }
    async isMyAccountPageExists():Promise<boolean>
    {
        try{
            if (await this.msgHeading.count() > 0 && await this.msgHeading.first().isVisible()) return true;

            // fallback: check for logout link presence
            if ((await this.lnkLogout.count()) > 0 && await this.lnkLogout.isVisible()) return true;

            // fallback: check URL contains account route
            const url = this.page.url();
            if (url.includes('route=account/account')) return true;

            return false;
        }
        catch(error)
        {
            console.log(`Error checking My Account page heading visibility:${error}`)
            return false;
        }
    

    }
    async clickLogout():Promise<LogoutPage>
    {
        try{
            await this.lnkLogout.click();
            return new LogoutPage(this.page);
        }
        catch(error)
        {
            console.log(`Unable to click logout link:${error}`)
            throw error;
        }
    }

    async getPageTitle():Promise<string>
    {
        return (this.page.title());
    }


}