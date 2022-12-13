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

    // const product_delete_response = await product_delete.json();
    // console.log(product_delete_response);
  }

  async selling_platform_selection(platform_name) {
    const selling_platform: string = platform_name;

    switch (selling_platform) {
      case "woocom":
        break;

      case "edd":
        break;

      case "gumroad":
        break;

      case "paddle":
        break;

      case "fastspring":
        break;

      default:
        break;
    }
  }

  async release_create(product_slug, product_type) {
    const product_delete = await this.request.post(
      `${base_url}/v1/${product_type}/${product_slug}/releases`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          change_log: "IR",
          file_location: { product_slug: {} },
          release_date: "2022-12-06",
          version: "0.0.1",
        },
      }
    );

    expect(product_delete.ok()).toBeTruthy();
  }

  async release_update(product_name, version) {}

  async release_delete(product_name, version) {}

  async mailchimp_integrations(product_slug, product_type) {
    const mailchimp_integrations = await this.request.get(
      `${base_url}/v1/${product_type}/${product_slug}/integrations/mailchimp`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          interests: {},
          list: "16657e67cd",
          tags: "",
          enabled: true,
        },
      }
    );

    expect(mailchimp_integrations.ok()).toBeTruthy();
  }
}
