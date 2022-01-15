import axios from "axios";
import { Coin, MarketCoinInfo, CoinWithoutPrice } from "../types";
import config from "../../config";
import { GetMarketCoinsResponse } from "./types";

export const getCoins = async (coinsWithoutPrices: CoinWithoutPrice[]): Promise<Coin[]> => {
    const coinInfos = await getCoinInfos(coinsWithoutPrices.map(coin => coin.id));

    const coins: Coin[] = [];
    coinsWithoutPrices.forEach(coinWithoutPrice => {
        const coinInfo = coinInfos.find(c => c.id === coinWithoutPrice.id);
        if (!coinInfo) {
            throw new Error(`Invalid coinId: ${coinWithoutPrice.id}. Please correct the mapping in crypto/CoinId.ts`);
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
        };

        // Do not return coins with small values
        if (coin.usd.value > config.CRYPTO_MINIMUM_VALUE) {
            coins.push(coin);
        }
    });
    return coins;
}

const getCoinInfos = async (ids: string[]): Promise<MarketCoinInfo[]> => {
    const usdCoins = await getCoinGeckoPrices(ids, "usd");
    const nzdCoins = await getCoinGeckoPrices(ids, "nzd");

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
