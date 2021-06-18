import { balancesApi } from "./api";

const balances = async (nsi: string) => {
    if (!nsi) {
        return;
    }

    const __zlcmid = "" + process.env.NEXO_ZLCMID;
    const cf_clearance = "" + process.env.NEXO_CF_CLEARANCE;

    const balances = await balancesApi({
        __zlcmid,
        cf_clearance,
        nsi,
    });

    return balances;
};

export default balances;