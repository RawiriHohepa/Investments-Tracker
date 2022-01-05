import { getAmounts } from "./api";
import marketCoinMap from "./marketCoinMap";
import { getMarketCoins } from "../prices";
import { Coin } from "../types";
import Platform from "../Platform";
import config from "../../config";

const kraken = async (): Promise<Coin[]> => {
    const unmappedAmounts = await getAmounts();

    // Map kraken coin symbols to market coin symbols
    const mappedAmounts: { [marketCoinName: string]: number; } = {};
    const unrecognisedCoins: string[] = [];
    Object.keys(unmappedAmounts).forEach(krakenCoinName => {
        // Ignore coins with no amount
        if (!parseFloat(unmappedAmounts[krakenCoinName])) {
            return;
        }

        // Find corresponding market coin for given kraken coin
        const marketCoinId = marketCoinMap[krakenCoinName];
        if (!marketCoinId) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(krakenCoinName);
            return;
        }

        if (!!mappedAmounts[marketCoinId]) {
            // Combine kraken coins that share the same market coin
            mappedAmounts[marketCoinId] = mappedAmounts[marketCoinId] + parseFloat(unmappedAmounts[krakenCoinName]);
        } else {
            mappedAmounts[marketCoinId] = parseFloat(unmappedAmounts[krakenCoinName]);
        }
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Kraken coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin symbol(s) in crypto/kraken/marketCoinMap.ts`);
    }

    const marketCoins = await getMarketCoins(Object.keys(mappedAmounts));

    const coins: Coin[] = [];
    Object.keys(mappedAmounts).forEach(coinId => {
        const marketCoin = marketCoins.find(c => c.id === coinId);
        if (!marketCoin) {
            throw new Error(`Unexpected error in crypto/kraken/index.ts: marketCoin not found.\ncoinId=${coinId}\nmarketCoins=${JSON.stringify(marketCoins)}`);
        }

        const coin: Coin = {
            coin: marketCoin,
            platform: Platform.KRAKEN,
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
};

export default kraken;
