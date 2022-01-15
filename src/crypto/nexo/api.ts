import { GetAmountsResponse, NexoResponse } from "./types";
import config from "../../config";
import axios from "axios";

const getAmounts = async (nsi: string): Promise<GetAmountsResponse> => {
    if (!process.env.NEXO_ZLCMID) {
        throw new Error("NEXO_ZLCMID key not found in .env file");
    }
    if (!process.env.NEXO_CF_CLEARANCE) {
        throw new Error("NEXO_CF_CLEARANCE key not found in .env file");
    }

    const cookie = `__zlcmid=${process.env.NEXO_ZLCMID}; cf_clearance=${process.env.NEXO_CF_CLEARANCE}; nsi=${nsi};`;

    const response = await axios.post<NexoResponse<GetAmountsResponse>>(
        `${config.NEXO_API_URL}${config.NEXO_API_BALANCES_ENDPOINT}`,
        {},
        {
            headers: {
                cookie
            },
        },
    );

    // TODO handle error case
    return response.data.payload;
}

export default getAmounts;
