export type GetAUstAmountResponse =
    | {
    data: {
        [tokenAddr: string]: {
            Result: `{\"balance\":\"${number}\"}`;
        };
    };
}
    | {
    data: null;
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }[];
};

export type GetAmountsResponse = {
    balance: GetAmountsResponseBalance[];
    vesting: [];
    delegations: [];
    unbondings: [];
};

export type GetAmountsResponseBalance = {
    denom: string;
    available: `${number}`;
    delegatedVesting: `${number}`;
    delegatable: `${number}`;
    freedVesting: `${number}`;
    unbonding: `${number}`;
    remainingVesting: `${number}`;
};
