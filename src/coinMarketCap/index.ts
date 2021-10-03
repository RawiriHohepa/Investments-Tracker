import axios, {AxiosResponse} from "axios";
import {coinMarketCapApiResponse} from "../types/coinMarketCapApi";

export const usdNzdConversion = async () => {
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