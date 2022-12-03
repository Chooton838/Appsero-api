import { expect, APIRequestContext } from '@playwright/test';
import { base_url, plugin_data } from '../utils/data';
import { ProductPage } from "../pages/products";
import { auth } from "../tests/main.spec";


export class PluginPage {

  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }


  async plugin_list() {

    const plugin_list = await this.request.get(`${base_url}/v1/plugins`, {
      headers: {
        'authorization': auth,
      }
    });

    expect(plugin_list.status()).toBeTruthy();

    const plugin_list_response = await plugin_list.json();
    console.log(plugin_list_response);

  }


  async free_plugin_create(plugin_name) {

    const free_plugin_create = await this.request.post(`${base_url}/v1/onboarding/basic-information/`, {
      headers: {
        'authorization': auth,
      },
      data: {
        'name': plugin_name,
        'slug': ((plugin_name.split(" ")).join("_")).toLowerCase(),
        //'version': faker.finance.amount(0, 9, 1),
        'version': plugin_data.plugin_version,
        'php': plugin_data.php_version,
        'requires': plugin_data.wp_version,
        'tested': plugin_data.tested_upto_version,
        //'variation_ids':,
        'type': "plugin",
        'icon_file': null,
        //'premium': 0,
      }
    });

    expect(free_plugin_create.status()).toBeTruthy();

    const free_plugin_response = await free_plugin_create.json();
    console.log(free_plugin_response);

    return ((plugin_name.split(" ")).join("_")).toLowerCase();

  };


  async pro_plugin_create(plugin_name) {

    const pro_plugin_create = await this.request.post(`${base_url}/v1/onboarding/basic-information/`, {
      headers: {
        'authorization': auth,
      },
      data: {
        'name': plugin_name,
        'slug': ((plugin_name.split(" ")).join("_")).toLowerCase(),
        //'version': faker.finance.amount(0, 9, 1),
        'version': plugin_data.plugin_version,
        'php': plugin_data.php_version,
        'requires': plugin_data.wp_version,
        'tested': plugin_data.tested_upto_version,
        //'variation_ids':,
        'type': "plugin",
        'icon_file': null,
        'premium': 1,
      }
    });

    expect(pro_plugin_create.status()).toBeTruthy();

    const pro_plugin_response = await pro_plugin_create.json();
    console.log(pro_plugin_response);

    return ((plugin_name.split(" ")).join("_")).toLowerCase();

  };


  async plugin_update(plugin_slug) {

    const plugin_update = await this.request.put(`${base_url}/v1/plugins/${plugin_slug}`, {
      headers: {
        'authorization': auth,
      },
      data: {
        "demo": null,
        "description": null,
        "homepage": null,
        "name": plugin_data.plugin_name,
        "slug": ((plugin_data.plugin_name.split(" ")).join("_")).toLowerCase(),
        "variation_ids": [],
        'version': plugin_data.plugin_version,
        'php': plugin_data.php_version,
        'requires': plugin_data.wp_version,
        'tested': plugin_data.tested_upto_version,
      }
    });

    expect(plugin_update.status()).toBeTruthy();

    const plugin_update_response = await plugin_update.json();
    console.log(plugin_update_response);

  };

}