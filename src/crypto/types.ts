import Platform from "./Platform";

export type MarketCoin = {
    id: string;
    symbol: string;
    name: string;
    usd: number;
    nzd: number;
}

export type Coin = {
    coin: MarketCoin;
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
