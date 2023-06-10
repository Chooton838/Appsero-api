import { APIRequestContext, expect } from "@playwright/test";
import * as fs from "fs";
import config from "../playwright.config";

export class ThemePage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async themes_list() {
        const theme_list = await this.request.get(
            `${config.use?.baseURL!}/v1/themes`,
            {}
        );

        try {
            expect(theme_list.ok()).toBeTruthy();
            let theme_list_response = await theme_list.json();
            let data: string = JSON.stringify(theme_list_response, null, "\t");
            fs.writeFile("themes_list.json", data, function () {});
        } catch (err) {
            console.log(
                `Response body is: ${await theme_list.body()} & status code is: ${await theme_list.status()}`
            );
            expect(theme_list.ok()).toBeTruthy();
        }
    }

    async free_theme_create(theme_name) {
        const free_theme_create = await this.request.post(
            `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
            {
                data: {
                    name: theme_name,
                    slug: theme_name.split(" ").join("_").toLowerCase(),
                    version: "1.1.1",
                    //'variation_ids':,
                    type: "theme",
                    icon_file: null,
                },
            }
        );

        try {
            expect(free_theme_create.ok()).toBeTruthy();
            let free_theme_create_response = await free_theme_create.json();
            expect(free_theme_create_response.message).toEqual(
                "Added Successfully"
            );
            return theme_name.split(" ").join("_").toLowerCase();
        } catch (err) {
            console.log(
                `Response body is: ${await free_theme_create.body()} & status code is: ${await free_theme_create.status()}`
            );
            expect(free_theme_create.ok()).toBeTruthy();
        }
    }

    async pro_theme_create(theme_name) {
        const pro_theme_create = await this.request.post(
            `${config.use?.baseURL!}/v1/onboarding/basic-information/`,
            {
                data: {
                    name: theme_name,
                    slug: theme_name.split(" ").join("_").toLowerCase(),
                    version: "1.1.1",
                    //'variation_ids':,
                    type: "theme",
                    icon_file: null,
                    premium: 1,
                },
            }
        );

        try {
            expect(pro_theme_create.ok()).toBeTruthy();
            let pro_theme_create_response = await pro_theme_create.json();
            expect(pro_theme_create_response.message).toEqual(
                "Added Successfully"
            );
            return theme_name.split(" ").join("_").toLowerCase();
        } catch (err) {
            console.log(
                `Response body is: ${await pro_theme_create.body()} & status code is: ${await pro_theme_create.status()}`
            );
            expect(pro_theme_create.ok()).toBeTruthy();
        }
    }

    async theme_update(theme_slug) {
        const theme_update = await this.request.put(
            `${config.use?.baseURL!}/v1/themes/${theme_slug}`,
            {
                data: {
                    demo: null,
                    description: "Theme Updated",
                    homepage: null,
                    name: theme_slug,
                    slug: theme_slug,
                    variation_ids: [],
                    version: "1.1.1",
                },
            }
        );

        try {
            expect(theme_update.ok()).toBeTruthy();
            let theme_update_response = await theme_update.json();
            expect(theme_update_response.data.description).toEqual(
                "Theme Updated"
            );
        } catch (err) {
            console.log(
                `Response body is: ${await theme_update.body()} & status code is: ${await theme_update.status()}`
            );
            expect(theme_update.ok()).toBeTruthy();
        }
    }
}
