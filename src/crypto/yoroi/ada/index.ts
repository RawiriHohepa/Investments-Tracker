import { Coin } from "../../types";
import puppeteer from "puppeteer";
import { getMarketCoin } from "../../prices";
import Platform from "../../Platform";
import config from "../../../config";
import coinSymbols from "../../prices/coinSymbols";

const getAda = async (): Promise<Coin> => {
    const amount = await getAmount();
    const coin = await getMarketCoin(coinSymbols.ADA);

    return {
        coin,
        platform: Platform.YOROI,
        amount,
        usd: {
            price: coin.usd,
            value: amount * coin.usd,
        },
        nzd: {
            price: coin.nzd,
            value: amount * coin.nzd,
        },
    }
}

const getAmount = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`${config.CARDANOSCAN_URL}/${process.env.CARDANOSCAN_STAKE_KEY}`)

    await page.screenshot({ path: 'src/crypto/yoroi/ada/screenshot.png' });

    const adaAmountId = ".adaAmount"
    const adaAmountElementHandle = await page.$eval<string>(adaAmountId, cell => cell.textContent);
    const adaAmountString = adaAmountElementHandle.toString().trim();

    await browser.close();
    return parseFloat(adaAmountString);
}

export default getAda;
