import axios from "axios";
import config from "../../../config";
import { GetAmountResponse } from "./types";

const unitsPerToken = 1000000;

const getAmount = async (): Promise<number> => {
    if (!process.env.CARDANO_STAKE_KEY) {
        throw new Error("CARDANO_STAKE_KEY key not found in .env file");
    }

    const query = `query activeStakeForAddress (
    $limit: Int!
    $where: ActiveStake_bool_exp
    $order_by: [ActiveStake_order_by!]
) {
    Response: activeStake (limit: $limit, where: $where, order_by: $order_by) {
        amount
    }
}`;

    const variables = {
        "limit": 1,
        "where": {
            "address": {
                "_eq": process.env.CARDANO_STAKE_KEY
            }
        },
        "order_by": [{
            "epochNo": "desc"
        }]
    }

    const response = await axios.post<GetAmountResponse>(
        config.CARDANO_API_URL,
        { query, variables },
    );

    if (!response.data.data) {
        throw new Error(`Error(s) when retrieving ADA amount: ${JSON.stringify(response.data.errors)}`);
    }
    return response.data.data.Response[0].amount / unitsPerToken;
}

export default getAmount;
