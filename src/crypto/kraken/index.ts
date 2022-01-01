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

        // Find corresponding coinmarketcap symbol for given kraken coin
        const marketCoinSymbol = marketCoinMap[krakenCoinName];
        if (!marketCoinSymbol) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(krakenCoinName);
            return;
        }

        if (!!mappedAmounts[marketCoinSymbol]) {
            // Combine kraken coins that share the same coinmarketcap symbol
            mappedAmounts[marketCoinSymbol] = mappedAmounts[marketCoinSymbol] + parseFloat(unmappedAmounts[krakenCoinName]);
        } else {
            mappedAmounts[marketCoinSymbol] = parseFloat(unmappedAmounts[krakenCoinName]);
        }
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Kraken coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding coinmarketcap symbol(s) in crypto/kraken/marketCoinMap.ts`);
    }

    const marketCoins = await getMarketCoins(Object.keys(mappedAmounts));

    const coins: Coin[] = [];
    Object.keys(mappedAmounts).forEach(coinSymbol => {
        const marketCoin = marketCoins.find(c => c.symbol === coinSymbol);
        if (!marketCoin) {
            throw new Error(`Unexpected error in crypto/kraken/index.ts: marketCoin not found.\ncoinSymbol=${coinSymbol}, marketCoins=${JSON.stringify(marketCoins)}`);
        }

        const coin: Coin = {
            coin: marketCoin,
            platform: Platform.KRAKEN,
            amount: mappedAmounts[coinSymbol],
            usd: {
                price: marketCoin.usd,
                value: mappedAmounts[coinSymbol] * marketCoin.usd,
            },
            nzd: {
                price: marketCoin.nzd,
                value: mappedAmounts[coinSymbol] * marketCoin.nzd,
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
