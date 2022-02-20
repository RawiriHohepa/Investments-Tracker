import { Page } from "puppeteer";
import config from "../../../config";
import { scrapeWebpage } from "../../../utils";

const getAmount = async (): Promise<number> => {
    if (!process.env.CARDANOSCAN_STAKE_KEY) {
        throw new Error("CARDANOSCAN_STAKE_KEY key not found in .env file");
    }

    return await scrapeWebpage<number>({
        url: `${config.CARDANOSCAN_URL}/${process.env.CARDANOSCAN_STAKE_KEY}`,
        screenshotPath: "src/crypto/yoroi/ada/screenshot.png",
        getBalances,
    });
}

const getBalances = async (page: Page) => {
    const adaAmountId = ".adaAmount";

    const adaAmountElementHandle = await page.$eval<string>(adaAmountId, cell => cell.textContent);
    const adaAmountString = adaAmountElementHandle.toString().trim();

    return parseFloat(adaAmountString);
}

export default getAmount;
