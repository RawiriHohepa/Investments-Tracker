import { getAmounts } from "./api";

const kraken = async (): Promise<any> => {
    // TODO retrieve coin prices, calculate values, return in Coin[] format
    return await getAmounts();
};

export default kraken;
