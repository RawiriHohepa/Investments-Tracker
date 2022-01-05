import aUst from "./aUst";
import { Coin } from "../types";


const terraStation = async (): Promise<Coin[]> => {
    return [await aUst()];
}


export default terraStation;
