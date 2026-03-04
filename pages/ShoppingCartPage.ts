import { Page, Locator } from "@playwright/test";

export class ShoppingCartPage {

    private readonly page: Page;
    private readonly cartRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartRows = page.locator("table.table-bordered tbody tr");
    }

    async getProductNames(): Promise<string[]> {

        await this.page.waitForURL('**route=checkout/cart**');

        const count = await this.cartRows.count();

        if (count === 0) return [];

        const names: string[] = [];

        for (let i = 0; i < count; i++) {
            const name = await this.cartRows
                .nth(i)
                .locator("td:nth-child(1)").innerText();

            names.push(name.trim());
        }

        return names;
    }
}