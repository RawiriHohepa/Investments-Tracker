import axios from "axios";
import { MarketCoin } from "../types";
import config from "../../config";
import { GetMarketCoinsResponse } from "./types";

export const getMarketCoin = async (symbol: string): Promise<MarketCoin> => {
    return (await getMarketCoins([symbol]))[0];
}

export const getMarketCoins = async (symbols: string[]): Promise<MarketCoin[]> => {
    const usdCoins = await getCoins(symbols, "usd");
    const nzdCoins = await getCoins(symbols, "nzd");

    return usdCoins.map((usdCoin, index) => ({
        id: usdCoin.id,
        symbol: usdCoin.symbol,
        name: usdCoin.name,
        usd: usdCoin.current_price,
        nzd: nzdCoins[index].current_price,
    }));
}

const getCoins = async (symbols: string[], currency: string): Promise<GetMarketCoinsResponse[]> => {
    const response = await axios.get<GetMarketCoinsResponse[]>(
        `${config.COINGECKO_API_URL}${config.COINGECKO_PRICES_ENDPOINT}?ids=${symbols.join(",")}&vs_currency=${currency}`
    );
    return response.data;
}
