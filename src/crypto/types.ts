import Platform from "./Platform";
import CoinId from "./CoinId";

export type CoinWithoutPrice = {
    id: CoinId;
    platform: Platform;
    amount: number;
}

export type CoinInfo = {
    id: string;
    symbol: string;
    name: string;
    usd: number;
    nzd: number;
}

export type Coin = {
    coin: CoinInfo;
    platform: Platform;
    amount: number;
    usd: {
        price: number;
        value: number;
    };
    nzd: {
        price: number;
        value: number;
    }
}
