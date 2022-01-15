export type KrakenResponse<Data> = {
    result: Data;
    error: string[];
}

export type GetAmountsResponse = { [krakenCoinName: string]: string };
