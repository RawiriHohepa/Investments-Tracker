type InvestNowFund = {
    Name: string;
    Qty: number;
    Price: number;
    Value: number;
    FX: number;
    NZD: number;
}

export type InvestNow = { [s: string]: InvestNowFund };
