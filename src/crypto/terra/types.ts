export type GetAUstAmountResponse =
  | {
      data: {
        [tokenAddr: string]: {
          Height: `${number}`;
          Result: `{\"balance\":\"${number}\"}`;
          __typename: string;
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

export type GetTerraFinderResponse = {
  balance: {
      denom: string;
      available: `${number}`;
      delegatedVesting: `${number}`;
      delegatable: `${number}`;
      freedVesting: `${number}`;
      unbonding: `${number}`;
      remainingVesting: `${number}`;
  }[];
  vesting: [];
  delegations: [];
  unbondings: [];
};
