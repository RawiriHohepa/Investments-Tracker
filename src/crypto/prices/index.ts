import axios from "axios";
import { Coin, MarketCoin } from "../types";
import config from "../../config";
import { GetMarketCoinsResponse } from "./types";
import Platform from "../Platform";

export const getCoins = async (
    mappedAmounts: { [coin: string]: number },
    platform: Platform,
): Promise<Coin[]> => {
    const marketCoins = await getMarketPrices(Object.keys(mappedAmounts));

    const coins: Coin[] = [];
    Object.keys(mappedAmounts).forEach(coinId => {
        const marketCoin = marketCoins.find(c => c.id === coinId);
        if (!marketCoin) {
            // TODO update error message
            throw new Error(`Unexpected error: marketCoin not found.\ncoinId=${coinId}\nmarketCoins=${JSON.stringify(marketCoins)}`);
        }

        const coin: Coin = {
            coin: marketCoin,
            platform,
            amount: mappedAmounts[coinId],
            usd: {
                price: marketCoin.usd,
                value: mappedAmounts[coinId] * marketCoin.usd,
            },
            nzd: {
                price: marketCoin.nzd,
                value: mappedAmounts[coinId] * marketCoin.nzd,
            },
        }

        // Do not return coins with very small values
        if (coin.usd.value > config.CRYPTO_MINIMUM_VALUE) {
            coins.push(coin);
        }
    });
    return coins;
}

const getMarketPrices = async (symbols: string[]): Promise<MarketCoin[]> => {
    const usdCoins = await getCoinGeckoPrices(symbols, "usd");
    const nzdCoins = await getCoinGeckoPrices(symbols, "nzd");

    return usdCoins.map((usdCoin, index) => ({
        id: usdCoin.id,
        symbol: usdCoin.symbol,
        name: usdCoin.name,
        usd: usdCoin.current_price,
        nzd: nzdCoins[index].current_price,
    }));
}

const getCoinGeckoPrices = async (symbols: string[], currency: string): Promise<GetMarketCoinsResponse[]> => {
    const response = await axios.get<GetMarketCoinsResponse[]>(
        `${config.COINGECKO_API_URL}${config.COINGECKO_PRICES_ENDPOINT}?ids=${symbols.join(",")}&vs_currency=${currency}`
    );
    return response.data;
}
