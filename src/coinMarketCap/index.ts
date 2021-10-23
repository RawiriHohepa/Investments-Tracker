import axios, {AxiosResponse} from "axios";
import { coinMarketCapApiResponse } from "../types/coinMarketCapApi";

export const ADA_ID = 2010;
export const ERG_ID = 1762;
export const ALGO_ID = 4030;
export const XMR_ID = 328;
const USDC_ID = 3408;

export const getUsdNzdConversion = async () => {
    const url = `${process.env.COINMARKETCAP_API_URL}${process.env.COINMARKETCAP_QUOTES_ENDPOINT}?id=${USDC_ID}&convert=NZD`;

    const res = await axios.get<null, AxiosResponse<coinMarketCapApiResponse>>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    const coinMarketCapCoins = res.data.data;

    return coinMarketCapCoins[USDC_ID].quote.NZD.price;
}

type Prices = {
    [id: string]: number
}

export const getCmcPrices = async (ids: number[]): Promise<Prices> => {
    const idsCsv = ids.join(",");
    const url = `${process.env.COINMARKETCAP_API_URL}${process.env.COINMARKETCAP_QUOTES_ENDPOINT}?id=${idsCsv}`;

    const res = await axios.get<null, AxiosResponse<coinMarketCapApiResponse>>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    const coinMarketCapCoins = res.data.data;

    const prices = {};
    ids.forEach(id => {
        prices[id] = coinMarketCapCoins[id].quote.USD.price;
    });
    return prices;
}