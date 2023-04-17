import { APIRequestContext, expect } from "@playwright/test";
import * as fs from "fs";
import config from "../playwright.config";
import { plugin_data } from "../utils/data";

export class PluginPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async plugin_list() {
    const plugin_list = await this.request.get(
      `${config.use?.baseURL!}/v1/plugins`,
      {}
    );

    expect(plugin_list.ok()).toBeTruthy();

    try {
      let plugin_list_response = await plugin_list.json();
      let data: string = JSON.stringify(plugin_list_response, null, "\t");
      fs.writeFile("plugins list.json", data, function () {});
    } catch (err) {
      console.log(
        "Error of Plugins List Request is: ",
        plugin_list.statusText()
      );
    }
  }

  async free_plugin_create(plugin_name) {
    const free_plugin_create = await this.request.post(
      `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
      {
        data: {
          name: plugin_name,
          slug: plugin_name.split(" ").join("_").toLowerCase(),
          version: plugin_data.plugin_version,
          php: plugin_data.php_version,
          requires: plugin_data.wp_version,
          tested: plugin_data.tested_upto_version,
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
      `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
      {
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
      `${config.use?.baseURL!}/v1/plugins/${plugin_slug}`,
      {
        data: {
          demo: null,
          description: "Plugin Updated",
          homepage: null,
          name: plugin_data.plugin_name,
          slug: plugin_slug,
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
