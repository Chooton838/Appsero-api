import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import config from "../playwright.config";

import { BundlePage } from "../pages/bundle";
import { DashboardPage } from "../pages/dashboard";
import { IntegrationPage } from "../pages/integrations";
import { LoginPage } from "../pages/login";
import { PluginPage } from "../pages/plugin";
import { ProductPage } from "../pages/products";
import { OrderPage } from "../pages/sales";
import { SellingPlatformPage } from "../pages/selling_platforms";
import { ThemePage } from "../pages/theme";

let plugins_slug: string[] = [];
let themes_slug: string[] = [];
let products_id: number[] = [];
let products_hash: string[] = [];
let existing_plugins_count: number;
let current_plugins_count: number;
let products_list: [id: number, slug: string, type: string, premium: number][] =
    [];
let premium_products_list: [
    id: number,
    slug: string,
    type: string,
    premium: number
][] = [];
let api_key: number = 0;
let selling_platform_name: string = "fastspring"; // Could be "woocom", "edd", "paddle", "fastspring", "gumroad"

let selling_website_url =
    process.env.STAGING === "1"
        ? "https://helper-test.s1-tastewp.com"
        : "https://wedevsqa.com";

let selling_products_name: string[] = ["fast-plugin"];

let selling_product_properties: [
    id: number,
    price: string,
    has_variation: boolean,
    variations: []
][] = [];
let customers_email: string[] = [];
let orders_id: number[] = [];
let license_key: string[] = [];

/* ------------------------ Login ------------------------ */
test("Login", async ({ request }) => {
    const login_data: Array<string> = [
        config.use?.baseURL!,
        config.use?.httpCredentials?.username!,
        config.use?.httpCredentials?.password!,
    ];
    const login = new LoginPage(request);
    await login.login(login_data);
});

/* ------------------------ Getting Dashboard Details ------------------------ */
test("Getting Dashboard Overview Details", async ({ request }) => {
    const dashboard = new DashboardPage(request);
    existing_plugins_count = await dashboard.overview_details();
});

/* ------------------------ Plugin CRUD Functionalities ------------------------ */
test("Get all the Plugins List", async ({ request }) => {
    const plugin = new PluginPage(request);
    await plugin.plugins_list();
});

test("Free Plugin Create", async ({ request }) => {
    const plugin = new PluginPage(request);
    const free_plugin_name: string = faker.lorem.words(2); //Auto generated plugin name
    plugins_slug.push(await plugin.free_plugin_create(free_plugin_name));
});

test("Premium Plugin Create", async ({ request }) => {
    const plugin = new PluginPage(request);
    const pro_plugin_name: string = faker.lorem.words(2); //Auto generated plugin name
    plugins_slug.push(await plugin.pro_plugin_create(pro_plugin_name));
});

test("Plugin Update", async ({ request }) => {
    const plugin = new PluginPage(request);
    // const updateable_plugin_slug: string = ""; //Any existing plugin slug
    // await plugin.plugin_update(updateable_plugin_slug);

    /* All Plugin Update */
    for (let i: number = 0; i < plugins_slug.length; i++) {
        await plugin.plugin_update(plugins_slug[i]);
    }
});

/* ------------------------ Checking Dashboard Details ------------------------ */
test("Checking Dashboard Overview Details", async ({ request }) => {
    const dashboard = new DashboardPage(request);
    current_plugins_count = await dashboard.overview_details();
    expect(existing_plugins_count + plugins_slug.length).toEqual(
        current_plugins_count
    );
});

/* ------------------------ Theme CRUD Functionalities ------------------------ */
test("Get all the Themes List", async ({ request }) => {
    const theme = new ThemePage(request);
    await theme.themes_list();
});

test("Free Theme Create", async ({ request }) => {
    const theme = new ThemePage(request);
    const free_theme_name: string = faker.lorem.words(2); //Auto generated theme name
    themes_slug.push(await theme.free_theme_create(free_theme_name));
});

test("Premium Theme Create", async ({ request }) => {
    const theme = new ThemePage(request);
    const pro_theme_name: string = faker.lorem.words(2); //Auto generated theme name
    themes_slug.push(await theme.pro_theme_create(pro_theme_name));
});

test("Theme Update", async ({ request }) => {
    const theme = new ThemePage(request);
    // const updateable_theme_slug: string = ""; //Any existing theme slug
    // await theme.theme_update(updateable_theme_slug);

    /* All Theme Update */
    for (let i: number = 0; i < themes_slug.length; i++) {
        await theme.theme_update(themes_slug[i]);
    }
});

