export type AmountsArrayLike = { [s: string]: string };

export type AssetPair = {
    altname: string;
    wsname: string;
    aclass_base: string;
    base: string;
    aclass_quote: string;
    quote: string;
    lot: string;
    pair_decimals: number;
    lot_decimals: number;
    lot_multiplier: number;
    leverage_buy: any[];
    leverage_sell: any[];
    fees: number[][];
    fees_maker: number[][];
    fee_volume_currency: string;
    margin_call: number;
    margin_stop: number;
    ordermin: string;
};
export type AssetPairArrayLike = { [s: string]: AssetPair };

export type AssetPairPrice = {
    a: string[];
    b: string[];
    c: string[];
    v: string[];
    p: string[];
    t: number[];
    l: string[];
    h: string[];
    o: string;
}
export type PriceArrayLike = { [s: string]: AssetPairPrice };