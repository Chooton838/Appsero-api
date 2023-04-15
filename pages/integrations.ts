import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

export class IntegrationPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async mailchimp_lists_id() {
    let mailchimp_list_id = await this.request.get(
      `${config.use?.baseURL!}/v1/integrations/mailchimp/lists`,
      {}
    );

    expect(mailchimp_list_id.ok()).toBeTruthy();

    var list_id_response: Array<{ id: string }> = [{ id: "" }];

    try {
      list_id_response = await mailchimp_list_id.json();
    } catch (err) {
      console.log("Error: ", mailchimp_list_id.statusText());
    }

    return list_id_response[0].id;
  }

  async mailchimp_integration(product_slug, product_type, list_id) {
    let mailchimp_integration = await this.request.post(
      `${config.use
        ?.baseURL!}/v1/${product_type}/${product_slug}/integrations/mailchimp`,
      {
        data: {
          interests: {},
          list: list_id,
          tags: "",
          enabled: true,
        },
      }
    );

    expect(mailchimp_integration.ok()).toBeTruthy();
  }
}
