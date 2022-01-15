import axios  from "axios";
import config from "../../../config";
import { GetAmountResponse } from "./types";

const unitsPerErgo = 1000000000;

const getAmount = async (): Promise<number> => {
    if (!process.env.ERGO_ADDRESS) {
        throw new Error("ERGO_ADDRESS key not found in .env file");
    }

    const response = await axios.get<GetAmountResponse>(
        `${config.ERGO_API_URL}/${process.env.ERGO_ADDRESS}`
    );

    // TODO handle error case
    return response.data.transactions.totalBalance / unitsPerErgo;
}

export default getAmount;
