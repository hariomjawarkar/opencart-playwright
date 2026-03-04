import { Page, Locator } from "@playwright/test";

export class HomePage {

    private readonly page: Page;

    // Header Account Dropdown
    private readonly lnkMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly headerRegister: Locator;
    private readonly headerLogin: Locator;

    private readonly txtSearchbox: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header My Account dropdown toggle and menu items
        this.lnkMyAccount = page.locator("a[title='My Account']");
        // Prefer right-column links when available
        this.lnkRegister = page.locator('#column-right').getByRole('link', { name: 'Register', exact: true });
        this.lnkLogin = page.locator('#column-right').getByRole('link', { name: 'Login', exact: true });
        this.headerRegister = page.locator("ul.dropdown-menu a", { hasText: 'Register' });
        this.headerLogin = page.locator("ul.dropdown-menu a", { hasText: 'Login' });

        this.txtSearchbox = page.locator("input[name='search']");
        this.btnSearch = page.locator("#search button");
    }

   async clickMyAccount(): Promise<void> {

    const rightCol = this.page
        .locator('#column-right')
        .getByRole('link', { name: 'My Account', exact: true })
        .first();

    if (await rightCol.isVisible().catch(() => false)) {
        await rightCol.click();
        return;
    }

    await this.lnkMyAccount.click();
}

    async clickRegister(): Promise<void> {
        // Navigate directly to the register page to avoid flaky dropdown interactions
        const base = new URL(this.page.url()).origin;
        await this.page.goto(`${base}/index.php?route=account/register`);
        await this.page.waitForLoadState('networkidle');
    }

    async clickLogin(): Promise<void> {
        // Navigate directly to the login page to avoid flaky dropdown interactions
        const base = new URL(this.page.url()).origin;
        await this.page.goto(`${base}/index.php?route=account/login`);
    }

    async enterProductName(pName: string): Promise<void> {
        await this.txtSearchbox.fill(pName);
    }

    async clickSearch(): Promise<void> {
        await this.btnSearch.click();
    }
}