import { Coin } from "../types";
import getAda from "./ada";
import getErgo from "./ergo";

const yoroi = async (): Promise<Coin[]> => {
    const ada = await getAda();
    const ergo = await getErgo();
    return [ada, ergo];
};

export default yoroi;
