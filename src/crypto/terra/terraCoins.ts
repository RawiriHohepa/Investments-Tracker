import axios from "axios";
import { getMarketCoins } from "../prices";
import { Coin } from "../types";
import Platform from "../Platform";
import config from "../../config";
import { GetTerraFinderResponse } from "./types";

const denoms = {
    uluna: {
        marketCoin: "LUNA",
        unitsPerCoin: 1000000,
    },
    uusd: {
        marketCoin: "UST",
        unitsPerCoin: 1000000,
    }
}

const terraCoins = async (): Promise<Coin[]> => {
    const response = await axios.get<GetTerraFinderResponse>(`${config.TERRA_API_URL}/${process.env.TERRA_ADDRESS}`);
    const balances = response.data.balance;

    const mappedAmounts = mapToMarketCoins(balances);
    const marketCoins = await getMarketCoins(Object.keys(mappedAmounts));

    const coins: Coin[] = [];
    Object.keys(mappedAmounts).forEach(coinSymbol => {
        const marketCoin = marketCoins.find(c => c.symbol === coinSymbol);
        if (!marketCoin) {
            throw new Error(`Unexpected error in crypto/terra/terraCoins.ts: marketCoin not found.\ncoinSymbol=${coinSymbol}, marketCoins=${JSON.stringify(marketCoins)}`);
        }

        const coin: Coin = {
            coin: marketCoin,
            platform: Platform.TERRA,
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
}

// Map terra coin symbols to corresponding market coin symbols, convert to full coin units
const mapToMarketCoins = (unmappedAmounts: GetTerraFinderResponse["balance"]) => {
    const mappedAmounts: { [marketCoinName: string]: number; } = {};
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
            unrecognisedCoins.push(terraCoin.denom);
            return;
        }

        const amount = parseFloat(terraCoin.available) / denomObj.unitsPerCoin
        if (!!mappedAmounts[denomObj.marketCoin]) {
            // Combine kraken coins that share the same coinmarketcap symbol
            mappedAmounts[denomObj.marketCoin] = mappedAmounts[denomObj] + amount;
        } else {
            mappedAmounts[denomObj.marketCoin] = amount;
        }
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Terra coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding coinmarketcap symbol(s) in crypto/terra/terraCoins.ts`);
    }

    return mappedAmounts;
}

export default terraCoins;
