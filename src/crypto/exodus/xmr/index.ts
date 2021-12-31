import { Coin } from "../../types";
import { getCmcCoin } from "../../coinMarketCap";
import Platform from "../../Platform";

const getXmr = async (xmrAmount: number): Promise<Coin> => {
    const coin = await getCmcCoin("XMR");
    return {
        coin: coin,
        platform: Platform.EXODUS,
        amount: xmrAmount,
        usd: {
            price: coin.usd,
            value: xmrAmount * coin.usd,
        },
        nzd: {
            price: coin.nzd,
            value: xmrAmount * coin.nzd,
        }
    }
}

export default getXmr;
