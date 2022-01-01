import { Coin } from "../types";
import axios from "axios";
import { GetBalancesResponse } from "./types";
import config from "../../config";
import { getMarketCoins } from "../prices";
import Platform from "../Platform";

const nexo = async (nsi: string): Promise<Coin[]> => {
    if (!process.env.NEXO_ZLCMID || !process.env.NEXO_CF_CLEARANCE) {
        throw new Error("Environment Variables not set: NEXO_ZLCMID and/or NEXO_CF_CLEARANCE")
    }

    const getBalancesResponse = await nexoApi(nsi);
    // Ignore balances that are zero or have very small values
    const balances = getBalancesResponse.balances.filter(balance => balance.total_balance * balance.usd_course > config.CRYPTO_MINIMUM_VALUE);

    const coinSymbols = balances.map(balance => balance.currency_identity);
    const marketCoins = await getMarketCoins(coinSymbols);

    return balances.map((balance, index) => ({
        coin: marketCoins[index],
        platform: Platform.NEXO,
        amount: balance.total_balance,
        usd: {
            price: marketCoins[index].usd,
            value: balance.total_balance * marketCoins[index].usd,
        },
        nzd: {
            price: marketCoins[index].nzd,
            value: balance.total_balance * marketCoins[index].nzd,
        },
    }));
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
