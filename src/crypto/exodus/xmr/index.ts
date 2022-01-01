import { Coin } from "../../types";
import { getMarketCoin } from "../../prices";
import Platform from "../../Platform";

const getXmr = async (xmrAmount: number): Promise<Coin> => {
    const coin = await getMarketCoin("XMR");
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
