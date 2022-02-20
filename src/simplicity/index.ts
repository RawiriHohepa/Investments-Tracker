import puppeteer, { Page } from 'puppeteer'

type Simplicity = {
  conservative?: number;
  growth?: number;
  kiwisaver?: number;
}

const simplicity = async (): Promise<Simplicity> => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await login(page);

  // FIXME For some reason this is needed for all three balances to be scraped successfully.
  await page.screenshot({ path: 'src/simplicity/screenshot.png' });

  const buttonTexts = await page.$$eval(
      'button',
      buttons => (
        buttons.map(button =>
          button.textContent
        )
      )
  ) as unknown as string[];

  const values = buttonTexts
    .slice(3) // Remove unnecessary buttons
    .map(value =>
      value
        .split("$")[1] // Remove account type
        .replace(" ", "") // Remove space after decimal point
    );

  const [kiwisaver, growth, conservative] = values;
  const balances = {
    kiwisaver: kiwisaver ? parseFloat(kiwisaver.replace(",", "")) : undefined,
    growth: growth ? parseFloat(growth.replace(",", "")) : undefined,
    conservative: conservative ? parseFloat(conservative.replace(",", "")) : undefined,
  }

  await browser.close();
  return balances;
};

const login = async (page: Page) => {
  const emailSelector = '[name=email]';
  const passwordSelector = '[name=password]';

  await page.goto("" + process.env.SIMPLICITY_URL);

  await page.type(emailSelector, "" + process.env.SIMPLICITY_EMAIL);
  await page.type(passwordSelector, "" + process.env.SIMPLICITY_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation();
  await page.waitForSelector('h6');
  await page.setViewport({ width: 1500, height: 1000 });
}

export default simplicity;
