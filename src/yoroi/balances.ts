import { ergoApi, getAdaAmount } from "./api";
import { Yoroi } from "../types/Yoroi";
import { getCmcPrices, ADA_ID, ERG_ID } from "../coinMarketCap";

const balances = async (): Promise<Yoroi[]> => {
    const ergoApiResponse = await ergoApi();
    const unitsPerErgo = 1000000000;
    const ergoAmount = ergoApiResponse.transactions.totalBalance / unitsPerErgo;

    const {
        [ADA_ID]: adaPrice,
        [ERG_ID]: ergoPrice
    } = await getCmcPrices([ADA_ID, ERG_ID]);

    const adaAmount = await getAdaAmount();

    return [
        {
            coin: "ADA",
            amount: adaAmount,
            balance: adaAmount * adaPrice,
            price: adaPrice
        },
        {
            coin: "ERG",
            amount: ergoAmount,
            balance: ergoAmount * ergoPrice,
            price: ergoPrice
        },
    ];
};

export default balances;