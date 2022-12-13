import { APIRequestContext, expect } from "@playwright/test";
import { auth } from "../tests/main.spec";
import { base_url, plugin_data } from "../utils/data";

export class PluginPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async plugin_list() {
    const plugin_list = await this.request.get(`${base_url}/v1/plugins`, {
      headers: {
        authorization: auth,
      },
    });

    expect(plugin_list.ok()).toBeTruthy();

    const plugin_list_response = await plugin_list.json();
    // console.log(plugin_list_response);
  }

  async free_plugin_create(plugin_name) {
    const free_plugin_create = await this.request.post(
      `${base_url}/v1/onboarding/basic-information/`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          name: plugin_name,
          slug: plugin_name.split(" ").join("_").toLowerCase(),
          version: plugin_data.plugin_version,
          php: plugin_data.php_version,
          requires: plugin_data.wp_version,
          tested: plugin_data.tested_upto_version,
          //'variation_ids':,
          type: "plugin",
          icon_file: null,
        },
      }
    );

    expect(free_plugin_create.ok()).toBeTruthy();

    return plugin_name.split(" ").join("_").toLowerCase();
  }

  async pro_plugin_create(plugin_name) {
    const pro_plugin_create = await this.request.post(
      `${base_url}/v1/onboarding/basic-information/`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          name: plugin_name,
          slug: plugin_name.split(" ").join("_").toLowerCase(),
          version: plugin_data.plugin_version,
          php: plugin_data.php_version,
          requires: plugin_data.wp_version,
          tested: plugin_data.tested_upto_version,
          //'variation_ids':,
          type: "plugin",
          icon_file: null,
          premium: 1,
        },
      }
    );

    expect(pro_plugin_create.ok()).toBeTruthy();

    return plugin_name.split(" ").join("_").toLowerCase();
  }

  async plugin_update(plugin_slug) {
    const plugin_update = await this.request.put(
      `${base_url}/v1/plugins/${plugin_slug}`,
      {
        headers: {
          authorization: auth,
        },
        data: {
          demo: null,
          description: null,
          homepage: null,
          name: plugin_data.plugin_name,
          slug: plugin_data.plugin_name.split(" ").join("_").toLowerCase(),
          variation_ids: [],
          version: plugin_data.plugin_version,
          php: plugin_data.php_version,
          requires: plugin_data.wp_version,
          tested: plugin_data.tested_upto_version,
        },
      }
    );

    expect(plugin_update.ok()).toBeTruthy();

    const plugin_update_response = await plugin_update.json();
    // console.log(plugin_update_response);
  }
}
