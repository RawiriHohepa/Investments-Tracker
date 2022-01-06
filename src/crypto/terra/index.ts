import { Coin, CoinWithoutPrice } from "../types";
import terraCoins from "./terraCoins";
import aUst from "./aUst";
import { getCoins } from "../prices";
import Platform from "../Platform";
import CoinId from "../CoinId";

const terra = async (): Promise<Coin[]> => {
    const coinsWithoutPrices: CoinWithoutPrice[] = [
        ...await terraCoins(),
        {
            id: CoinId.AUST,
            platform: Platform.TERRA,
            amount: await aUst(),
        },
    ];
    return await getCoins(coinsWithoutPrices);
}


export default terra;