/* ------------------------ Release CRUD Functionalities ------------------------ */
test("Release Create", async ({ request }) => {
    const product = new ProductPage(request);
    products_list = await product.products_list();

    if (products_list.length >= 1) {
        for (let i: number = 0; i < products_list.length; i++) {
            if (
                products_list[i][2] == "plugin" ||
                products_list[i][2] == "theme"
            ) {
                await product.release_create(
                    products_list[i][1],
                    products_list[i][2]
                );
            } else {
                continue;
            }
        }
    } else {
        console.log("No Product Found");
    }
});

/* ------------------------ Bundle ------------------------ */
test("Bundle Create", async ({ request }) => {
    const product = new ProductPage(request);
    products_list = await product.products_list();

    if (products_list.length > 1) {
        for (let i: number = 0; i < products_list.length; i++) {
            if (
                (products_list[i][2] == "plugin" ||
                    products_list[i][2] == "theme") &&
                products_list[i][3] == 1
            ) {
                products_id.push(products_list[i][0]);
            } else {
                continue;
            }
        }
    } else {
        console.log("No Product Found");
    }

    if (products_id.length > 1) {
        const bundle = new BundlePage(request);
        const bundle_name: string = faker.lorem.words(2); //Auto generated bundle name
        await bundle.bundle_create(bundle_name, products_id);
    } else {
        console.log("Premium Product Not Found");
    }
});

