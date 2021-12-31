import { Coin } from "../types";
import getAda from "./ada";
import getErgo from "./ergo";

const yoroi = async (): Promise<Coin[]> => {
    return [await getAda(), await getErgo()];
};

export default yoroi;
