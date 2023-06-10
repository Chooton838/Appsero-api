import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

export class IntegrationPage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async mailchimp_connection() {
        const mailchimp_connection = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/mailchimp`,
            {}
        );

        return mailchimp_connection.ok();
    }

    async mailchimp_lists_id() {
        const mailchimp_list_id = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/mailchimp/lists`,
            {}
        );

        let list_id_response: Array<{ id: string }> = [{ id: "" }];

        try {
            expect(mailchimp_list_id.ok()).toBeTruthy();
            list_id_response = await mailchimp_list_id.json();
            return list_id_response[0].id;
        } catch (err) {
            console.log(
                `Response body is: ${await mailchimp_list_id.body()} & status code is: ${await mailchimp_list_id.status()}`
            );
            expect(mailchimp_list_id.ok()).toBeTruthy();
        }
    }

    async mailchimp_integration(product_slug, product_type, list_id) {
        const mailchimp_integration = await this.request.post(
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

        try {
            expect(mailchimp_integration.ok()).toBeTruthy();
            let mailchimp_integration_response =
                await mailchimp_integration.json();
            expect(mailchimp_integration_response.enabled).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await mailchimp_integration.body()} & status code is: ${await mailchimp_integration.status()}`
            );
            expect(mailchimp_integration.ok()).toBeTruthy();
        }
    }

    async weMail_connection() {
        const weMail_connection = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/wemail`,
            {}
        );

        return weMail_connection.ok();
    }

    async connect_weMail(key: string, name: string) {
        const connect_weMail = await this.request.post(
            `${config.use?.baseURL!}/v1/integrations/wemail`,
            {
                data: {
                    key: key,
                    name: name,
                },
            }
        );

        try {
            expect(connect_weMail.ok()).toBeTruthy();
            let connect_weMail_response = await connect_weMail.json();
            expect(connect_weMail_response.success).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await connect_weMail.body()} & status code is: ${await connect_weMail.status()}`
            );
            expect(connect_weMail.ok()).toBeTruthy();
        }
    }

    async weMail_lists_id(wemail_list: string) {
        const weMail_lists_id = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/wemail/lists`,
            {}
        );

        let weMail_lists_id_response: Array<{ id: string; name: string }> = [
            { id: "", name: "" },
        ];

        try {
            expect(weMail_lists_id.ok()).toBeTruthy();
            weMail_lists_id_response = await weMail_lists_id.json();
            if (weMail_lists_id_response.length >= 1) {
                for (
                    let i: number = 0;
                    i < weMail_lists_id_response.length;
                    i++
                ) {
                    if (weMail_lists_id_response[i].name == wemail_list) {
                        return weMail_lists_id_response[i].id;
                    }
                }
            }
        } catch (err) {
            console.log(
                `Response body is: ${await weMail_lists_id.body()} & status code is: ${await weMail_lists_id.status()}`
            );
            expect(weMail_lists_id.ok()).toBeTruthy();
        }
    }

    async weMail_integration(
        product_slug: string,
        product_type: string,
        list_id: string
    ) {
        const weMail_integration = await this.request.post(
            `${config.use
                ?.baseURL!}/v1/${product_type}s/${product_slug}/integrations/wemail`,
            {
                data: {
                    activation_tags: `${product_slug}_activated_on_appsero`,
                    deactivation_tags: `${product_slug}_deactivated_on_appsero`,
                    enabled: true,
                    list: list_id,
                },
            }
        );

        try {
            expect(weMail_integration.ok()).toBeTruthy();
            let weMail_integration_response = await weMail_integration.json();
            expect(weMail_integration_response.enabled).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await weMail_integration.body()} & status code is: ${await weMail_integration.status()}`
            );
            expect(weMail_integration.ok()).toBeTruthy();
        }
    }

    // Connection check for selling platforms like Fastspring, Paddle, Gumroad
    async check_connection(selling_platform_name: string) {
        const check_connection = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/${selling_platform_name}`,
            {}
        );

        return await check_connection.ok();
    }

    async connect_fastspring(username: string, password: string) {
        const connect_fastspring = await this.request.post(
            `${config.use?.baseURL!}/v1/integrations/fastspring`,
            {
                data: {
                    username: username,
                    password: password,
                },
            }
        );

        try {
            expect(connect_fastspring.ok()).toBeTruthy();
            let connect_fastspring_response = await connect_fastspring.json();
            expect(connect_fastspring_response.success).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await connect_fastspring.body()} & status code is: ${await connect_fastspring.status()}`
            );
            expect(connect_fastspring.ok()).toBeTruthy();
        }
    }

    async fastspring_products(selling_products_name: string[]) {
        const fastspring_products = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/fastspring-products`,
            {
                data: {
                    hosted_at: "fastspring",
                },
            }
        );

        let fastspring_products_response: {
            products: Array<{ id: string; name: string }>;
            mapped_products: [];
        };

        let fastspring_product_properties: [name: string, variations: []][] =
            [];

        try {
            expect(fastspring_products.ok()).toBeTruthy();
            fastspring_products_response = await fastspring_products.json();

            if (fastspring_products_response.products.length >= 1) {
                for (
                    let i: number = 0;
                    i < fastspring_products_response.products.length;
                    i++
                ) {
                    selling_products_name.forEach((element: string) => {
                        if (
                            fastspring_products_response.products[i].name ==
                            element
                        ) {
                            fastspring_product_properties.push([
                                fastspring_products_response.products[i].name,
                                [],
                            ]);
                        }
                    });
                }
            } else {
                console.log("Fastspring Product Not Found");
            }
        } catch (err) {
            console.log(
                `Response body is: ${await fastspring_products.body()} & status code is: ${await fastspring_products.status()}`
            );
            expect(fastspring_products.ok()).toBeTruthy();
        }
        return fastspring_product_properties;
    }

    async connect_paddle(vendor_auth_code: string, vendor_id: string) {
        const connect_paddle = await this.request.post(
            `${config.use?.baseURL!}/v1/integrations/paddle`,
            {
                data: {
                    sandbox: true,
                    vendor_auth_code: vendor_auth_code,
                    vendor_id: vendor_id,
                },
            }
        );

        try {
            expect(connect_paddle.ok()).toBeTruthy();
            let connect_paddle_response = await connect_paddle.json();
            expect(connect_paddle_response.success).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await connect_paddle.body()} & status code is: ${await connect_paddle.status()}`
            );
            expect(connect_paddle.ok()).toBeTruthy();
        }
    }

    async paddle_products(selling_products_name: string[]) {
        const paddle_products = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/fastspring-products`,
            {
                data: {
                    hosted_at: "paddle",
                },
            }
        );

        let paddle_products_response: {
            products: Array<{ id: string; name: string }>;
            mapped_products: [];
        };

        let paddle_product_properties: [name: string, variations: []][] = [];

        try {
            expect(paddle_products.ok()).toBeTruthy();
            paddle_products_response = await paddle_products.json();

            if (paddle_products_response.products.length >= 1) {
                for (
                    let i: number = 0;
                    i < paddle_products_response.products.length;
                    i++
                ) {
                    selling_products_name.forEach((element: string) => {
                        if (
                            paddle_products_response.products[i].name == element
                        ) {
                            paddle_product_properties.push([
                                paddle_products_response.products[i].id,
                                [],
                            ]);
                        }
                    });
                }
            }
        } catch (err) {
            console.log(
                `Response body is: ${await paddle_products.body()} & status code is: ${await paddle_products.status()}`
            );
            expect(paddle_products.ok()).toBeTruthy();
        }
        return paddle_product_properties;
    }

    async connect_gumroad(access_token: string) {
        const connect_gumroad = await this.request.post(
            `${config.use?.baseURL!}/v1/integrations/gumroad`,
            {
                data: {
                    access_token: access_token,
                },
            }
        );

        try {
            expect(connect_gumroad.ok()).toBeTruthy();
            let connect_gumroad_response = await connect_gumroad.json();
            expect(connect_gumroad_response.success).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await connect_gumroad.body()} & status code is: ${await connect_gumroad.status()}`
            );
            expect(connect_gumroad.ok()).toBeTruthy();
        }
    }

    async gumroad_products(selling_products_name: string[]) {
        const gumroad_products = await this.request.get(
            `${config.use?.baseURL!}/v1/integrations/fastspring-products`,
            {
                data: {
                    hosted_at: "gumroad",
                },
            }
        );

        let gumroad_products_response: {
            products: Array<{ id: string; name: string }>;
            mapped_products: [];
        };

        let gumroad_product_properties: [name: string, variations: []][] = [];

        try {
            expect(gumroad_products.ok()).toBeTruthy();
            gumroad_products_response = await gumroad_products.json();

            if (gumroad_products_response.products.length >= 1) {
                for (
                    let i: number = 0;
                    i < gumroad_products_response.products.length;
                    i++
                ) {
                    selling_products_name.forEach((element: string) => {
                        if (
                            gumroad_products_response.products[i].name ==
                            element
                        ) {
                            gumroad_product_properties.push([
                                gumroad_products_response.products[i].id,
                                [],
                            ]);
                        }
                    });
                }
            }
        } catch (err) {
            console.log(
                `Response body is: ${await gumroad_products.body()} & status code is: ${await gumroad_products.status()}`
            );
            expect(gumroad_products.ok()).toBeTruthy();
        }
        return gumroad_product_properties;
    }
}
