import { CoinWithoutPrice } from "../types";
import terraCoins from "./terraCoins";
import aUst from "./aUst";
import Platform from "../Platform";
import CoinId from "../CoinId";

const terra = async (): Promise<CoinWithoutPrice[]> => {
    return [
        ...await terraCoins(),
        {
            id: CoinId.AUST,
            platform: Platform.TERRA,
            amount: await aUst(),
        },
    ];
}


export default terra;
