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
          start_date: "2022-12-01",
          end_date: "2022-12-31",
          comparing_to: "month",
        },
      }
    );

    expect(overview_details.status()).toBeTruthy();

    const overview_details_response = await overview_details.json();
    delete overview_details_response.performance_graph;

    let data: string = JSON.stringify(overview_details_response, null, "\t");

    fs.writeFile("overview stats.json", data, function () {});
  }
}
