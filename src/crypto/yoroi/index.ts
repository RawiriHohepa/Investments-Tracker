import { Coin } from "../types";
import getErgo from "./ergo";

const yoroi = async (): Promise<Coin[]> => {
    const ergo: Coin = await getErgo();
    return [ergo];
};

export default yoroi;
