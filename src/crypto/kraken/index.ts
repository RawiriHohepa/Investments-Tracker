import { getAmounts } from "./api";
import cmcCoinMap from "./cmcCoinMap";
import { getCmcCoins } from "../coinMarketCap";
import { Coin } from "../types";
import Platform from "../Platform";
import config from "../../config";

const kraken = async (): Promise<Coin[]> => {
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

    const cmcCoins = await getCmcCoins(Object.keys(mappedAmounts));

    const coins: Coin[] = [];
    Object.keys(mappedAmounts).forEach(coinSymbol => {
        const cmcCoin = cmcCoins.find(c => c.symbol === coinSymbol);
        if (!cmcCoin) {
            throw new Error(`Unexpected error in crypto/kraken/index.ts: cmcCoin not found.\ncoinSymbol=${coinSymbol}, cmcCoins=${JSON.stringify(cmcCoins)}`);
        }

        const coin: Coin = {
            coin: cmcCoin,
            platform: Platform.KRAKEN,
            amount: mappedAmounts[coinSymbol],
            usd: {
                price: cmcCoin.usd,
                value: mappedAmounts[coinSymbol] * cmcCoin.usd,
            },
            nzd: {
                price: cmcCoin.nzd,
                value: mappedAmounts[coinSymbol] * cmcCoin.nzd,
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
