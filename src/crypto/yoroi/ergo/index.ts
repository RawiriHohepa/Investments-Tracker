import axios  from "axios";
import config from "../../../config";
import { Coin } from "../../types";
import { getMarketCoin } from "../../prices";
import Platform from "../../Platform";
import { ErgoApiResponse } from "./types";
import coinSymbols from "../../prices/coinSymbols";

const UNITS_PER_ERGO = 1000000000;

const getErgo = async (): Promise<Coin> => {
    const amount = await getAmount();
    const coin = await getMarketCoin(coinSymbols.ERGO);

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

const getAmount = async () => {
    const url = `${config.ERGO_API_URL}/${process.env.ERGO_ADDRESS}`;
    const res = await axios.get<ErgoApiResponse>(url);
    const amountInUnits = res.data.transactions.totalBalance;
    return amountInUnits / UNITS_PER_ERGO;
}

export default getErgo;
