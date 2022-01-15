import { getAmounts } from "./api";
import marketCoinMap from "./marketCoinMap";
import { CoinWithoutPrice } from "../types";
import { GetAmountsResponse } from "./types";
import CoinId from "../CoinId";
import Platform from "../Platform";

const kraken = async (): Promise<CoinWithoutPrice[]> => mapAmounts(await getAmounts());

const mapAmounts = (unmappedAmounts: GetAmountsResponse): CoinWithoutPrice[] => {
    const uniqueAmounts: { [coinId: string]: number } = {};
    const unrecognisedCoins: string[] = [];
    Object.keys(unmappedAmounts).forEach(krakenCoinName => {
        // Ignore coins with no amount
        if (!parseFloat(unmappedAmounts[krakenCoinName])) {
            return;
        }

        // Find corresponding market coin
        const coinId = marketCoinMap[krakenCoinName];
        if (!coinId) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(krakenCoinName);
            return;
        }

        // Combine kraken coins that share the same market coin
        if (!!uniqueAmounts[coinId]) {
            uniqueAmounts[coinId] = uniqueAmounts[coinId] + parseFloat(unmappedAmounts[krakenCoinName]);
        } else {
            uniqueAmounts[coinId] = parseFloat(unmappedAmounts[krakenCoinName]);
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
