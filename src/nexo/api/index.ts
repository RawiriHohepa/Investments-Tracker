import axios from "axios";
import { BalancesApiResponse } from "../../types/nexoApi";

type Response = {
    access: boolean;
    payload: BalancesApiResponse;
};

type CookieProps = {
    __zlcmid: string;
    cf_clearance: string;
    nsi: string;
};

export const balancesApi = async (cookieProps: CookieProps) => {
    const cookie = constructCookie(cookieProps);

    const apiUrl = "" + process.env.NEXO_API_URL + process.env.NEXO_API_BALANCES_ENDPOINT;
    const res = await axios.post<Response>(apiUrl, {}, {
        headers: {
            cookie
        }
    });

    return res.data.payload;
};

const constructCookie = (cookieProps: CookieProps) => {
    const keyValuePairs = Object.keys(cookieProps)
        .map(key => `${key}=${cookieProps[key]};`);

    return keyValuePairs.join(" ");
};