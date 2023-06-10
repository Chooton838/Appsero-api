import { APIRequestContext, expect } from "@playwright/test";
import * as fs from "fs";
import config from "../playwright.config";

export class PluginPage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async plugins_list() {
        const plugin_list = await this.request.get(
            `${config.use?.baseURL!}/v1/plugins`,
            {}
        );

        try {
            expect(plugin_list.ok()).toBeTruthy();
            let plugin_list_response = await plugin_list.json();
            let data: string = JSON.stringify(plugin_list_response, null, "\t");
            fs.writeFile("plugins_list.json", data, function () {});
        } catch (err) {
            console.log(
                `Response body is: ${await plugin_list.body()} & status code is: ${await plugin_list.status()}`
            );
            expect(plugin_list.ok()).toBeTruthy();
        }
    }

    async free_plugin_create(plugin_name) {
        const free_plugin_create = await this.request.post(
            `${config.use?.baseURL!}/v1/onboarding/basic-information`,
            {
                data: {
                    name: plugin_name,
                    slug: plugin_name.split(" ").join("_").toLowerCase(),
                    version: "1.1.1",
                    php: "7.4",
                    requires: "5.6",
                    tested: "6.1",
                    type: "plugin",
                    icon_file: null,
                },
            }
        );

        try {
            expect(free_plugin_create.ok()).toBeTruthy();
            let free_plugin_create_response = await free_plugin_create.json();
            expect(free_plugin_create_response.message).toEqual(
                "Added Successfully"
            );
            return plugin_name.split(" ").join("_").toLowerCase();
        } catch (err) {
            console.log(
                `Response body is: ${await free_plugin_create.body()} & status code is: ${await free_plugin_create.status()}`
            );
            expect(free_plugin_create.ok()).toBeTruthy();
        }
    }

    async pro_plugin_create(plugin_name) {
        const pro_plugin_create = await this.request.post(
            `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
            {
                data: {
                    name: plugin_name,
                    slug: plugin_name.split(" ").join("_").toLowerCase(),
                    version: "1.1.1",
                    php: "7.4",
                    requires: "5.6",
                    tested: "6.1",
                    //'variation_ids':,
                    type: "plugin",
                    icon_file: null,
                    premium: 1,
                },
            }
        );

        try {
            expect(pro_plugin_create.ok()).toBeTruthy();
            let pro_plugin_create_response = await pro_plugin_create.json();
            expect(pro_plugin_create_response.message).toEqual(
                "Added Successfully"
            );
            return plugin_name.split(" ").join("_").toLowerCase();
        } catch (err) {
            console.log(
                `Response body is: ${await pro_plugin_create.body()} & status code is: ${await pro_plugin_create.status()}`
            );
            expect(pro_plugin_create.ok()).toBeTruthy();
        }
    }

    async plugin_update(plugin_slug) {
        const plugin_update = await this.request.put(
            `${config.use?.baseURL!}/v1/plugins/${plugin_slug}`,
            {
                data: {
                    demo: null,
                    description: "Plugin Updated",
                    homepage: null,
                    name: plugin_slug,
                    slug: plugin_slug,
                    variation_ids: [],
                    version: "1.1.1",
                    php: "7.4",
                    requires: "5.6",
                    tested: "6.1",
                },
            }
        );

        try {
            expect(plugin_update.ok()).toBeTruthy();
            let plugin_update_response = await plugin_update.json();
            expect(plugin_update_response.data.description).toEqual(
                "Plugin Updated"
            );
        } catch (err) {
            console.log(
                `Response body is: ${await plugin_update.body()} & status code is: ${await plugin_update.status()}`
            );
            expect(plugin_update.ok()).toBeTruthy();
        }
    }
}
