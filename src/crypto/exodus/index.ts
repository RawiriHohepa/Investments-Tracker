import { Coin } from "../types";
import CoinId from "../CoinId";
import { getCoins } from "../prices";
import Platform from "../Platform";

const exodus = async (xmrAmount: number): Promise<Coin[]> =>
    await getCoins([
        {
            id: CoinId.XMR,
            platform: Platform.EXODUS,
            amount: xmrAmount,
        },
    ]);

export default exodus;
