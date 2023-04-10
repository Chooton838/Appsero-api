import { APIRequestContext, expect } from "@playwright/test";

export class LoginPage {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(login_data) {
    const login = await this.request.post(`${login_data[0]}/login`, {
      data: {
        email: login_data[1],
        password: login_data[2],
      },
    });

    expect(login.ok()).toBeTruthy();
    console.log(login_data[0]);

    var login_response = { api_token: "" };

    try {
      login_response = await login.json();
    } catch (err) {
      console.log("Error: ", login.statusText());
    }

    return login_response.api_token;
  }
}
