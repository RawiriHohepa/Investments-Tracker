import { Page } from "puppeteer"
import getPasscode from "./getPasscode";
import { InvestNow } from "./types";
import config from "../config";
import { scrapeWebpage } from "../utils";

const investNow = async (): Promise<InvestNow> => {
  return await scrapeWebpage<InvestNow>({
    url: config.INVESTNOW_URL,
    login,
    screenshotPath: "src/investNow/screenshot.png",
    getBalances,
  });
};

const login = async (page: Page) => {
  const emailId = "#input_0";
  const passwordId = "#input_1";
  const passcodeId = "#input_3";

  await page.waitForSelector("input");

  await page.type(emailId, "" + process.env.INVESTNOW_EMAIL);
  await page.type(passwordId, "" + process.env.INVESTNOW_PASSWORD);
  await page.keyboard.press("Enter");

  await page.waitForSelector(passcodeId);

  // Give time for email with login code to be sent
  await page.waitForTimeout(5000);
  const passcode = await getPasscode();
  await page.type(passcodeId, passcode);
  await page.keyboard.press("Enter");

  await page.waitForSelector("td");
}

// FIXME doesn't see cash balance
const getBalances = async (page: Page) => {
  const cells = await page.$$eval(
      "td",
      cells => (cells.map(cell => cell.textContent)),
  ) as unknown as string[];

  const balances: InvestNow = {};
  balances[cells[0]] = {
    Name: cells[1],
    Qty: parseFloat(cells[2].replace(",", "")),
    Price: parseFloat(cells[3].replace(",", "")),
    Value: parseFloat(cells[4].replace(",", "")),
    FX: parseFloat(cells[5].replace(",", "")),
    NZD: parseFloat(cells[6].replace(",", "")),
  };

  return balances;
}

export default investNow;
