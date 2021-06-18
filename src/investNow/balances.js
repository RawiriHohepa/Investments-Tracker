const puppeteer = require('puppeteer');
const getPasscode = require('./getPasscode');

const balances = async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await login(page);

  await page.screenshot({ path: 'src/investNow/screenshot.png' });

  const td = await page.$$eval('td', cells =>
    cells.map(cell =>
      cell.textContent
    )
  );

  // FIXME doesn't work with cash currently being processed
  const balances = {};
  balances[td[0]] = {
    Name: td[1],
    Qty: td[2],
    Price: td[3],
    Value: td[4],
    FX: td[5],
    NZD: td[6],
  };
  // balances[td[8]] = {
  //   Name: td[9],
  //   Qty: td[10],
  //   Price: td[10],
  //   Value: td[12],
  //   FX: td[13],
  //   NZD: td[14],
  // };

  await browser.close();
  return balances;
};

const login = async page => {
  const emailId = '#input_0';
  const passwordId = '#input_1';
  const passcodeId = '#input_3';

  await page.goto(process.env.INVESTNOW_URL);
  await page.waitForSelector('input');

  await page.type(emailId, process.env.INVESTNOW_EMAIL);
  await page.type(passwordId, process.env.INVESTNOW_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForSelector(passcodeId);

  // Give time for email with login code to be sent
  await page.waitFor(2000);
  const passcode = await getPasscode();
  await page.type(passcodeId, passcode);
  await page.keyboard.press('Enter');

  await page.waitForSelector('td');
  await page.setViewport({ height: 1200, width: 1000 });
}

module.exports = balances;