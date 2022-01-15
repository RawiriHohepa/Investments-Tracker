import { CoinWithoutPrice } from "../types";
import CoinId from "../CoinId";
import Platform from "../Platform";

const exodus = async (xmrAmount: number): Promise<CoinWithoutPrice[]> => [
    {
        id: CoinId.XMR,
        platform: Platform.EXODUS,
        amount: xmrAmount,
    },
];

export default exodus;
