import puppeteer, { Page } from "puppeteer";
import config from "../config";
import { scrapeWebpage } from "../utils";

type Simplicity = {
  conservative?: number;
  growth?: number;
  kiwisaver?: number;
}

const simplicity = async (): Promise<Simplicity> => {
  return await scrapeWebpage<Simplicity>({
    url: config.SIMPLICITY_URL,
    login,
    screenshotPath: "src/simplicity/screenshot.png",
    getBalances,
  });
};

const login = async (page: Page) => {
  const emailSelector = "[name=email]";
  const passwordSelector = "[name=password]";
  const balancesSelector = "h6";

  await page.type(emailSelector, "" + process.env.SIMPLICITY_EMAIL);
  await page.type(passwordSelector, "" + process.env.SIMPLICITY_PASSWORD);
  await page.keyboard.press("Enter");

  await page.waitForNavigation();
  await page.waitForSelector(balancesSelector);
}

const getBalances = async (page: Page): Promise<Simplicity> => {
  const buttonTexts = await page.$$eval<string[]>(
      "button",
      buttons => (buttons.map(button => button.textContent))
  ) as unknown as string[];

  const values = buttonTexts
      .slice(3) // Remove unnecessary buttons
      .map(value =>
          parseFloat(value
              .split("$")[1] // Remove account type
              .replace(" ", "") // Remove space after decimal point
              .replace(",", "") // Remove comma
          )
      );

  const [kiwisaver, growth, conservative] = values;
  return { kiwisaver, growth, conservative };
}

export default simplicity;
