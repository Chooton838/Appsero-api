import { APIRequestContext, expect } from "@playwright/test";
import * as fs from "fs";
import config from "../playwright.config";

export class DashboardPage {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async overview_details() {
        const overview_details = await this.request.get(
            `${config.use?.baseURL!}/v1/overview`,
            {
                data: {
                    start_date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-01`, //yyyy-mm-dd
                    end_date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()}`, //yyyy-mm-dd
                    comparing_to: "month",
                },
            }
        );

        let overview_details_response;

        try {
            expect(overview_details.ok()).toBeTruthy();
            overview_details_response = await overview_details.json();
            delete overview_details_response.performance_graph;
            let data: string = JSON.stringify(
                overview_details_response,
                null,
                "\t"
            );
            fs.writeFile("overview stats.json", data, function () {});
        } catch (err) {
            console.log(
                `Response body is: ${await overview_details.body()} & status code is: ${await overview_details.status()}`
            );
            expect(overview_details.ok()).toBeTruthy();
        }
        return overview_details_response.plugins;
    }
}
