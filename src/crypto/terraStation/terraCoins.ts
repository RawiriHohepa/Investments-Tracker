import axios from "axios";
import { getCmcCoins } from "../coinMarketCap";
import { Coin } from "../types";
import Platform from "../Platform";
import config from "../../config";

const denoms = {
    uluna: {
        cmcCoin: "LUNA",
        unitsPerCoin: 1000000,
    },
    uusd: {
        cmcCoin: "UST",
        unitsPerCoin: 1000000,
    }
}

const terraCoins = async (): Promise<Coin[]> => {
    // TODO add schema for response
    const response = await axios.get(`https://fcd.terra.dev/v1/bank/${process.env.TERRA_STATION_ADDRESS}`);
    const balances = response.data.balance;

    const mappedAmounts = mapToCmcCoins(balances);
    const cmcCoins = await getCmcCoins(Object.keys(mappedAmounts));

    const coins: Coin[] = [];
    Object.keys(mappedAmounts).forEach(coinSymbol => {
        const cmcCoin = cmcCoins.find(c => c.symbol === coinSymbol);
        if (!cmcCoin) {
            throw new Error(`Unexpected error in crypto/terraStation/terraCoins.ts: cmcCoin not found.\ncoinSymbol=${coinSymbol}, cmcCoins=${JSON.stringify(cmcCoins)}`);
        }

        const coin: Coin = {
            coin: cmcCoin,
            platform: Platform.TERRA_STATION,
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
}

// Map terra coin symbols to coinmarketcap coin symbols, convert to full coin units
const mapToCmcCoins = (unmappedAmounts) => {
    const mappedAmounts: { [cmcCoinName: string]: number; } = {};
    const unrecognisedCoins: string[] = [];
    unmappedAmounts.forEach(terraCoin => {
        // Ignore coins with no amount
        if (!parseFloat(terraCoin.available)) {
            return;
        }

        // Find corresponding coinmarketcap symbol for given terra coin
        const denomObj = denoms[terraCoin.denom];
        if (!denomObj) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(terraCoin);
            return;
        }

        const amount = parseFloat(terraCoin.available) / denomObj.unitsPerCoin
        if (!!mappedAmounts[denomObj.cmcCoin]) {
            // Combine kraken coins that share the same coinmarketcap symbol
            mappedAmounts[denomObj.cmcCoin] = mappedAmounts[denomObj] + amount;
        } else {
            mappedAmounts[denomObj.cmcCoin] = amount;
        }
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Terra coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding coinmarketcap symbol(s) in crypto/terraStation/terraCoins.ts`);
    }

    return mappedAmounts;
}

export default terraCoins;
