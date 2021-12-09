import puppeteer, { Page } from 'puppeteer'
import getPasscode from './getPasscode';
import { InvestNow } from "../types/InvestNow";

const balances = async (): Promise<InvestNow> => {
  const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  const page = await browser.newPage();

  await login(page);

  await page.screenshot({ path: 'src/investNow/screenshot.png' });

  const td = await page.$$eval('td', cells => (
          cells.map(cell =>
              cell.textContent
          )
      )
  ) as unknown as string[];

  // FIXME doesn't work with cash currently being processed
  const balances: InvestNow = {};
  balances[td[0]] = {
    Name: td[1],
    Qty: parseFloat(td[2].replace(",", "")),
    Price: parseFloat(td[3].replace(",", "")),
    Value: parseFloat(td[4].replace(",", "")),
    FX: parseFloat(td[5].replace(",", "")),
    NZD: parseFloat(td[6].replace(",", "")),
  };

  // index[td[8]] = {
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

const login = async (page: Page) => {
  const emailId = '#input_0';
  const passwordId = '#input_1';
  const passcodeId = '#input_3';

  await page.goto("" + process.env.INVESTNOW_URL);
  await page.waitForSelector('input');

  await page.type(emailId, "" + process.env.INVESTNOW_EMAIL);
  await page.type(passwordId, "" + process.env.INVESTNOW_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForSelector(passcodeId);

  // Give time for email with login code to be sent
  await page.waitForTimeout(5000);
  const passcode = await getPasscode();
  await page.type(passcodeId, passcode);
  await page.keyboard.press('Enter');

  await page.waitForSelector('td');
  await page.setViewport({ height: 1200, width: 1000 });
}

export default balances;