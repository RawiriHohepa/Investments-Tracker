const puppeteer = require('puppeteer');

const studentLoan = async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await login(page);

  await page.screenshot({ path: 'ird/screenshot.png' });

  const texts = await page.$$eval('.FGNVV', texts =>
    texts.map(text =>
      text.textContent
    )
  );

  const valuesArray = [...texts]
    .filter((_, index) => index % 2 === 0); // Remove every second item to remove duplicates
  valuesArray.splice(-1, 1); // Remove irrelevant item in last position

  // For every two items, first is key and second is value
  const valuesObject = {};
  valuesArray.map((value, index) => {
    if (index % 2 === 0) {
      valuesObject[value] = valuesArray[index + 1];
    }
  })

  await browser.close();
  return valuesObject;
};

const login = async page => {
  await page.goto(process.env.IRD_URL);

  await(await page.$('.my-ir')).click();
  await page.waitForNavigation();

  await page.type('#userid', process.env.IRD_USERNAME);
  await page.type('#password', process.env.IRD_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation();
  await page.waitForSelector('.CaptionLinkText');

  await(await page.$('#caption2_dc-h-2')).click();
  await page.waitForNavigation();
}

module.exports = studentLoan;