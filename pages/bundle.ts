import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

export class BundlePage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async bundle_create(bundle_name, products_id) {
        const bundle_create = await this.request.post(
            `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
            {
                data: {
                    name: bundle_name,
                    slug: bundle_name.split(" ").join("_").toLowerCase(),
                    project_ids: products_id,
                    //'variation_ids':,
                    type: "bundle",
                    icon_file: null,
                    premium: 1,
                },
            }
        );

        try {
            expect(bundle_create.ok()).toBeTruthy();
            let bundle_create_response = await bundle_create.json();
            expect(bundle_create_response.message).toEqual(
                "Added Successfully"
            );
        } catch (err) {
            console.log(
                `Response body is: ${await bundle_create.body()} & status code is: ${await bundle_create.status()}`
            );
            expect(bundle_create.ok()).toBeTruthy();
        }
    }
}
