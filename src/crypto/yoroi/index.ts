import { CoinWithoutPrice } from "../types";
import getAda from "./ada";
import getErgo from "./ergo";
import CoinId from "../CoinId";
import Platform from "../Platform";

const yoroi = async (): Promise<CoinWithoutPrice[]> => {
    return [
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
};

export default yoroi;
