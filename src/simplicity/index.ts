import puppeteer, { Page } from "puppeteer";

type Simplicity = {
  conservative?: number;
  growth?: number;
  kiwisaver?: number;
}

const simplicity = async (): Promise<Simplicity> => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await login(page);
  await page.screenshot({ path: "src/simplicity/screenshot.png" });
  const balances: Simplicity = await retrieveBalances(page);

  await browser.close();
  return balances;
};

const login = async (page: Page) => {
  const emailSelector = "[name=email]";
  const passwordSelector = "[name=password]";
  const balancesSelector = "h6";

  await page.goto("" + process.env.SIMPLICITY_URL);

  await page.type(emailSelector, "" + process.env.SIMPLICITY_EMAIL);
  await page.type(passwordSelector, "" + process.env.SIMPLICITY_PASSWORD);
  await page.keyboard.press("Enter");

  await page.waitForNavigation();
  await page.waitForSelector(balancesSelector);
}

const retrieveBalances = async (page: Page): Promise<Simplicity> => {
  const buttonTexts = await page.$$eval<string[]>(
      "button",
      buttons => (
          buttons.map(button => button.textContent)
      )
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
