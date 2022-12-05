import { expect, APIRequestContext } from "@playwright/test";
import { base_url } from "../utils/data";


export class LoginPage {

  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(user_name, password) {

    const login = await this.request.post(`${base_url}/login`, {
      data: {
        email: user_name,
        password: password,
      }
    });

    expect(login.status()).toBeTruthy();

    const login_response = await login.json();

    return login_response.api_token;

  }
}