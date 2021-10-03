import axios, { AxiosResponse } from "axios";
import { coinMarketCapApiResponse } from "../../types/coinMarketCapApi";

export const ERGO_ID = 1762;

const coinMarketCap = async () => {
    const url = `${process.env.COINMARKETCAP_API_URL}${process.env.COINMARKETCAP_QUOTES_ENDPOINT}?id=${ERGO_ID}`;

    const res = await axios.get<null, AxiosResponse<coinMarketCapApiResponse>>(url, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        }
    });
    return res.data.data;
};

export default coinMarketCap;