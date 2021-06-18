export type Kraken = {
    coin: string;
    type: "Staking" | "Spot";
    amount: number;
    balance: number;
    price: number;
};