const puppeteer = require('puppeteer');

const puppeteerFunc = async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await page.goto('https://app.simplicity.kiwi/login');

  await page.type('#email', process.env.SIMPLICITY_EMAIL);
  await page.type('#password', process.env.SIMPLICITY_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation();

  await page.screenshot({path: 'example.png'});

  await browser.close();
};

module.exports = puppeteerFunc;