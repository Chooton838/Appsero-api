import { APIRequestContext, expect } from "@playwright/test";
import { auth } from "../tests/main.spec";
import { base_url } from "../utils/data";

export class IntegrationPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async mailchimp_lists_id() {
    let mailchimp_list_id = await this.request.get(
      `${base_url}/v1/integrations/mailchimp/lists`,
      {
        headers: {
          authorization: auth,
        },
      }
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
      `${base_url}/v1/${product_type}/${product_slug}/integrations/mailchimp`,
      {
        headers: {
          authorization: auth,
        },
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
