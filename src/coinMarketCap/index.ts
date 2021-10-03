import axios, {AxiosResponse} from "axios";
import { coinMarketCapApiResponse } from "../types/coinMarketCapApi";

export const ADA_ID = 2010;
export const ERG_ID = 1762;

export const getUsdNzdConversion = async () => {
    const usdcId = 3408
    const url = `${process.env.COINMARKETCAP_API_URL}${process.env.COINMARKETCAP_QUOTES_ENDPOINT}?id=${usdcId}&convert=NZD`;
    const res = await axios.get<null, AxiosResponse<coinMarketCapApiResponse>>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    const coinMarketCapCoins = res.data.data;

    return coinMarketCapCoins[usdcId].quote.NZD.price;
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