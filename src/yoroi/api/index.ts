import axios, { AxiosResponse } from "axios";

export const ergoApi = async () => {
    const uri = `${process.env.ERGO_API_URL}/${process.env.ERGO_ADDRESS}`;
    const res = await axios.get<null, AxiosResponse<ErgoApiRepsonse>>(uri);
    return res.data;
};

type ErgoApiRepsonse = {
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