import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

export class BundlePage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async bundle_create(bundle_name, products_id) {
    const bundle_create = await this.request.post(
      `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
      {
        data: {
          name: bundle_name,
          slug: bundle_name.split(" ").join("_").toLowerCase(),
          project_ids: products_id,
          //'variation_ids':,
          type: "bundle",
          icon_file: null,
          premium: 1,
        },
      }
    );

    expect(bundle_create.ok()).toBeTruthy();

    return bundle_name.split(" ").join("_").toLowerCase();
  }
}
