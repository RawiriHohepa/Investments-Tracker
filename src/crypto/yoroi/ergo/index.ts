import axios  from "axios";
import config from "../../../config";
import { ErgoApiResponse } from "./types";

const UNITS_PER_ERGO = 1000000000;

const getErgo = async (): Promise<number> => {
    const url = `${config.ERGO_API_URL}/${process.env.ERGO_ADDRESS}`;
    const res = await axios.get<ErgoApiResponse>(url);
    const amountInUnits = res.data.transactions.totalBalance;
    return amountInUnits / UNITS_PER_ERGO;
}

export default getErgo;
