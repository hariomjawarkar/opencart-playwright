import { Page, Locator } from "@playwright/test";

export class SearchResultPage {
  private readonly page: Page;
  private readonly productLinks: Locator;
  private readonly searchPageHeader: Locator;
  private readonly productContainers: Locator;
  private readonly noResults: Locator;

  constructor(page: Page) {
    this.page = page;
    // product links inside search results
    this.productLinks = page.locator('.product-layout .caption a');
    this.productContainers = page.locator('.product-layout');
    this.searchPageHeader = page.locator('#content h1');
    this.noResults = page.locator('#content p:has-text("There is no product that matches the search criteria")');
  }
  async isSearchResultsPageExists(): Promise<boolean> {
    try {
      const headerText = (await this.searchPageHeader.textContent()) ?? "";
      if (headerText.toLowerCase().includes('search')) return true;

      const count = await this.productLinks.count();
      if (count > 0) return true;

      if (await this.noResults.isVisible()) return true;

      return false;
    } catch (error) {
      return false;
    }
  }

  async isProductExist(productName: string): Promise<boolean> {
    try {
      const count = await this.productLinks.count();
      for (let i = 0; i < count; i++) {
        const title = (await this.productLinks.nth(i).textContent())?.trim() ?? '';
        if (title === productName) return true;
      }
    } catch (error) {
      console.log(`Error checking product existence: ${error}`);
    }
    return false;
  }

  async getProductCount(): Promise<number> {
    return await this.productContainers.count();
  }

  async getProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productContainers.count();
    for (let i = 0; i < count; i++) {
      const title = (await this.productContainers.nth(i).locator('.caption a').textContent())?.trim() ?? '';
      names.push(title);
    }
    return names;
  }

  async getProductPrices(): Promise<string[]> {
    const prices: string[] = [];
    const count = await this.productContainers.count();
    for (let i = 0; i < count; i++) {
      const priceLocator = this.productContainers.nth(i).locator('.price, .caption .price');
      const price = (await priceLocator.first().textContent())?.trim() ?? '';
      prices.push(price);
    }
    return prices;
  }

  
  async getProductPriceByName(name: string): Promise<string | null> {
    const count = await this.productContainers.count();
    for (let i = 0; i < count; i++) {
      const title = (await this.productContainers.nth(i).locator('.caption a').textContent())?.trim() ?? '';
      if (title === name) {
        const price = (await this.productContainers.nth(i).locator('.price, .caption .price').first().textContent())?.trim() ?? '';
        return price;
      }
    }
    return null;
  }

  async selectProduct(name: string): Promise<void> {
    await this.clickProductByName(name);
  }

  async selectProductByIndex(index: number): Promise<void> {
    const cnt = await this.productContainers.count();
    if (index < 0 || index >= cnt) throw new Error(`Index out of range: ${index}`);
    await this.productContainers.nth(index).locator('.caption a').click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForResults(timeout: number = 5000): Promise<void> {
  await this.page.waitForLoadState('domcontentloaded');

  const hasProducts = await this.productContainers.first()
    .isVisible({ timeout })
    .catch(() => false);

  if (hasProducts) {
    return;
  }

  const noResultsVisible = await this.page
    .locator('#content')
    .getByText('There is no product that matches')
    .isVisible({ timeout })
    .catch(() => false);

  if (noResultsVisible) {
    throw new Error('Search returned no products.');
  }

  throw new Error('Search results did not load properly.');
}

  async getResultsCount(): Promise<number> {
    return await this.productLinks.count();
  }
  async clickProductByName(name: string): Promise<void> {
    const match = this.productLinks.filter({ hasText: name }).first();
    await match.click();
    await this.page.waitForLoadState('networkidle');
  }
  async isNoResults(): Promise<boolean> {
    return await this.noResults.isVisible();
  }
}
