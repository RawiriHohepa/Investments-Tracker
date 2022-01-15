import axios from "axios";
import config from "../../config";
import {
    KrakenResponse,
    GetAmountsResponse,
} from "./types";
import qs from "qs";
import { createHash, createHmac } from "crypto";

export const getAmounts = async (): Promise<GetAmountsResponse> => {
    if (!process.env.KRAKEN_API_KEY) {
        throw new Error("KRAKEN_API_KEY key not found in .env file");
    }
    if (!process.env.KRAKEN_PRIVATE_KEY) {
        throw new Error("KRAKEN_PRIVATE_KEY key not found in .env file");
    }

    const nonce = new Date().getTime();
    const message = `nonce=${nonce}`;
    const signature = getMessageSignature(config.KRAKEN_API_BALANCES_ENDPOINT, { nonce }, process.env.KRAKEN_PRIVATE_KEY, nonce.toString());

    const response = await axios.post<KrakenResponse<GetAmountsResponse>>(
        `${config.KRAKEN_API_URI}${config.KRAKEN_API_BALANCES_ENDPOINT}`,
        message,
        {
            headers: {
                'API-Key': process.env.KRAKEN_API_KEY,
                'API-Sign': signature,
            },
        },
    );

    if (!!response.data.error.length) {
        throw new Error(`Error(s) when calling Kraken API ${config.KRAKEN_API_BALANCES_ENDPOINT}: ${response.data.error.join(";\n")}`);
    }
    return response.data.result;
}

// From https://github.com/vdegenne/kraken-api-js/blob/master/_kraken.ts
// Create a signature for a request
const getMessageSignature = (path:string, request:any, secret:string, nonce:string) => {
    const message = qs.stringify(request)
    const secret_buffer = Buffer.from(secret, 'base64')
    const hash = createHash('sha256')
    const hmac = createHmac('sha512', secret_buffer)
    const hash_digest = hash.update(nonce + message).digest(<"base64" | "hex">'latin1')
    const hmac_digest = hmac.update(path + hash_digest, 'latin1').digest('base64')

    return hmac_digest
}
