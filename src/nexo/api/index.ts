type CookieProps = {
    __zlcmid: string;
    cf_clearance: string;
    nsi: string;
};

export const balancesApi = async ({ __zlcmid,cf_clearance, nsi }: CookieProps) => {
    return {
        __zlcmid,
        cf_clearance,
        nsi
    }
};