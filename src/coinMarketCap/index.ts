import axios from "axios";
import { CmcCoin } from "../crypto/types";
import config from "../config";
import { LatestQuotesResponseUsd, LatestQuotesResponseNzd } from "./types";

export const getCmcCoin: (symbol: string) => Promise<CmcCoin> = async (symbol: string) => {
    const usdCoin = await getUsdCoin(symbol);
    const nzdCoin = await getNzdPrice(symbol);

    return {
        id: usdCoin.id,
        symbol: usdCoin.symbol,
        name: usdCoin.name,
        slug: usdCoin.slug,
        usd: usdCoin.quote.USD.price,
        nzd: nzdCoin.quote.NZD.price,
    }
}

const getUsdCoin = async (symbol: string) => {
    const url = `${config.COINMARKETCAP_API_URL}${config.COINMARKETCAP_QUOTES_ENDPOINT}?symbol=${symbol}`;
    const res = await axios.get<LatestQuotesResponseUsd>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    return res.data.data[symbol];
}

const getNzdPrice = async (symbol: string) => {
    const url = `${config.COINMARKETCAP_API_URL}${config.COINMARKETCAP_QUOTES_ENDPOINT}?symbol=${symbol}&convert=nzd`;
    const res = await axios.get<LatestQuotesResponseNzd>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    return res.data.data[symbol];
}
