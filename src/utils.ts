import puppeteer, { Page } from "puppeteer";

export const scrapeWebpage = async <T>(params: {
    url: string;
    login?: (page: Page) => Promise<void>;
    screenshotPath: string;
    getBalances: (page: Page) => Promise<T>;
}): Promise<T> => {
    if (!process.env.PUPPETEER_EXECUTABLE_PATH) {
        throw new Error("PUPPETEER_EXECUTABLE_PATH key not found in .env file");
    }

    const browser = await puppeteer.launch({ executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(params.url);

    if (params.login) await params.login(page);
    if (params.screenshotPath) await page.screenshot({ path: params.screenshotPath });

    const balances = await params.getBalances(page);

    await browser.close();
    return balances;
}