import puppeteer, { Page } from 'puppeteer';

type Ird = { [s: string]: number };

const ird = async (): Promise<Ird> => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await login(page);

  await page.screenshot({ path: 'src/ird/screenshot.png' });

  const texts = await page.$$eval(
      '.FGNVV',
      texts => (
          texts.map(text =>
              text.textContent
          )
      )
  ) as unknown as string[];

  // Remove empty items and every second item to remove duplicates
  const valuesArray = texts.filter((text, index) => !!text && index % 2 === 0);

  // For every two items, first is key and second is value
  const valuesObject: Ird = {};
  valuesArray.forEach((value, index) => {
    if (index % 2 === 0) {
      valuesObject[value] = parseFloat(
          valuesArray[index + 1]
              .replace("$", "")
              .replace(",", "")
      );
    }
  });

  await browser.close();
  return valuesObject;
};

const login = async (page: Page) => {
  const loginButtonClass = '.my-ir';
  const usernameId = '#userid';
  const passwordId = '#password';
  const studentLoanButtonId = '#caption2_Dm-i1-4'


  await page.goto("" + process.env.IRD_URL);

  await(await page.$(loginButtonClass))?.click();
  await page.waitForNavigation();

  await page.type(usernameId, "" + process.env.IRD_USERNAME);
  await page.type(passwordId, "" + process.env.IRD_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation();
  await page.waitForSelector('.CaptionLinkText');

  await(await page.$(studentLoanButtonId))?.click();
  await page.waitForNavigation();
}

export default ird;
