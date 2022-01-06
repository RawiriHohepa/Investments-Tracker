import { Coin, CoinWithoutPrice } from "../types";
import axios from "axios";
import {
    GetBalancesResponse,
    GetBalancesResponseBalances,
    GetBalancesResponsePayload
} from "./types";
import config from "../../config";
import { getCoins } from "../prices";
import Platform from "../Platform";
import CoinId from "../CoinId";

const nexo = async (nsi: string): Promise<Coin[]> => {
    if (!process.env.NEXO_ZLCMID || !process.env.NEXO_CF_CLEARANCE) {
        throw new Error("Environment Variables not set: NEXO_ZLCMID and/or NEXO_CF_CLEARANCE")
    }

    const getBalancesResponse = await nexoApi(nsi);
    const coinsWithoutPrices: CoinWithoutPrice[] = mapAmounts(getBalancesResponse);
    return await getCoins(coinsWithoutPrices);
}

const mapAmounts = (getBalancesResponse): CoinWithoutPrice[] => {
    const coinsWithoutPrices: CoinWithoutPrice[] = [];
    const unrecognisedCoins: string[] = [];
    getBalancesResponse.balances.forEach((balance: GetBalancesResponseBalances) => {
        // Ignore coins with no amount
        if (!balance.total_balance) {
            return;
        }

        // Find corresponding market coin for given nexo coin
        const coinId: CoinId | undefined = CoinId[balance.currency_identity];
        if (!coinId) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(balance.currency_identity);
            return;
        }

        coinsWithoutPrices.push({
            id: coinId,
            platform: Platform.NEXO,
            amount: balance.total_balance,
        });
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Nexo coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin symbol(s) in crypto/coinId.ts`);
    }

    return coinsWithoutPrices;
}

const nexoApi = async (nsi: string): Promise<GetBalancesResponsePayload> => {
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
