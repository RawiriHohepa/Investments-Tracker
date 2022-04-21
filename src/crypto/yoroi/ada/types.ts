export type GetAmountResponse =
    | {
    data: {
        Response: {
            amount: number;
        }[];
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
        extensions: any;
    }[];
};
