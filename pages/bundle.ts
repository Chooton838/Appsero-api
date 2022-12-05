import { expect, APIRequestContext } from '@playwright/test';
import { base_url } from '../utils/data';
import { ProductPage } from "../pages/products";
import { auth } from "../tests/main.spec";


export class BundlePage {

  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async bundle_create(bundle_name, products_id) {

    const bundle_create = await this.request.post(`${base_url}/v1/onboarding/basic-information/`, {
      headers: {
        'authorization': auth,
      },
      data: {
        'name': bundle_name,
        'slug': ((bundle_name.split(" ")).join("_")).toLowerCase(),
        'project_ids': products_id,
        //'variation_ids':,
        'type': "bundle",
        'icon_file': null,
      }
    });

    expect(bundle_create.status()).toBeTruthy();

    return ((bundle_name.split(" ")).join("_")).toLowerCase();

  };


  // async bundle_update(updateable_bundle_name, new_bundle_name) {

  //   await this.page.goto(base_url);
  //   await this.page.locator(product_finding_locator.bundle_navigate).click();
  //   await this.page.locator(product_finding_locator.search).hover();
  //   await this.page.locator(product_finding_locator.search_project).click();
  //   await this.page.locator(product_finding_locator.search_project).fill(updateable_bundle_name);
  //   await this.page.locator('(//h3[text()="' + updateable_bundle_name + '"])[1]').click();
  //   await this.page.locator(product_finding_locator.settings).click();
  //   await this.page.locator(product_finding_locator.edit).click();
  //   await this.page.locator(product_finding_locator.name).fill(new_bundle_name);
  //   await this.page.locator(product_finding_locator.update_bundle).click();

  // }
}