import { getAmounts } from "./api";
import cmcCoinMap from "./cmcCoinMap";

const kraken = async (): Promise<any> => {
    const unmappedAmounts = await getAmounts();

    // Map kraken coin symbols to coinmarketcap coin symbols
    const mappedAmounts: { [cmcCoinName: string]: number; } = {};
    const unrecognisedCoins: string[] = [];
    Object.keys(unmappedAmounts).forEach(krakenCoinName => {
        // Ignore coins with no amount
        if (!parseFloat(unmappedAmounts[krakenCoinName])) {
            return;
        }

        // Find corresponding coinmarketcap symbol for given kraken coin
        const cmcCoinSymbol = cmcCoinMap[krakenCoinName];
        if (!cmcCoinSymbol) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(krakenCoinName);
            return;
        }

        if (!!mappedAmounts[cmcCoinSymbol]) {
            // Combine kraken coins that share the same coinmarketcap symbol
            mappedAmounts[cmcCoinSymbol] = mappedAmounts[cmcCoinSymbol] + parseFloat(unmappedAmounts[krakenCoinName]);
        } else {
            mappedAmounts[cmcCoinSymbol] = parseFloat(unmappedAmounts[krakenCoinName]);
        }
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Kraken coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding coinmarketcap symbol(s) in crypto/kraken/cmcCoinMap.ts`);
    }

    // TODO retrieve coin prices, calculate values, return in Coin[] format
    return {
        unmappedAmounts,
        mappedAmounts,
    };
};

export default kraken;
