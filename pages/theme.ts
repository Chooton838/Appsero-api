import { faker } from "@faker-js/faker";
import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

export class ThemePage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async theme_list() {
    const theme_list = await this.request.get(
      `${config.use?.baseURL!}/v1/themes`,
      {}
    );

    expect(theme_list.ok()).toBeTruthy();

    const theme_list_response = await theme_list.json();
    // console.log(theme_list_response);
  }

  async free_theme_create(theme_name) {
    const free_theme_create = await this.request.post(
      `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
      {
        data: {
          name: theme_name,
          slug: theme_name.split(" ").join("_").toLowerCase(),
          version: faker.finance.amount(0, 9, 1),
          //'variation_ids':,
          type: "theme",
          icon_file: null,
        },
      }
    );

    expect(free_theme_create.ok()).toBeTruthy();

    return theme_name.split(" ").join("_").toLowerCase();
  }

  async pro_theme_create(theme_name) {
    const pro_theme_create = await this.request.post(
      `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
      {
        data: {
          name: theme_name,
          slug: theme_name.split(" ").join("_").toLowerCase(),
          version: faker.finance.amount(0, 9, 1),
          //'variation_ids':,
          type: "theme",
          icon_file: null,
          premium: 1,
        },
      }
    );

    expect(pro_theme_create.ok()).toBeTruthy();

    return theme_name.split(" ").join("_").toLowerCase();
  }

  async theme_update(theme_slug, new_theme_name) {
    const theme_update = await this.request.put(
      `${config.use?.baseURL!}/v1/themes/${theme_slug}`,
      {
        data: {
          demo: null,
          description: null,
          homepage: null,
          name: new_theme_name,
          slug: new_theme_name.split(" ").join("_").toLowerCase(),
          variation_ids: [],
        },
      }
    );

    expect(theme_update.ok()).toBeTruthy();

    const theme_update_response = await theme_update.json();
    // console.log(theme_update_response);
  }
}
