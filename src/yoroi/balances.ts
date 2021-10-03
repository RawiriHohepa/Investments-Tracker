import { ergoApi } from "./api";
import coinMarketCap, { ERGO_ID } from "./api/coinMarketCap";
import { Yoroi } from "../types/Yoroi";

const balances = async (): Promise<Yoroi[]> => {
    const ergoApiResponse = await ergoApi();
    const unitsPerErgo = 1000000000;
    const ergoAmount = ergoApiResponse.transactions.totalBalance / unitsPerErgo;

    const coinMarketCapCoins = await coinMarketCap()
    const ergoPrice = coinMarketCapCoins[ERGO_ID].quote.USD.price;

    return [{
        coin: "ERG",
        amount: ergoAmount,
        balance: ergoAmount * ergoPrice,
        price: ergoPrice
    }];
};

export default balances;