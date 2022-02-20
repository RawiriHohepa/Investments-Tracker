import { Page } from "puppeteer";
import config from "../config";
import { scrapeWebpage } from "../utils";

type Ird = {
  "Compulsory fees": number;
  "Living costs": number;
  "Course related costs": number;
  "Establishment fees": number;
  "Salary/Wage deductions": number;
  "Total loan balance": number;
}

const ird = async (): Promise<Ird> => {
  return await scrapeWebpage<Ird>({
    url: config.IRD_URL,
    login,
    screenshotPath: "src/ird/screenshot.png",
    getBalances,
  });
};

const login = async (page: Page) => {
  const myIrButtonClass = ".my-ir";
  const usernameId = "#userid";
  const passwordId = "#password";
  const linksSelector = ".IconCaptionText";
  const studentLoanButtonId = "#caption2_Dm-i1-4";

  const myIrButton = await page.$(myIrButtonClass);
  await myIrButton?.click();
  await page.waitForNavigation();

  await page.type(usernameId, "" + process.env.IRD_USERNAME);
  await page.type(passwordId, "" + process.env.IRD_PASSWORD);
  await page.keyboard.press("Enter");

  await page.waitForNavigation();
  await page.waitForSelector(linksSelector);

  const studentLoanButton = await page.$(studentLoanButtonId);
  await studentLoanButton?.click();
  await page.waitForNavigation();
}

const getBalances = async (page: Page): Promise<Ird> => {
  const textSelector = ".FGNVV";
  const texts = await page.$$eval(
      textSelector,
      texts => (texts.map(text => text.textContent))
  ) as unknown as string[];

  // Remove empty items and every second item to remove duplicates
  const balancesArray = texts.filter((text, index) => !!text && index % 2 === 0);

  // For every two items, first is key and second is value
  const balancesObject = {};
  balancesArray.forEach((value, index) => {
    if (index % 2 === 0) {
      balancesObject[value] = parseFloat(
          balancesArray[index + 1]
              .replace("$", "")
              .replace(",", "")
      );
    }
  });

  return balancesObject as Ird;
}

export default ird;
