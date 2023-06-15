import { APIRequestContext } from "@playwright/test";
import { IntegrationPage } from "./integrations";
import { ProductPage } from "./products";

export class SellingPlatformPage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async fastspring_mapping(
        selling_platform_name: string,
        api_key: number,
        selling_products_name: string[],
        products_list
    ) {
        const fastspring_integration = new IntegrationPage(this.request);
        const product = new ProductPage(this.request);
        let flag: boolean;

        const fastspring_connection =
            await fastspring_integration.check_connection(
                selling_platform_name
            );

        if (fastspring_connection == true) {
            flag = true;
        } else {
            let fastspring_username: string = "0BRS3IS8ROAR2UHZPR5PBG";
            let fastspring_password: string = "ngZdetugTQCw2_m98AqX9g";

            await fastspring_integration.connect_fastspring(
                fastspring_username,
                fastspring_password
            );

            const fastspring_new_connection =
                await fastspring_integration.check_connection(
                    selling_platform_name
                );

            if (fastspring_new_connection == true) {
                flag = true;
            } else {
                flag = false;
            }
        }

        if (flag == true) {
            let fastspring_product_properties =
                await fastspring_integration.fastspring_products(
                    selling_products_name
                );

            if (products_list.length >= 1) {
                for (let i: number = 0; i < products_list.length; i++) {
                    await product.selling_website_and_product_integration(
                        api_key,
                        products_list[i][2],
                        products_list[i][1],
                        fastspring_product_properties[0][0]
                    );
                }
            } else {
                console.log("Premium Product Not Found");
            }
        } else {
            console.log("Fastspring is not connected");
        }
    }

    async paddle_mapping(
        selling_platform_name: string,
        api_key: number,
        selling_products_name: string[],
        products_list
    ) {
        const paddle_integration = new IntegrationPage(this.request);
        const product = new ProductPage(this.request);
        let flag: boolean;

        const paddle_connection = await paddle_integration.check_connection(
            selling_platform_name
        );

        if (paddle_connection == true) {
            flag = true;
        } else {
            let vendor_auth_code: string =
                "83d2198f88350ba724954aff5bdc6ae47320b14e921de27ea6";
            let vendor_id: string = "7812";

            await paddle_integration.connect_paddle(
                vendor_auth_code,
                vendor_id
            );

            const paddle_new_connection =
                await paddle_integration.check_connection(
                    selling_platform_name
                );

            if (paddle_new_connection == true) {
                flag = true;
            } else {
                flag = false;
            }
        }

        if (flag == true) {
            let paddle_product_properties =
                await paddle_integration.paddle_products(selling_products_name);

            if (products_list.length >= 1) {
                for (let i: number = 0; i < products_list.length; i++) {
                    await product.selling_website_and_product_integration(
                        api_key,
                        products_list[i][2],
                        products_list[i][1],
                        paddle_product_properties[0][0]
                    );
                }
            } else {
                console.log("Premium Product Not Found");
            }
        } else {
            console.log("Paddle is not connected");
        }
    }

    async gumroad_mapping(
        selling_platform_name: string,
        api_key: number,
        selling_products_name: string[],
        products_list
    ) {
        const gumroad_integration = new IntegrationPage(this.request);
        const product = new ProductPage(this.request);
        let flag: boolean;

        const gumroad_connection = await gumroad_integration.check_connection(
            selling_platform_name
        );

        if (gumroad_connection == true) {
            flag = true;
        } else {
            let access_token: string =
                "OX6WHBmsp-spDk-9rLtDgbsiXaoRHGPtHOyHGSk4kjA";

            await gumroad_integration.connect_gumroad(access_token);

            const gumroad_new_connection =
                await gumroad_integration.check_connection(
                    selling_platform_name
                );

            if (gumroad_new_connection == true) {
                flag = true;
            } else {
                flag = false;
            }
        }

        if (flag == true) {
            let gumroad_product_properties =
                await gumroad_integration.gumroad_products(
                    selling_products_name
                );

            if (products_list.length >= 1) {
                for (let i: number = 0; i < products_list.length; i++) {
                    if (products_list[i][3] == 1) {
                        await product.selling_website_and_product_integration(
                            api_key,
                            products_list[i][2],
                            products_list[i][1],
                            gumroad_product_properties[0][0]
                        );
                    }
                }
            } else {
                console.log("Premium Product Not Found");
            }
        } else {
            console.log("Gumroad is not connected");
        }
    }
}
