import axios  from "axios";
import config from "../../config";
import { Coin } from "../../crypto/types";
import { getCmcCoin } from "../../coinMarketCap";
import Platform from "../../crypto/Platform";

const UNITS_PER_ERGO = 1000000000;

type ErgoApiResponse = {
    "summary": {
        "id": string;
    },
    "transactions": {
        "confirmed": number;
        "totalReceived": number;
        "confirmedBalance": number;
        "totalBalance": number;
        "confirmedTokensBalance": number[];
        "totalTokensBalance": number[];
    }
}

const ergoApi: () => Promise<Coin> = async () => {
    const url = `${config.ERGO_API_URL}/${process.env.ERGO_ADDRESS}`;
    const res = await axios.get<ErgoApiResponse>(url);
    const amountInUnits = res.data.transactions.totalBalance;
    const amount = amountInUnits / UNITS_PER_ERGO;

    const coin = await getCmcCoin("ERG");

    return {
        coin,
        platform: Platform.YOROI,
        amount,
        usd: {
            price: coin.usd,
            value: amount * coin.usd,
        },
        nzd: {
            price: coin.nzd,
            value: amount * coin.nzd,
        },
    };
};

export default ergoApi;
