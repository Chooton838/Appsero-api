import { expect, Page } from '@playwright/test';
import { base_url } from '../utils/data';
import { bundle_locator, product_finding_locator } from '../utils/locators';
import { ProductPage } from "../pages/products";


export class BundlePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async bundle_create(bundle_name, platform_name, website_url, product_name, bundle_products) {

    await this.page.goto(base_url);
    await this.page.waitForLoadState("networkidle");

    await this.page.locator(bundle_locator.navigate).click();
    await this.page.locator(bundle_locator.add_bundle).click();
    await this.page.locator(bundle_locator.name).fill(bundle_name);
    await this.page.locator(bundle_locator.slug).fill(((bundle_name.split(" ")).join("_")).toLowerCase());

    await this.page.locator(bundle_locator.select_products).click();
    for (let i: number = 0; i < bundle_products.length; i++) {
      await this.page.locator('//div[text()=" ' + bundle_products[i] + ' "]').click();
    }

    await this.page.locator(bundle_locator.submit).click();
    await this.page.locator(bundle_locator.yes).click();

    // select selling platform
    const product = new ProductPage(this.page);
    await product.selling_platform_selection(platform_name);

    await this.page.locator(bundle_locator.use_appsero).click();
    await this.page.locator(bundle_locator.select_website).click();
    await this.page.locator('//li[contains(text(),"' + website_url + '")]').click();
    await this.page.locator(bundle_locator.select_product).click();
    await this.page.locator('//li[contains(text(),"' + product_name + '")]').click();

    await this.page.locator(bundle_locator.next).click();

    await expect(await this.page.locator(product_finding_locator.check_product)).toHaveText("Get Started");

  };


  async bundle_update(updateable_bundle_name, new_bundle_name) {

    await this.page.goto(base_url);
    await this.page.locator(product_finding_locator.bundle_navigate).click();
    await this.page.locator(product_finding_locator.search).hover();
    await this.page.locator(product_finding_locator.search_project).click();
    await this.page.locator(product_finding_locator.search_project).fill(updateable_bundle_name);
    await this.page.locator('(//h3[text()="' + updateable_bundle_name + '"])[1]').click();
    await this.page.locator(product_finding_locator.settings).click();
    await this.page.locator(product_finding_locator.edit).click();
    await this.page.locator(product_finding_locator.name).fill(new_bundle_name);
    await this.page.locator(product_finding_locator.update_bundle).click();

  }
}