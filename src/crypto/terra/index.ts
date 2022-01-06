import { Coin } from "../types";
import terraCoins from "./terraCoins";
import aUst from "./aUst";
import { getCoins } from "../prices";
import Platform from "../Platform";
import coinSymbols from "../prices/coinSymbols";

const terra = async (): Promise<Coin[]> => {
    const mappedAmounts = {
        [coinSymbols.AUST]: await aUst(),
        ...await terraCoins(),
    }
    return await getCoins(mappedAmounts, Platform.TERRA);
}


export default terra;
