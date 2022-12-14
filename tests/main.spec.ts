import { test } from "@playwright/test";
import * as faker from "faker";

import { BundlePage } from "../pages/bundle";
import { DashboardPage } from "../pages/dashboard";
import { IntegrationPage } from "../pages/integrations";
import { LoginPage } from "../pages/login";
import { PluginPage } from "../pages/plugin";
import { ProductPage } from "../pages/products";
import { ThemePage } from "../pages/theme";

const plugins_slug: string[] = [];
const themes_slug: string[] = [];

export let auth: string = "";

/* ------------------------ Login ------------------------ */
test("Login", async ({ request }) => {
  const login = new LoginPage(request);
  const token = await login.login(process.env.USER_NAME, process.env.PASSWORD);
  auth = `Bearer ${token}`;
});

/* ------------------------ Getting Dashboard Details ------------------------ */
test("Getting Dashboard Overview Details", async ({ request }) => {
  const dashboard = new DashboardPage(request);
  await dashboard.overview_details();
});

/* ------------------------ Plugin ------------------------ */
test("Plugin List, Create & Update", async ({ request }) => {
  const plugin = new PluginPage(request);

  // Plugin List
  // await plugin.plugin_list();

  const free_plugin_name: string = faker.lorem.words(2); //Auto generated plugin name
  const pro_plugin_name: string = faker.lorem.words(2); //Auto generated plugin name
  //const platform_name: string = "woocom";

  // Free Plugin Create
  plugins_slug.push(await plugin.free_plugin_create(free_plugin_name));

  // Pro Plugin Create
  plugins_slug.push(await plugin.pro_plugin_create(pro_plugin_name));

  // Plugin Update
  const updateable_plugin_slug: string = ""; //Any existing plugin slug
  // await plugin.plugin_update(updateable_plugin_slug);

  /* All Plugin Update */
  // for (let i: number = 0; i < plugins_slug.length; i++) {
  //     await plugin.plugin_update(plugins_slug[i]);
  // }
  /* All Plugin Update */
  // for (let i: number = 0; i < plugins_slug.length; i++) {
  //     await plugin.plugin_update(plugins_slug[i]);
  // }
});

/* ------------------------ Theme ------------------------ */
test("Theme List, Create & Update", async ({ request }) => {
  const theme = new ThemePage(request);

  // Theme List
  await theme.theme_list();

  const free_theme_name: string = faker.lorem.words(2); //Auto generated theme name
  const pro_theme_name: string = faker.lorem.words(2); //Auto generated theme name

  const website_url: string = "https://modernsound.s3-tastewp.com"; //Website URL through which this theme will be sold
  const product_name: string = "Test Product N2"; //Product Name which will be connected with this theme
  const platform_name: string = "edd";

  // Free Theme Create
  themes_slug.push(await theme.free_theme_create(free_theme_name));

  // Pro Theme Create
  themes_slug.push(await theme.pro_theme_create(pro_theme_name));

  // Theme Update
  const updateable_theme_slug: string = ""; //Any existing theme slug
  const new_theme_name: string = "";

  // await theme.theme_update(updateable_theme_slug, new_theme_name);

  /* All Theme Update */
  // for (let i: number = 0; i < themes_slug.length; i++) {
  //     await theme.theme_update(themes_slug[i], faker.lorem.words(2));
  // }
});

const products_id: string[] = [];

/* ---- Products ID ---- */
test("Products id", async ({ request }) => {
  const product = new ProductPage(request);

  const products_slug = plugins_slug.concat(themes_slug);

  products_id.push(
    await product.product_details(products_slug[1], "plugins"),
    await product.product_details(products_slug[3], "themes")
  );
});

/* ------------------------ Release CRUD ------------------------ */
test("Release CRUD", async ({ request }) => {
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

auth = "";
