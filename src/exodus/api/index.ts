import axios, { AxiosResponse } from "axios";

type AlgoApiResponse = {
    "account": {
        "address": string,
        "amount": number,
        "amount-without-pending-rewards": number,
        "created-at-round": number,
        "deleted": boolean,
        "min-balance": number,
        "pending-rewards": number,
        "reward-base": number,
        "rewards": number,
        "round": number,
        "sig-type": string,
        "status": string
    },
    "current-round": number
}

export const algoApi = async () => {
    const uri = `${process.env.ALGO_API_URL}/${process.env.ALGO_ADDRESS}`;
    const res = await axios.get<null, AxiosResponse<AlgoApiResponse>>(uri);
    return res.data;
};