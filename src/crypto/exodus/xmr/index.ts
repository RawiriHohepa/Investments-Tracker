import { Coin } from "../../types";
import { getMarketCoin } from "../../prices";
import Platform from "../../Platform";
import coinSymbols from "../../prices/coinSymbols";

const getXmr = async (xmrAmount: number): Promise<Coin> => {
    const coin = await getMarketCoin(coinSymbols.XMR);
    return {
        coin,
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
