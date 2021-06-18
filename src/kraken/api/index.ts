import axios from "axios";
import {
    AmountsArrayLike,
    AssetPairArrayLike,
    PriceArrayLike
} from "../../types/krakenApi";
import apiSign from "./apiSign";

export const amountsApi = async (): Promise<AmountsArrayLike> => {
    const nonce = new Date().getTime();
    const message = `nonce=${nonce}`;
    const signature = apiSign(process.env.KRAKEN_API_BALANCES_ENDPOINT, { nonce }, process.env.KRAKEN_PRIVATE_KEY, nonce);

    const res = await axios.post("" + process.env.KRAKEN_API_URI + process.env.KRAKEN_API_BALANCES_ENDPOINT, message, {
        headers: {
            'API-Key': process.env.KRAKEN_API_KEY,
            'API-Sign': signature,
        },
    });

    return res.data.result;
}

export const assetPairsApi = async (): Promise<AssetPairArrayLike> => {
    const res = await axios.get("" + process.env.KRAKEN_API_URI + process.env.KRAKEN_API_ASSET_PAIRS_ENDPOINT);

    return res.data.result;
}

export const pricesApi = async (pairs): Promise<PriceArrayLike> => {
    const res = await axios.get("" + process.env.KRAKEN_API_URI + process.env.KRAKEN_API_PRICES_ENDPOINT, {
        params: {
            pair: pairs,
        }
    });

    return res.data.result;
}