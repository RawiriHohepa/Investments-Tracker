import axios from "axios";
import { Balance, BalancesApiResponse } from "../../types/nexoApi";

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
    const balancesApiResponse = res.data.payload;

    return filterBalances(balancesApiResponse.balances);
};

const constructCookie = (cookieProps: CookieProps) => {
    const keyValuePairs = Object.keys(cookieProps)
        .map(key => `${key}=${cookieProps[key]};`);

    return keyValuePairs.join(" ");
};

const filterBalances = (balances: Balance[]) => {
    const nonZeroBalances = balances.filter(balance => balance.total_balance !== 0);

    return nonZeroBalances.map(balance => ({
        coin: balance.currency_identity,
        amount: balance.total_balance,
        price: balance.usd_course,
        balance: balance.total_balance * balance.usd_course,
    }));
};