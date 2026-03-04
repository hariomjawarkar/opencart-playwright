import { Page,Locator } from "@playwright/test";
import { HomePage } from "./HomePage";
import { asyncWrapProviders } from "node:async_hooks";

export class LogoutPage{
    private readonly page:Page;
    private readonly btnContinue:Locator;

    constructor(page:Page)
    {
        this.page=page;
        this.btnContinue=page.locator('.btn.btn-primary');
    }

    async clickContinue():Promise<HomePage>
    {
    await this.btnContinue.click();
    return new HomePage(this.page);

    }

    async isContinueButtonVisible() :Promise<boolean>
    {
        return await this.btnContinue.isVisible();
    }
}
