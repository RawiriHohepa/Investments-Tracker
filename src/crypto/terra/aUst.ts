import axios from "axios";
import { GetAUstAmountResponse } from "./types";
import config from "../../config";

const tokenAddress = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const unitsPerToken = 1000000;

const aUst = async (): Promise<number> => {
    if (!process.env.TERRA_ADDRESS) {
        throw new Error("TERRA_ADDRESS key not found in .env file");
    }

    const query = `query Query($token_address: String!, $query: String!) {
  Response: WasmContractsContractAddressStore(
    ContractAddress: $token_address
    QueryMsg: $query
  ) {
    Result
  }
}`;

    const variables = {
        token_address: tokenAddress,
        query: JSON.stringify({
            balance: {
                address: process.env.TERRA_ADDRESS,
            }
        }),
    }

    const response = await axios.post<GetAUstAmountResponse>(
        config.TERRA_AUST_API_URL,
        { query, variables },
    );
    if (!response.data.data) {
        throw new Error(`Error(s) when retrieving AUST amount: ${JSON.stringify(response.data.errors)}`);
    }

    const amountObject = response.data.data.Response;
    const Result: { balance: string } = JSON.parse(amountObject.Result);
    return parseFloat(Result.balance) / unitsPerToken;
}

export default aUst;
