import puppeteer from "puppeteer";
import config from "../../../config";

const getAmount = async (): Promise<number> => {
    if (!process.env.CARDANOSCAN_STAKE_KEY) {
        throw new Error("CARDANOSCAN_STAKE_KEY key not found in .env file");
    }

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

export default getAmount;
