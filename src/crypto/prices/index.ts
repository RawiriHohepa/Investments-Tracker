import axios from "axios";
import { Coin, CoinInfo, CoinWithoutPrice } from "../types";
import config from "../../config";
import { GetMarketCoinsResponse } from "./types";

export const getCoins = async (
    coinsWithoutPrices: CoinWithoutPrice[],
): Promise<Coin[]> => {
    const coinInfos = await getCoinInfos(coinsWithoutPrices.map(coin => coin.id));

    const coins: Coin[] = [];
    coinsWithoutPrices.forEach(coinWithoutPrice => {
        const coinInfo = coinInfos.find(c => c.id === coinWithoutPrice.id);
        if (!coinInfo) {
            // TODO update error message
            throw new Error(`Unexpected error: marketCoin not found.\ncoinId=${coinWithoutPrice.id}\nmarketCoins=${JSON.stringify({ coinsWithoutPrices, coinInfos })}`);
        }

        const coin: Coin = {
            coin: coinInfo,
            platform: coinWithoutPrice.platform,
            amount: coinWithoutPrice.amount,
            usd: {
                price: coinInfo.usd,
                value: coinInfo.usd * coinWithoutPrice.amount,
            },
            nzd: {
                price: coinInfo.nzd,
                value: coinInfo.nzd * coinWithoutPrice.amount,
            },
        }

        // Do not return coins with very small values
        if (coin.usd.value > config.CRYPTO_MINIMUM_VALUE) {
            coins.push(coin);
        }
    });
    return coins;
}

const getCoinInfos = async (symbols: string[]): Promise<CoinInfo[]> => {
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
