import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

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

        let login_response: { email: string; api_token: string } = {
            email: "",
            api_token: "",
        };

        try {
            expect(login.ok()).toBeTruthy();
            login_response = await login.json();
            expect(login_response.email).toEqual(login_data[1]);
            config.use!.extraHTTPHeaders!.authorization = `Bearer ${login_response.api_token}`;
        } catch (err) {
            console.log(
                `Response body is: ${await login.body()} & status code is: ${await login.status()}`
            );
            expect(login.ok()).toBeTruthy();
        }
    }
}
