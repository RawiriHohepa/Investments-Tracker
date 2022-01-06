import { Coin } from "../types";
import coinSymbols from "../prices/coinSymbols";
import { getCoins } from "../prices";
import Platform from "../Platform";

const exodus = async (xmrAmount: number): Promise<Coin[]> => {
    const mappedAmounts = {
        [coinSymbols.XMR]: xmrAmount
    };
    return await getCoins(mappedAmounts, Platform.EXODUS);
};

export default exodus;
