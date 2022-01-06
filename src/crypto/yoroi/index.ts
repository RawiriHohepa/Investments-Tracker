import { Coin } from "../types";
import getAda from "./ada";
import getErgo from "./ergo";
import coinSymbols from "../prices/coinSymbols";
import { getCoins } from "../prices";
import Platform from "../Platform";

const yoroi = async (): Promise<Coin[]> => {
    const mappedAmounts = {
        [coinSymbols.ADA]: await getAda(),
        [coinSymbols.ERGO]: await getErgo(),
    }
    return await getCoins(mappedAmounts, Platform.YOROI);
};

export default yoroi;
