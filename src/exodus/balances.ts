import { algoApi } from "./api";
import { Exodus } from "../types/Exodus";
import { getCmcPrices, ALGO_ID, XMR_ID } from "../coinMarketCap";

const balances = async (xmrAmount: number): Promise<Exodus[]> => {
    const algoApiResponse = await algoApi();
    const unitsPerAlgo = 1000000;
    const algoAmount = algoApiResponse.account.amount / unitsPerAlgo;

    const {
        [ALGO_ID]: algoPrice,
        [XMR_ID]: xmrPrice
    } = await getCmcPrices([ALGO_ID, XMR_ID]);

    return [
        {
            coin: "ALGO",
            amount: algoAmount,
            balance: algoAmount * algoPrice,
            price: algoPrice
        },
        {
            coin: "XMR",
            amount: xmrAmount,
            balance: xmrAmount * xmrPrice,
            price: xmrPrice
        }
    ];
};

export default balances;