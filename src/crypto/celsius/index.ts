import { CoinWithoutPrice } from "../types";
import CoinId from "../CoinId";
import Platform from "../Platform";

const celsius = async (): Promise<CoinWithoutPrice[]> => [
  {
    id: CoinId.BTC,
    platform: Platform.CELSIUS,
    amount: 0,
  },
  {
    id: CoinId.ETH,
    platform: Platform.CELSIUS,
    amount: 0,
  },
];

export default celsius;
