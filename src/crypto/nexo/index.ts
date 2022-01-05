import { Coin } from "../types";
import axios from "axios";
import { GetBalancesResponse } from "./types";
import config from "../../config";
import { getMarketCoins } from "../prices";
import Platform from "../Platform";
import coinSymbols from "../prices/coinSymbols";

const nexo = async (nsi: string): Promise<Coin[]> => {
    if (!process.env.NEXO_ZLCMID || !process.env.NEXO_CF_CLEARANCE) {
        throw new Error("Environment Variables not set: NEXO_ZLCMID and/or NEXO_CF_CLEARANCE")
    }

    const getBalancesResponse = await nexoApi(nsi);

    // Map nexo coin symbols to market coin symbols
    const mappedAmounts: { [marketCoinName: string]: number; } = {};
    const unrecognisedCoins: string[] = [];
    getBalancesResponse.balances.forEach(balance => {
        // Ignore coins with no amount
        if (!balance.total_balance) {
            return;
        }

        // Find corresponding market coin for given nexo coin
        const marketCoinId = coinSymbols[balance.currency_identity];
        if (!marketCoinId) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(balance.currency_identity);
            return;
        }

        mappedAmounts[marketCoinId] = balance.total_balance;
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Nexo coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin symbol(s) in crypto/coinSymbols.ts`);
    }

    const marketCoins = await getMarketCoins(Object.keys(mappedAmounts));

    const coins: Coin[] = [];
    Object.keys(mappedAmounts).forEach(coinId => {
        const marketCoin = marketCoins.find(c => c.id === coinId);
        if (!marketCoin) {
            throw new Error(`Unexpected error in crypto/nexo/index.ts: marketCoin not found.\ncoinId=${coinId}\nmarketCoins=${JSON.stringify(marketCoins)}`);
        }

        const coin: Coin = {
            coin: marketCoin,
            platform: Platform.NEXO,
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
}

const nexoApi = async (nsi: string) => {
    const cookie = `__zlcmid=${process.env.NEXO_ZLCMID}; cf_clearance=${process.env.NEXO_CF_CLEARANCE}; nsi=${nsi};`;
    const url = "" + config.NEXO_API_URL + config.NEXO_API_BALANCES_ENDPOINT;
    const res = await axios.post<GetBalancesResponse>(url, {}, {
        headers: {
            cookie
        }
    });
    return res.data.payload;
}

export default nexo;
