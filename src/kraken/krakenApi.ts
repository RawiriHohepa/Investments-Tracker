import axios from "axios";
import qs from "qs";
import crypto, {BinaryToTextEncoding} from "crypto";

export type AmountsArrayLike = { [s: string]: string };

export type AssetPair = {
    altname: string;
    wsname: string;
    aclass_base: string;
    base: string;
    aclass_quote: string;
    quote: string;
    lot: string;
    pair_decimals: number;
    lot_decimals: number;
    lot_multiplier: number;
    leverage_buy: any[];
    leverage_sell: any[];
    fees: number[][];
    fees_maker: number[][];
    fee_volume_currency: string;
    margin_call: number;
    margin_stop: number;
    ordermin: string;
};
export type AssetPairArrayLike = { [s: string]: AssetPair };

export type AssetPairPrice = {
    a: string[];
    b: string[];
    c: string[];
    v: string[];
    p: string[];
    t: number[];
    l: string[];
    h: string[];
    o: string;
}
export type PriceArrayLike = { [s: string]: AssetPairPrice };

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

// https://github.com/nothingisdead/npm-kraken-api
const apiSign = (path, request, secret, nonce) => {
    const message       = qs.stringify(request);
    const secret_buffer = new Buffer(secret, 'base64');
    const hash          = crypto.createHash('sha256');
    const hmac          = crypto.createHmac('sha512', secret_buffer);
    const hash_digest   = hash.update(nonce + message).digest(<BinaryToTextEncoding>'binary');
    const hmac_digest   = hmac.update(path + hash_digest, 'binary').digest('base64');

    return hmac_digest;
};