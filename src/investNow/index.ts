import puppeteer, { Page } from "puppeteer"
import getPasscode from "./getPasscode";
import { InvestNow } from "./types";
import config from "../config";

const investNow = async (): Promise<InvestNow> => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await login(page);
  await page.screenshot({ path: "src/investNow/screenshot.png" });

  const balances = await getBalances(page);

  await browser.close();
  return balances;
};

const login = async (page: Page) => {
  const emailId = "#input_0";
  const passwordId = "#input_1";
  const passcodeId = "#input_3";

  await page.goto("" + config.INVESTNOW_URL);
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
