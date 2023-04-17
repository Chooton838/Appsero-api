import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import config from "../playwright.config";

import { BundlePage } from "../pages/bundle";
import { DashboardPage } from "../pages/dashboard";
import { IntegrationPage } from "../pages/integrations";
import { LoginPage } from "../pages/login";
import { PluginPage } from "../pages/plugin";
import { ProductPage } from "../pages/products";
import { ThemePage } from "../pages/theme";

const plugins_slug: string[] = [];
const themes_slug: string[] = [];

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
  await dashboard.overview_details();
});

/* ------------------------ Plugin CRUD Functionalities ------------------------ */
test("Get all the Plugins List", async ({ request }) => {
  const plugin = new PluginPage(request);
  await plugin.plugin_list();
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
  // await plugin.plugin_update(plugins_slug[0]);

  /* All Plugin Update */
  for (let i: number = 0; i < plugins_slug.length; i++) {
    await plugin.plugin_update(plugins_slug[i]);
  }
});

/* ------------------------ Theme CRUD Functionalities ------------------------ */
test("Get all the Themes List", async ({ request }) => {
  const theme = new ThemePage(request);
  await theme.theme_list();
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

let products_id: string[] = [];

/* ------------------------ Products ID ------------------------ */
test("Products id", async ({ request }) => {
  const product = new ProductPage(request);
  const products_slug = plugins_slug.concat(themes_slug);

  products_id.push(
    await product.product_details(products_slug[1], "plugins"),
    await product.product_details(products_slug[3], "themes")
  );
});

/* ------------------------ Release CRUD Functionalities ------------------------ */
test("Release Create", async ({ request }) => {
  const product = new ProductPage(request);
  const releaseable_products_list = await product.product_list();

  // const release_versions: string[] = [];
  // const updated_release_versions: string[] = [];

  /* -------- Release Create -------- */
  if (releaseable_products_list.length >= 1) {
    for (let i: number = 0; i < releaseable_products_list.length; i++) {
      await product.release_create(
        releaseable_products_list[i][0],
        releaseable_products_list[i][1]
      );
    }
  } else {
    console.log("No Product Found");
  }

  /* -------- Release Update -------- */
  // for (let i: number = 0; i < products_name.length; i++) {
  //     updated_release_versions.push(await product.release_update(products_name[i], release_versions[i]));
  // }

  // /* -------- Release Delete -------- */
  // for (let i: number = 0; i < products_name.length; i++) {
  //     await product.release_delete(products_name[i], updated_release_versions[i]);
  // }
});

/* ------------------------ Bundle ------------------------ */
test("Bundle Create & Update", async ({ request }) => {
  const bundle = new BundlePage(request);

  //Could be any valid bundle name
  const bundle_name: string = faker.lorem.words(2); //Auto generated bundle name
  const website_url: string = "https://modernsound.s3-tastewp.com"; //Website URL through which this bundle will be sold
  const product_name: string = "Test Product N3"; //Product Name which will be connected with this bundle
  const bundle_products: string[] = [];
  const platform_name: string = "edd";

  await bundle.bundle_create(bundle_name, products_id);

  /* -------- Bundle Update -------- */
  /**
   * updateable_bundle_name = Any valid existing bundle name and this bundle will be updated
   * new_bundle_name = New Bundle Name
   */

  // let updateable_bundle_name: string = ""; //Any valid updateable bundle name
  // let new_bundle_name: string = ""; //Any valid bundle name

  // await bundle.bundle_update(updateable_bundle_name, new_bundle_name);
});

let products_list: string[][] = [];

/* ---- Get All Product List ---- */
test("Product List", async ({ request }) => {
  const product = new ProductPage(request);
  products_list = await product.product_list();
});

/* ---- License Mapping ---- */
test("License Mapping", async ({ request }) => {
  const product = new ProductPage(request);
  const selling_platform_name = "woocom"; // Could be "edd", "gumroad", "paddle", "fastspring"

  if (products_list.length >= 1) {
    await product.license_mapping(products_list[1][0], "woocom");
    await product.license_mapping(products_list[3][0], "edd");
    await product.license_mapping(products_list[4][0], "fastspring");
  } else {
    console.log("No Product Found");
  }
});

/* ------------------------ Products Variations ------------------------ */
test("Single variation & One Time Payment", async ({ request }) => {
  const product = new ProductPage(request);

  if (products_list.length >= 1) {
    await product.single_variation_single_payment(products_list[1][0], 1, 50);
    await product.single_variation_single_payment(products_list[3][0], 1, 35);
    await product.single_variation_single_payment(products_list[4][0], 1, 80);
  } else {
    console.log("No Product Found");
  }
});

/* ------------------------ Integrations ------------------------ */

/* ---- Mailchimp Integration ---- */
test("Mailchimp Integration", async ({ request }) => {
  const mailchimp_integration = new IntegrationPage(request);

  const list_id = await mailchimp_integration.mailchimp_lists_id();

  if (products_list.length >= 1) {
    for (let i: number = 0; i < products_list.length; i++) {
      await mailchimp_integration.mailchimp_integration(
        products_list[i][0],
        products_list[i][1],
        list_id
      );
    }
  } else {
    console.log("No Product Found");
  }
});

/* ------------------------ Product Delete ------------------------ */
test("Prodcut Delete", async ({ request }) => {
  const product = new ProductPage(request);

  if (products_list.length >= 1) {
    for (let i: number = 0; i < products_list.length; i++) {
      await product.product_delete(products_list[i][0], products_list[i][1]);
    }
  } else {
    console.log("No Product Found");
  }
});
