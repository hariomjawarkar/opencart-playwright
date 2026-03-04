import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  private readonly page: Page;
  private readonly btnContinueBilling: Locator;
  private readonly btnContinueShippingAddress: Locator;
  private readonly btnContinueShippingMethod: Locator;
  private readonly chkAgree: Locator;
  private readonly btnConfirmOrder: Locator;
  private readonly orderSuccessHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnContinueBilling = page.locator('#button-payment-address');
    this.btnContinueShippingAddress = page.locator('#button-shipping-address');
    this.btnContinueShippingMethod = page.locator('#button-shipping-method');
    this.chkAgree = page.locator('input[name="agree"]');
    this.btnConfirmOrder = page.locator('#button-payment-method');
    this.orderSuccessHeader = page.locator('h1:has-text("Your order has been placed")');
  }

  async continueBilling(): Promise<void> {
    await this.btnContinueBilling.click();
    await this.page.waitForLoadState('networkidle');
  }

  async continueShippingAddress(): Promise<void> {
    await this.btnContinueShippingAddress.click();
    await this.page.waitForLoadState('networkidle');
  }

  async continueShippingMethod(): Promise<void> {
    await this.btnContinueShippingMethod.click();
    await this.page.waitForLoadState('networkidle');
  }

  async agreeTerms(): Promise<void> {
    if (!(await this.chkAgree.isChecked())) {
      await this.chkAgree.check();
    }
  }

  async confirmOrder(): Promise<void> {
    await this.btnConfirmOrder.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getOrderConfirmationText(): Promise<string> {
    if (await this.orderSuccessHeader.isVisible()) {
      return (await this.orderSuccessHeader.textContent()) ?? '';
    }
    return '';
  }
}
