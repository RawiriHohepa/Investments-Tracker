export type GetAmountsResponse = {
    balance: CelsiusAmounts;
}

export type CelsiusAmounts = { [celsiusCoinName: string]: string };
