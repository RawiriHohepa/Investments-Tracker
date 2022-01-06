import { getAmounts } from "./api";
import marketCoinMap from "./marketCoinMap";
import { getCoins } from "../prices";
import { Coin, CoinWithoutPrice } from "../types";
import { GetAmountsResponse } from "./types";
import CoinId from "../CoinId";
import Platform from "../Platform";

const kraken = async (): Promise<Coin[]> => {
    const unmappedAmounts = await getAmounts();
    const coinsWithoutPrices = mapAmounts(unmappedAmounts);
    return await getCoins(coinsWithoutPrices);
}

const mapAmounts = (unmappedAmounts: GetAmountsResponse): CoinWithoutPrice[] => {
    // Map kraken coin symbols to market coin symbols
    const uniqueAmounts: { [coin: string]: number; } = {};
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

        if (!!uniqueAmounts[marketCoinId]) {
            // Combine kraken coins that share the same market coin
            uniqueAmounts[marketCoinId] = uniqueAmounts[marketCoinId] + parseFloat(unmappedAmounts[krakenCoinName]);
        } else {
            uniqueAmounts[marketCoinId] = parseFloat(unmappedAmounts[krakenCoinName]);
        }
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Kraken coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin symbol(s) in crypto/kraken/marketCoinMap.ts`);
    }

    return Object.keys(uniqueAmounts).map(coinId => ({
        id: coinId as CoinId,
        platform: Platform.KRAKEN,
        amount: uniqueAmounts[coinId],
    }));
}

export default kraken;
