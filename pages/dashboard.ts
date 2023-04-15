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
          start_date: "2023-01-03",
          end_date: "2023-31-03",
          comparing_to: "month",
        },
      }
    );

    expect(overview_details.status()).toBeTruthy();

    try {
      let overview_details_response = await overview_details.json();
      delete overview_details_response.performance_graph;
      let data: string = JSON.stringify(overview_details_response, null, "\t");
      fs.writeFile("overview stats.json", data, function () {});
    } catch (err) {
      console.log(
        "Error of Dashboard Overview Request is: ",
        overview_details.statusText()
      );
    }
  }
}
