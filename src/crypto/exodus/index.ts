import { Coin } from "../types";
import xmr from "./xmr";

const exodus = async (xmrAmount: number): Promise<Coin[]> => {
    return [await xmr(xmrAmount)];
};

export default exodus;
