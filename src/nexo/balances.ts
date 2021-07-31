import { balancesApi } from "./api";
import { Balance } from "../types/nexoApi";
import { Nexo } from "../types";

const balances = async (nsi: string) => {
    const __zlcmid = "" + process.env.NEXO_ZLCMID;
    const cf_clearance = "" + process.env.NEXO_CF_CLEARANCE;

    const balancesApiResponse = await balancesApi({
        __zlcmid,
        cf_clearance,
        nsi,
    });

    return filterBalances(balancesApiResponse.balances);
};

const filterBalances = (balances: Balance[]) => {
    const nonZeroBalances = balances.filter(balance => balance.total_balance !== 0);

    return nonZeroBalances.map<Nexo>(balance => ({
        coin: balance.currency_identity,
        amount: balance.total_balance,
        balance: balance.total_balance * balance.usd_course,
        price: balance.usd_course,
    }));
};

export default balances;