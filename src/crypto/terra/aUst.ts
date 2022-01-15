import axios from "axios";
import { GetAUstAmountResponse } from "./types";
import config from "../../config";

const tokenAddress = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const unitsPerToken = 1000000;

const aUst = async (): Promise<number> => {
    if (!process.env.TERRA_ADDRESS) {
        throw new Error("TERRA_ADDRESS key not found in .env file");
    }

    const query = `{\n  ${tokenAddress}: WasmContractsContractAddressStore(\n    ContractAddress: \"${tokenAddress}\"\n    QueryMsg: \"{\\\"balance\\\":{\\\"address\\\":\\\"${process.env.TERRA_ADDRESS}\\\"}}\"\n  ) {\n    Result\n  }\n  }\n`;

    const response = await axios.post<GetAUstAmountResponse>(
        config.TERRA_AUST_API_URL,
        {
            query,
            variables: {},
        }
    );
    if (!response.data.data) {
        throw new Error(`Error(s) when retrieving AUST amount: ${JSON.stringify(response.data.errors)}`);
    }

    const amountObject = response.data.data[tokenAddress];
    const Result: { balance: string } = JSON.parse(amountObject.Result);
    return parseFloat(Result.balance) / unitsPerToken;
}

export default aUst;
