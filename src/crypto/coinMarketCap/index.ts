import axios from "axios";
import { CmcCoin } from "../types";
import config from "../../config";
import {
    LatestQuotesResponseUsd,
    LatestQuotesResponseNzd,
    LatestQuotesResponseCoinUsd,
    LatestQuotesResponseCoinNzd,
} from "./types";

export const getCmcCoin = async (symbol: string): Promise<CmcCoin> => {
    return (await getCmcCoins([symbol]))[0];
}

export const getCmcCoins = async (symbols: string[]): Promise<CmcCoin[]> => {
    const usdCoins = await getUsdCoins(symbols);
    const nzdCoins = await getNzdCoins(symbols);

    return usdCoins.map((usdCoin, index) => ({
        id: usdCoin.id,
        symbol: usdCoin.symbol,
        name: usdCoin.name,
        slug: usdCoin.slug,
        usd: usdCoin.quote.USD.price,
        nzd: nzdCoins[index].quote.NZD.price,
    }));
}

const getUsdCoins = async (symbols: string[]): Promise<LatestQuotesResponseCoinUsd[]> => {
    const url = `${config.COINMARKETCAP_API_URL}${config.COINMARKETCAP_QUOTES_ENDPOINT}?symbol=${symbols.join(",")}`;
    const res = await axios.get<LatestQuotesResponseUsd>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    return symbols.map(symbol => res.data.data[symbol]);
}

const getNzdCoins = async (symbols: string[]): Promise<LatestQuotesResponseCoinNzd[]> => {
    const url = `${config.COINMARKETCAP_API_URL}${config.COINMARKETCAP_QUOTES_ENDPOINT}?symbol=${symbols.join(",")}&convert=nzd`;
    const res = await axios.get<LatestQuotesResponseNzd>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    return symbols.map(symbol => res.data.data[symbol]);
}