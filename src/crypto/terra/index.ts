import { CoinWithoutPrice } from "../types";
import nativeCoins from "./nativeCoins";
import aUst from "./aUst";
import Platform from "../Platform";
import CoinId from "../CoinId";

const terra = async (): Promise<CoinWithoutPrice[]> => [
    ...await nativeCoins(),
    {
        id: CoinId.AUST,
        platform: Platform.TERRA,
        amount: await aUst(),
    },
];


export default terra;
