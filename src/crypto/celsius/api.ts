import axios from "axios";
import { CelsiusAmounts, GetAmountsResponse } from "./types";
import config from "../../config";

export const getAmounts = async (): Promise<CelsiusAmounts> => {
    if (!process.env.CELSIUS_API_KEY) {
        throw new Error("CELSIUS_API_KEY key not found in .env file");
    }
    if (!process.env.CELSIUS_PARTNER_TOKEN) {
        throw new Error("CELSIUS_PARTNER_TOKEN key not found in .env file");
    }

    const response = await axios.get<GetAmountsResponse>(
        `${config.CELSIUS_API_URL}${config.CELSIUS_BALANCES_ENDPOINT}`,
        {
            headers: {
                "X-Cel-Api-Key": process.env.CELSIUS_API_KEY,
                "X-Cel-Partner-Token": process.env.CELSIUS_PARTNER_TOKEN,
            },
        },
    );

    return response.data.balance;
}
