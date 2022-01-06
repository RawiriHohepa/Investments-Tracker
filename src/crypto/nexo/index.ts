import { Coin } from "../types";
import axios from "axios";
import { GetBalancesResponse } from "./types";
import config from "../../config";
import { getCoins } from "../prices";
import Platform from "../Platform";
import coinSymbols from "../prices/coinSymbols";

const nexo = async (nsi: string): Promise<Coin[]> => {
    if (!process.env.NEXO_ZLCMID || !process.env.NEXO_CF_CLEARANCE) {
        throw new Error("Environment Variables not set: NEXO_ZLCMID and/or NEXO_CF_CLEARANCE")
    }

    const getBalancesResponse = await nexoApi(nsi);
    const mappedAmounts = mapAmounts(getBalancesResponse);
    return await getCoins(mappedAmounts, Platform.NEXO);
}

const mapAmounts = (getBalancesResponse) => {
    // Map nexo coin symbols to market coin symbols
    const mappedAmounts: { [coin: string]: number; } = {};
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
    return mappedAmounts;
}

// TODO add response schema
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
