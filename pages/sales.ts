import { faker } from "@faker-js/faker";
import { APIRequestContext, expect } from "@playwright/test";
import config from "../playwright.config";

export class OrderPage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }
    async order_create(product_type: string, product_slug: string) {
        let customer_email: string = faker.internet.email();

        const order_create = await this.request.post(
            `${config.use
                ?.baseURL!}/v1/sales/${product_type}s/${product_slug}/orders/create`,
            {
                data: {
                    email: customer_email,
                    name: "MMH Chooton",
                    phone: "01512345678",
                    price: "50",
                },
            }
        );

        try {
            expect(order_create.ok()).toBeTruthy();
            let order_create_response = await order_create.json();
            expect(order_create_response.success).toEqual(true);
            return customer_email;
        } catch (err) {
            console.log(
                `Response body is: ${await order_create.body()} & status code is: ${await order_create.status()}`
            );
            expect(order_create.ok()).toBeTruthy();
            return "";
        }
    }

    async order_id(
        product_type: string,
        product_slug: string,
        customer_email: string
    ) {
        const orders_id = await this.request.get(
            `${config.use
                ?.baseURL!}/v1/sales/${product_type}s/${product_slug}/orders`,
            {
                data: {
                    page: 1,
                    status: "all",
                    type: "all",
                    orderby: "ordered_at",
                    order: "desc",
                    search: customer_email,
                    variation: "all",
                },
            }
        );

        try {
            expect(orders_id.ok()).toBeTruthy();
            let orders_id_response = await orders_id.json();
            return orders_id_response.data[0].id;
        } catch (err) {
            console.log(
                `Response body is: ${await orders_id.body()} & status code is: ${await orders_id.status()}`
            );
            expect(orders_id.ok()).toBeTruthy();
        }
    }

    async license_key(
        product_type: string,
        product_slug: string,
        order_id: number
    ) {
        const license_key = await this.request.get(
            `${config.use
                ?.baseURL!}/v1/sales/${product_type}s/${product_slug}/orders/${order_id}`,
            {}
        );

        try {
            expect(license_key.ok()).toBeTruthy();
            let license_key_response = await license_key.json();
            expect(license_key_response.data.id).toEqual(order_id);
            return license_key_response.data.licenses[0].key;
        } catch (err) {
            console.log(
                `Response body is: ${await license_key.body()} & status code is: ${await license_key.status()}`
            );
            expect(license_key.ok()).toBeTruthy();
        }
    }

    async license_activation(
        product_hash: string,
        license_key: string,
        site_url: string
    ) {
        const license_activation = await this.request.post(
            `${config.use
                ?.baseURL!}/public/license/${product_hash}/activate?license_key=${license_key}&url=${site_url}`,
            {}
        );

        try {
            expect(license_activation.ok()).toBeTruthy();
            let license_activation_response = await license_activation.json();
            expect(license_activation_response.message).toEqual(
                "License Activated Successfully"
            );
        } catch (err) {
            console.log(
                `Response body is: ${await license_activation.body()} & status code is: ${await license_activation.status()}`
            );
            expect(license_activation.ok()).toBeTruthy();
        }
    }
}
