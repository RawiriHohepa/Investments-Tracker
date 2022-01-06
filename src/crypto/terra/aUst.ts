import axios from "axios";
import { GetAUstAmountResponse } from "./types";

const aUstAddr = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const unitsPerAUst = 1000000;
const query = `{\n  ${aUstAddr}: WasmContractsContractAddressStore(\n    ContractAddress: \"${aUstAddr}\"\n    QueryMsg: \"{\\\"balance\\\":{\\\"address\\\":\\\"${process.env.TERRA_ADDRESS}\\\"}}\"\n  ) {\n    Result\n  }\n  }\n`;

const aUst = async (): Promise<number> => {
    const response = await axios.post<GetAUstAmountResponse>("https://mantle.terra.dev/", {
        query,
        variables: {},
    });
    if (!response.data.data) {
        throw new Error(response.data.errors.join("; "));
    }

    const obj = response.data.data[aUstAddr];
    const Result: { balance: string } = JSON.parse(obj.Result);
    return parseFloat(Result.balance) / unitsPerAUst;
}

export default aUst;
