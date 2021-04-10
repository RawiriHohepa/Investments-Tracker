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
  const emailId = '#input_0';
  const passwordId = '#input_1';
  const passcodeId = '#input_3';

  await page.goto(process.env.INVESTNOW_URL);

  await page.type(emailId, process.env.INVESTNOW_EMAIL);
  await page.type(passwordId, process.env.INVESTNOW_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForSelector(passcodeId);
  
  const passcode = await getPasscode();
  await page.type(passcodeId, passcode);
  await page.keyboard.press('Enter');

  await page.waitForSelector('td');
  await page.setViewport({ height: 1200, width: 1000 });
}

module.exports = balances;