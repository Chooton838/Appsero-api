import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

export class ProductPage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async products_list() {
        let products_prop: [
            id: number,
            slug: string,
            type: string,
            premium: number
        ][] = [];

        const product_list = await this.request.get(
            `${config.use?.baseURL!}/v1/projects`,
            {}
        );

        let product_list_response: {
            data: Array<{
                id: number;
                slug: string;
                type: string;
                premium: number;
            }>;
        } = { data: [] };

        try {
            expect(product_list.ok()).toBeTruthy();
            product_list_response = await product_list.json();

            for (let i = 0; i < product_list_response.data.length; i++) {
                products_prop.push([
                    product_list_response.data[i].id,
                    product_list_response.data[i].slug,
                    product_list_response.data[i].type,
                    product_list_response.data[i].premium,
                ]);
            }
        } catch (err) {
            console.log(
                `Response body is: ${await product_list.body()} & status code is: ${await product_list.status()}`
            );
            expect(product_list.ok()).toBeTruthy();
        }
        return products_prop;
    }

    async products_details(product_slug: string, product_type: string) {
        const products_details = await this.request.get(
            `${config.use?.baseURL!}/v1/${product_type}s/${product_slug}`,
            {}
        );

        let products_details_response: { data: { slug: string; hash: string } };
        let products_hash: string = "";

        try {
            expect(products_details.ok()).toBeTruthy();
            products_details_response = await products_details.json();
            expect(products_details_response.data.slug).toEqual(product_slug);
            products_hash = products_details_response.data.hash;
        } catch (err) {
            console.log(
                `Response body is: ${await products_details.body()} & status code is: ${await products_details.status()}`
            );
            expect(products_details.ok()).toBeTruthy();
        }
        return products_hash;
    }

    async product_delete(product_slug, product_type) {
        const product_delete = await this.request.delete(
            `${config.use?.baseURL!}/v1/${product_type}s/${product_slug}`,
            {}
        );

        try {
            expect(product_delete.ok()).toBeTruthy();
            let product_delete_response = await product_delete.json();
            expect(product_delete_response.success).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await product_delete.body()} & status code is: ${await product_delete.status()}`
            );
            expect(product_delete.ok()).toBeTruthy();
        }
    }

    async license_mapping(product_slug, selling_platform_name) {
        let license: Array<string> = [];
        let selling_platform_selection = selling_platform_name;

        switch (selling_platform_selection) {
            case "woocom":
                license.push("woo");
                license.push("woo");
                break;

            case "edd":
                license.push("edd");
                license.push("edd");
                break;

            case "gumroad":
                license.push("appsero");
                license.push("gumroad");
                break;

            case "paddle":
                license.push("appsero");
                license.push("paddle");
                break;

            case "fastspring":
                license.push("appsero");
                license.push("fastspring");
                break;

            default:
                console.log("Invalid License");
                return;
        }

        const license_mapping = await this.request.post(
            `${config.use
                ?.baseURL!}/v1/projects/${product_slug}/settings/licensing`,
            {
                data: {
                    hosted_at: license[0],
                    license_source: "Native",
                    premium: true,
                    sale_via: license[1],
                    update_source: true,
                },
            }
        );

        try {
            expect(license_mapping.ok()).toBeTruthy();
            let license_mapping_response = await license_mapping.json();
            expect(license_mapping_response.data.sale_via).toEqual(license[1]);
            license = [];
        } catch (err) {
            console.log(
                `Response body is: ${await license_mapping.body()} & status code is: ${await license_mapping.status()}`
            );
            expect(license_mapping.ok()).toBeTruthy();
        }
    }

    async single_variation_single_payment(product_slug, limit, price) {
        const single_variation_single_payment = await this.request.post(
            `${config.use
                ?.baseURL!}/v1/projects/${product_slug}/settings/variations`,
            {
                data: {
                    default_variation: {
                        activation_limit: limit,
                        price: price,
                        recurring: 0,
                        period: null,
                    },
                    has_variations: false,
                },
            }
        );

        try {
            expect(single_variation_single_payment.ok()).toBeTruthy();
            let single_variation_single_payment_response =
                await single_variation_single_payment.json();
            expect(
                single_variation_single_payment_response.data.default_variation
                    .price
            ).toEqual(50);
        } catch (err) {
            console.log(
                `Response body is: ${await single_variation_single_payment.body()} & status code is: ${await single_variation_single_payment.status()}`
            );
            expect(single_variation_single_payment.ok()).toBeTruthy();
        }
    }

    async release_create(product_slug, product_type) {
        let objFilelocation = {},
            slug = product_slug;
        objFilelocation[slug] = {};

        const release_create = await this.request.post(
            `${config.use
                ?.baseURL!}/v1/${product_type}s/${product_slug}/releases`,
            {
                data: {
                    change_log: `Initial Release for ${product_slug}`,
                    file_location: { ...{}, [product_slug]: {} },
                    release_date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()}`,
                    version: "1.1.1",
                },
            }
        );

        try {
            expect(release_create.ok()).toBeTruthy();
            let release_create_response = await release_create.json();
            expect(release_create_response.data.change_log).toEqual(
                `Initial Release for ${product_slug}`
            );
        } catch (err) {
            console.log(
                `Response body is: ${await release_create.body()} & status code is: ${await release_create.status()}`
            );
            expect(release_create.ok()).toBeTruthy();
        }
    }

    async selling_website_api_key(selling_website_url) {
        const selling_website_api_key = await this.request.get(
            `${config.use?.baseURL!}/v1/api-keys`,
            {}
        );

        let selling_website_api_key_response: Array<{
            id: number;
            url: string;
        }> = [];

        let api_key: number = 0;

        try {
            expect(selling_website_api_key.ok()).toBeTruthy();
            selling_website_api_key_response =
                await selling_website_api_key.json();
            if (selling_website_api_key_response.length >= 1) {
                for (
                    let i: number = 0;
                    i < selling_website_api_key_response.length;
                    i++
                ) {
                    if (
                        selling_website_api_key_response[i].url ==
                        selling_website_url
                    ) {
                        api_key = selling_website_api_key_response[i].id;
                    }
                }
            }
        } catch (err) {
            console.log(
                `Response body is: ${await selling_website_api_key.body()} & status code is: ${await selling_website_api_key.status()}`
            );
            expect(selling_website_api_key.ok()).toBeTruthy();
        }
        return api_key;
    }

    //Used for platforms like woocommerce and edd
    async find_selling_product(selling_products_name, api_key: number) {
        const find_selling_product = await this.request.get(
            `${config.use?.baseURL!}/v1/get-projects/${api_key}`,
            {}
        );

        let find_selling_product_response: Array<{
            title: string;
            id: number;
            price: string;
            has_variation: boolean;
            variations: [];
        }> = [];

        let selling_product_properties: [
            id: number,
            price: string,
            has_variation: boolean,
            variations: []
        ][] = [];

        try {
            expect(find_selling_product.ok()).toBeTruthy();
            find_selling_product_response = await find_selling_product.json();
            if (find_selling_product_response.length >= 1) {
                for (
                    let i: number = 0;
                    i < find_selling_product_response.length;
                    i++
                ) {
                    selling_products_name.forEach((element) => {
                        if (find_selling_product_response[i].title == element) {
                            selling_product_properties.push([
                                find_selling_product_response[i].id,
                                find_selling_product_response[i].price,
                                find_selling_product_response[i].has_variation,
                                find_selling_product_response[i].variations,
                            ]);
                        }
                    });
                }
            }
        } catch (err) {
            console.log(
                `Response body is: ${await find_selling_product.body()} & status code is: ${await find_selling_product.status()}`
            );
            expect(find_selling_product.ok()).toBeTruthy();
        }
        return selling_product_properties;
    }

    //Used for platforms like woocommerce and edd
    async selling_website_and_product_mapping(
        api_key: number,
        product_type: string,
        product_slug: string,
        selling_product_properties
    ) {
        const selling_website_and_product_mapping = await this.request.post(
            `${config.use
                ?.baseURL!}/v1/onboarding/${product_type}/${product_slug}/map-project`,
            {
                data: {
                    apiKey: api_key,
                    default_price: selling_product_properties[0][1],
                    has_variation: selling_product_properties[0][2],
                    id: selling_product_properties[0][0],
                    variations: selling_product_properties[0][3],
                },
            }
        );

        try {
            expect(selling_website_and_product_mapping.ok()).toBeTruthy();
            let selling_website_and_product_mapping_response =
                await selling_website_and_product_mapping.json();
            expect(
                selling_website_and_product_mapping_response.success
            ).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await selling_website_and_product_mapping.body()} & status code is: ${await selling_website_and_product_mapping.status()}`
            );
            expect(selling_website_and_product_mapping.ok()).toBeTruthy();
        }
    }

    //Used for platformd like Fastspring, Paddle, Gumroad
    async selling_website_and_product_integration(
        api_key: number,
        product_type: string,
        product_slug: string,
        selling_product_name: string
    ) {
        const selling_website_and_product_integration = await this.request.post(
            `${config.use
                ?.baseURL!}/v1/${product_type}s/${product_slug}/integrations/fastspring/connect`,
            {
                data: {
                    project: selling_product_name,
                    site: api_key,
                    variations: [],
                },
            }
        );

        try {
            expect(selling_website_and_product_integration.ok()).toBeTruthy();
            let selling_website_and_product_integration_response =
                await selling_website_and_product_integration.json();
            expect(
                selling_website_and_product_integration_response.success
            ).toEqual(true);
        } catch (err) {
            console.log(
                `Response body is: ${await selling_website_and_product_integration.body()} & status code is: ${await selling_website_and_product_integration.status()}`
            );
            expect(selling_website_and_product_integration.ok()).toBeTruthy();
        }
    }
}
