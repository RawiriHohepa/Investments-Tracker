import { Coin } from "../types";
import terraCoins from "./terraCoins";
import aUst from "./aUst";


const terraStation = async (): Promise<Coin[]> => {
    return [...await terraCoins(), await aUst()];
}


export default terraStation;