/* ---- Get All Product List ---- */
test("Products List", async ({ request }) => {
    const product = new ProductPage(request);
    products_list = await product.products_list();

    if (products_list.length >= 1) {
        for (let i: number = 0; i < products_list.length; i++) {
            if (products_list[i][3] == 1) {
                premium_products_list.push(products_list[i]);
            }
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

test("Products Hash", async ({ request }) => {
    const product = new ProductPage(request);
    if (premium_products_list.length >= 1) {
        for (let i: number = 0; i < premium_products_list.length; i++) {
            if (premium_products_list[i][2] != "bundle") {
                products_hash.push(
                    await product.products_details(
                        premium_products_list[i][1],
                        premium_products_list[i][2]
                    )
                );
            }
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

/* ---- License Mapping ---- */
test("License Mapping", async ({ request }) => {
    const product = new ProductPage(request);

    if (premium_products_list.length >= 1) {
        for (let i: number = 0; i < premium_products_list.length; i++) {
            await product.license_mapping(
                premium_products_list[i][1],
                selling_platform_name
            );
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

/* ------------------------ Products Variations ------------------------ */
test("Single variation & One Time Payment", async ({ request }) => {
    const product = new ProductPage(request);

    if (premium_products_list.length >= 1) {
        for (let i: number = 0; i < premium_products_list.length; i++) {
            await product.single_variation_single_payment(
                premium_products_list[i][1],
                "1",
                "50"
            );
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

/* ------------------------ Site & Product Mapping ------------------------ */
test("Selling Website & Product Mapping", async ({ request }) => {
    const product = new ProductPage(request);
    api_key = await product.selling_website_api_key(selling_website_url);

    if (api_key == 0) {
        console.log("Selling website not found");
    } else {
        if (
            selling_platform_name == "woocom" ||
            selling_platform_name == "edd"
        ) {
            selling_product_properties = await product.find_selling_product(
                selling_products_name,
                api_key
            );

            if (selling_product_properties.length == 0) {
                console.log("Selling Product Not Found");
            } else {
                const product = new ProductPage(request);
                if (premium_products_list.length >= 1) {
                    for (
                        let i: number = 0;
                        i < premium_products_list.length;
                        i++
                    ) {
                        await product.selling_website_and_product_mapping(
                            api_key,
                            premium_products_list[i][2],
                            premium_products_list[i][1],
                            selling_product_properties
                        );
                    }
                } else {
                    console.log("Premium Product Not Found");
                }
            }
        } else if (selling_platform_name == "fastspring") {
            const fastspring_mapping = new SellingPlatformPage(request);
            await fastspring_mapping.fastspring_mapping(
                selling_platform_name,
                api_key,
                selling_products_name,
                premium_products_list
            );
        } else if (selling_platform_name == "paddle") {
            const paddle_mapping = new SellingPlatformPage(request);
            await paddle_mapping.paddle_mapping(
                selling_platform_name,
                api_key,
                selling_products_name,
                premium_products_list
            );
        } else if (selling_platform_name == "gumroad") {
            const gumroad_mapping = new SellingPlatformPage(request);
            await gumroad_mapping.gumroad_mapping(
                selling_platform_name,
                api_key,
                selling_products_name,
                premium_products_list
            );
        } else if (selling_platform_name == "envato") {
            console.log("Selling platform envato is not covered");
        } else {
            console.log("Invalid Selling Platform");
        }
    }
});

test("Order Create", async ({ request }) => {
    const order = new OrderPage(request);
    if (premium_products_list.length >= 1) {
        for (let i: number = 0; i < premium_products_list.length; i++) {
            if (premium_products_list[i][2] != "bundle") {
                customers_email.push(
                    await order.order_create(
                        premium_products_list[i][2],
                        premium_products_list[i][1]
                    )
                );
            }
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

test("Order Details", async ({ request }) => {
    const order = new OrderPage(request);
    let j: number = 0;
    if (premium_products_list.length >= 1) {
        for (let i: number = 0; i < premium_products_list.length; i++) {
            if (premium_products_list[i][2] != "bundle") {
                orders_id.push(
                    await order.order_id(
                        premium_products_list[i][2],
                        premium_products_list[i][1],
                        customers_email[j]
                    )
                );
                j = j + 1;
            }
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

test("License Key", async ({ request }) => {
    const order = new OrderPage(request);
    let j: number = 0;
    if (premium_products_list.length >= 1) {
        for (let i: number = 0; i < premium_products_list.length; i++) {
            if (premium_products_list[i][2] != "bundle") {
                license_key.push(
                    await order.license_key(
                        premium_products_list[i][2],
                        premium_products_list[i][1],
                        orders_id[j]
                    )
                );
                j++;
            }
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

test("License Activation", async ({ request }) => {
    const order = new OrderPage(request);
    if (products_hash.length >= 1) {
        for (let i: number = 0; i < products_hash.length; i++) {
            await order.license_activation(
                products_hash[i],
                license_key[i],
                "https://wedevsqa.com/"
            );
        }
    } else {
        console.log("Premium Product Not Found");
    }
});

/* ------------------------ Integrations ------------------------ */
/* ---- Mailchimp Integration ---- */
test("Mailchimp Integration", async ({ request }) => {
    const mailchimp_integration = new IntegrationPage(request);
    const mailchimp_connection =
        await mailchimp_integration.mailchimp_connection();

    if (mailchimp_connection == true) {
        const list_id = await mailchimp_integration.mailchimp_lists_id();

        if (products_list.length >= 1) {
            for (let i: number = 0; i < products_list.length; i++) {
                if (products_list[i][2] != "bundle") {
                    await mailchimp_integration.mailchimp_integration(
                        products_list[i][1],
                        products_list[i][2],
                        list_id
                    );
                }
            }
        } else {
            console.log("Premium Product Not Found");
        }
    } else {
        console.log("Mailchimp is not Connected");
    }
});

/* ---- weMail Integration ---- */
test("weMail Integration", async ({ request }) => {
    const weMail_integration = new IntegrationPage(request);
    let flag: boolean;

    const weMail_connection = await weMail_integration.weMail_connection();

    if (weMail_connection == true) {
        flag = true;
    } else {
        let wemail_api_key: string =
            "dbe077a424e47f5ee7e1e71cf04af5bce2ac3e5a34000f325f0ca99aad60f5c5";
        let wemail_api_name: string = "appsero_integration";

        await weMail_integration.connect_weMail(
            wemail_api_key,
            wemail_api_name
        );

        const weMail_new_connection =
            await weMail_integration.weMail_connection();

        if (weMail_new_connection == true) {
            flag = true;
        } else {
            flag = false;
        }
    }

    if (flag == true) {
        let weMail_list_name: string = "appsero_automation";

        const list_id = await weMail_integration.weMail_lists_id(
            weMail_list_name
        );

        if (typeof list_id == "string") {
            if (products_list.length >= 1) {
                for (let i: number = 0; i < products_list.length; i++) {
                    if (products_list[i][2] != "bundle") {
                        await weMail_integration.weMail_integration(
                            products_list[i][1],
                            products_list[i][2],
                            list_id
                        );
                    }
                }
            } else {
                console.log("Premium Product Not Found");
            }
        } else {
            console.log("weMail List Not Found");
        }
    } else {
        console.log("weMail is not Connected");
    }
});

/* ------------------------ Product Delete ------------------------ */
test("Prodcut Delete", async ({ request }) => {
    const product = new ProductPage(request);

    if (products_list.length >= 1) {
        for (let i: number = 0; i < products_list.length; i++) {
            await product.product_delete(
                products_list[i][1],
                products_list[i][2]
            );
        }
    } else {
        console.log("No Product Found");
    }
});
