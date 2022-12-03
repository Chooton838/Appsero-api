import { expect, APIRequestContext } from '@playwright/test';
import * as faker from 'faker';
import { base_url } from '../utils/data';
import { auth } from "../tests/main.spec";


export class ProductPage {

  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }


  async product_list() {

    let products_prop: string[] = [];

    const product_list = await this.request.get(`${base_url}/v1/projects`, {
      headers: {
        'authorization': auth,
      }
    });

    expect(product_list.status()).toBeTruthy();

    const product_list_response = await product_list.json();
    console.log();
    for (let i = 0; i < (product_list_response.data).length; i++) {
      products_prop.push(product_list_response.data[i].slug);
      products_prop.push(product_list_response.data[i].type);
    }
    const products = [products_prop]

    return products;

  };


  async product_delete(product_slug, product_type) {

    const product_delete = await this.request.delete(`${base_url}/v1/${product_type}s/${product_slug}`, {
      headers: {
        'authorization': auth,
      }
    });

    expect(product_delete.status()).toBeTruthy();

    const product_delete_response = await product_delete.json();
    console.log(product_delete_response);

  };


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


  async release_create(product_name) {

  };


  async release_update(product_name, version) {

  };


  async release_delete(product_name, version) {

  };

}
