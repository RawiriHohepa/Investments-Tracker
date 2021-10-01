import { ergoApi } from "./api";

const balances = async () => {
    const ergoApiResponse = await ergoApi();
    const unitsPerErgo = 1000000000;
    const ergoBalance = ergoApiResponse.transactions.totalBalance / unitsPerErgo;

    return ergoBalance;
};

export default balances;