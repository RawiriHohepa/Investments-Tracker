const puppeteer = require('puppeteer');
// const getPasscode = require('./test');
const getPasscode = require('./getPasscode');

const balances = async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await login(page);
  // const passcode = await getPasscode();

  await page.screenshot({ path: 'investNow/screenshot.png' });

  // const texts = await page.$$eval('.FGNVV', texts =>
  //   texts.map(text =>
  //     text.textContent
  //   )
  // );
  //
  // const valuesArray = [...texts]
  //   .filter((_, index) => index % 2 === 0); // Remove every second item to remove duplicates
  // valuesArray.splice(-1, 1); // Remove irrelevant item in last position
  //
  // // For every two items, first is key and second is value
  // const valuesObject = {};
  // valuesArray.map((value, index) => {
  //   if (index % 2 === 0) {
  //     valuesObject[value] = valuesArray[index + 1];
  //   }
  // })
  //
  await browser.close();
  // return passcode;
  // return valuesObject;
};

const login = async page => {
  await page.goto(process.env.INVESTNOW_URL);

  await page.type('#input_0', process.env.INVESTNOW_EMAIL);
  await page.type('#input_1', process.env.INVESTNOW_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForSelector('#input_3');
  
  const passcode = await getPasscode();
  await page.type('#input_3', passcode);
  await page.keyboard.press('Enter');

  // await page.waitFor(5000);
  await page.waitForNavigation();
}

module.exports = balances;