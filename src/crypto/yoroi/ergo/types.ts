export type ErgoApiResponse = {
    "summary": {
        "id": string;
    },
    "transactions": {
        "confirmed": number;
        "totalReceived": number;
        "confirmedBalance": number;
        "totalBalance": number;
        "confirmedTokensBalance": number[];
        "totalTokensBalance": number[];
    }
}
