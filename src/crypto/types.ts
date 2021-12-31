import Platform from "./Platform";

export type CmcCoin = {
    id: number;
    symbol: string;
    name: string;
    slug: string;
    usd: number;
    nzd: number;
}

export type Coin = {
    coin: CmcCoin;
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
