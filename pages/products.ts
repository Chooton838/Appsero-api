import { APIRequestContext, expect } from "@playwright/test";
import { auth } from "../tests/main.spec";
import { base_url } from "../utils/data";

export class ProductPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async product_list() {
    let products_prop: string[][] = [];

    let product_list = await this.request.get(`${base_url}/v1/projects`, {
      headers: {
        authorization: auth,
      },
    });

    expect(product_list.ok()).toBeTruthy();

    let product_list_response: {
      data: Array<{
        id: number;
        slug: string;
        type: string;
      }>;
    } = { data: [] };

    try {
      product_list_response = await product_list.json();
    } catch (err) {
      console.log("Error: ", product_list.statusText());
    }

    for (let i = 0; i < product_list_response.data.length; i++) {
      products_prop.push([
        product_list_response.data[i].slug,
        product_list_response.data[i].type,
      ]);
    }

    return products_prop;
  }

  async product_details(product_slug, product_type) {
    const product_details = await this.request.get(
      `${base_url}/v1/${product_type}/${product_slug}`,
      {
        headers: {
          authorization: auth,
        },
      }
    );

    expect(product_details.ok()).toBeTruthy();

    const product_details_response = await product_details.json();

    return product_details_response.data.default_variation.project_id;
  }

  async product_delete(product_slug, product_type) {
    const product_delete = await this.request.delete(
      `${base_url}/v1/${product_type}s/${product_slug}`,
      {
        headers: {
          authorization: auth,
        },
      }
    );

    expect(product_delete.ok()).toBeTruthy();
  }

  async license_mapping(product_slug, selling_platform_name) {
    let license: Array<string> = [];
    const selling_platform_selection = selling_platform_name;

    switch (selling_platform_selection) {
      case "woocom":
        license.push("woo");
        license.push("woo");
        break;

      case "edd":
        license.push("edd");
        license.push("edd");
        break;

      case "gumroad":
        license.push("appsero");
        license.push("gumroad");
        break;

      case "paddle":
        license.push("appsero");
        license.push("paddle");
        break;

      case "fastspring":
        license.push("appsero");
        license.push("fastspring");
        break;

      default:
        console.log("Invalid License");
        return;
    }

    const license_mapping = await this.request.post(
      `${base_url}/v1/projects/${product_slug}/settings/licensing`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          hosted_at: license[0],
          license_source: "Native",
          premium: true,
          sale_via: license[1],
          update_source: true,
        },
      }
    );
    license = [];

    expect(license_mapping.ok()).toBeTruthy();
  }

  async single_variation_single_payment(product_slug, limit, price) {
    const single_variation_single_payment = await this.request.post(
      `${base_url}/v1/projects/${product_slug}/settings/variations`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          default_variation: {
            activation_limit: limit,
            price: price,
            recurring: 0,
            period: null,
          },
          has_variations: false,
        },
      }
    );

    expect(single_variation_single_payment.ok()).toBeTruthy();
  }

  async release_create(product_slug, product_type) {
    var objFilelocation = {},
      slug = product_slug;
    objFilelocation[slug] = {};

    const release_create = await this.request.post(
      `${base_url}/v1/${product_type}s/${product_slug}/releases`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          change_log: `Initial Release for ${product_slug}`,
          // file_location: objFilelocation,
          file_location: { ...{}, [product_slug]: {} },
          // release_date: "2022-12-16T08:44:38.941Z",
          release_date: new Date().toISOString(),
          version: "1.1.1",
        },
      }
    );

    expect(release_create.ok()).toBeTruthy();
  }

  async release_update(product_name, version) {}

  async release_delete(product_name, version) {}
}
