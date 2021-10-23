import axios, { AxiosResponse } from "axios";
import puppeteer from "puppeteer";

type ErgoApiResponse = {
    "summary": {
        "id": string;
    },
    "transactions": {
        "confirmed": number;
        "totalReceived": number;
        "confirmedBalance": number;
        "totalBalance": number;
        "confirmedTokensBalance": number[];
        "totalTokensBalance": number[];
    }
}

export const ergoApi = async () => {
    const uri = `${process.env.ERGO_API_URL}/${process.env.ERGO_ADDRESS}`;
    const res = await axios.get<null, AxiosResponse<ErgoApiResponse>>(uri);
    return res.data;
};

export const getAdaAmount = async () => {
    const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
    const page = await browser.newPage();
    await page.goto(`${process.env.CARDANOSCAN_URL}${process.env.CARDANOSCAN_STAKE_KEY}`)

    await page.screenshot({ path: 'src/yoroi/screenshot.png' });

    const adaAmountId = ".adaAmount"
    const adaAmountElementHandle = await page.$eval<string>(adaAmountId, cell => cell.textContent);
    const adaAmountString = adaAmountElementHandle.toString().trim();

    await browser.close();
    return parseFloat(adaAmountString);
}