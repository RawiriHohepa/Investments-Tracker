export {};
const puppeteer = require('puppeteer');

const balances = async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await login(page);

  // FIXME For some reason this is needed for all three balances to be scraped successfully.
  await page.screenshot({ path: 'src/simplicity/screenshot.png' });

  const buttonTexts = await page.$$eval('button', buttons =>
    buttons.map(button =>
      button.textContent
    )
  );

  const values = [...buttonTexts]
    .slice(2) // Remove unnecessary buttons
    .map(value =>
      value
        .split("$")[1] // Remove account type
        .replace(" ", "") // Remove space after decimal point
    );

  const balances = {
    kiwisaver: values[0],
    growth: values[1],
    conservative: values[2],
  }

  await browser.close();
  return balances;
};

const login = async page => {
  const emailId = '#email';
  const passwordId = '#password';

  await page.goto(process.env.SIMPLICITY_URL);

  await page.type(emailId, process.env.SIMPLICITY_EMAIL);
  await page.type(passwordId, process.env.SIMPLICITY_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation();
  await page.waitForSelector('h6');
  await page.setViewport({ width: 1500, height: 1000 });
}

module.exports = balances;