const puppeteer = require('puppeteer');

const puppeteerFunc = async () => {
  const browser = await puppeteer.launch({ executablePath: "/opt/homebrew/bin/chromium" });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});

  await browser.close();
};

module.exports = puppeteerFunc;