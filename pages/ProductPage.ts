import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {

  private readonly page: Page;
  private readonly qtyInput: Locator;
  private readonly btnAddToCart: Locator;
  private readonly successAlert: Locator;
  private readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;

    this.qtyInput = page.locator("#input-quantity");
    this.btnAddToCart = page.locator("#button-cart");
    this.successAlert = page.locator(".alert-success");
    this.cartTotal = page.locator("#cart-total");
  }

  async addToCart(qty: number = 1): Promise<void> {

    await this.qtyInput.fill(String(qty));

    await this.btnAddToCart.click();

    // ✅ Wait for alert to appear in DOM (not strictly visible)
    await this.successAlert.waitFor({ state: "attached", timeout: 10000 });

    // ✅ Strong validation: cart counter must update
    await expect(this.cartTotal)
      .not.toContainText("0 item(s)", { timeout: 10000 });
  }

  async getAddToCartMessage(): Promise<string> {
    if (await this.successAlert.count() > 0) {
      return (await this.successAlert.textContent()) ?? "";
    }
    return "";
  }
}