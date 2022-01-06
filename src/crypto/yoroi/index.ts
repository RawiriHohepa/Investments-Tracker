import { Coin, CoinWithoutPrice } from "../types";
import getAda from "./ada";
import getErgo from "./ergo";
import CoinId from "../CoinId";
import { getCoins } from "../prices";
import Platform from "../Platform";

const yoroi = async (): Promise<Coin[]> => {
    const coinsWithoutPrices: CoinWithoutPrice[] = [
        {
            id: CoinId.ADA,
            platform: Platform.YOROI,
            amount: await getAda(),
        },
        {
            id: CoinId.ERG,
            platform: Platform.YOROI,
            amount: await getErgo(),
        },
    ];
    return await getCoins(coinsWithoutPrices);
};

export default yoroi;
