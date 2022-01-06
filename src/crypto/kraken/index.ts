import { getAmounts } from "./api";
import marketCoinMap from "./marketCoinMap";
import { getCoins } from "../prices";
import { Coin } from "../types";
import Platform from "../Platform";
import { GetAmountsResponse } from "./types";

const kraken = async (): Promise<Coin[]> => {
    const unmappedAmounts = await getAmounts();
    const mappedAmounts = mapAmounts(unmappedAmounts);
    return await getCoins(mappedAmounts, Platform.KRAKEN);
};

const mapAmounts = (unmappedAmounts: GetAmountsResponse): { [coin: string]: number } => {
    // Map kraken coin symbols to market coin symbols
    const mappedAmounts: { [coin: string]: number; } = {};
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

    return mappedAmounts;
}

export default kraken;
