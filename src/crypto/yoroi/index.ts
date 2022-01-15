import { CoinWithoutPrice } from "../types";
import ada from "./ada";
import ergo from "./ergo";
import CoinId from "../CoinId";
import Platform from "../Platform";

const yoroi = async (): Promise<CoinWithoutPrice[]> => [
    {
        id: CoinId.ADA,
        platform: Platform.YOROI,
        amount: await ada(),
    },
    {
        id: CoinId.ERG,
        platform: Platform.YOROI,
        amount: await ergo(),
    },
];

export default yoroi;
