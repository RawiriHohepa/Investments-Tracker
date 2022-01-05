import axios from "axios";
import { Coin } from "../types";
import Platform from "../Platform";
import { GetAUstAmountResponse } from "./types";
import { getMarketCoin } from "../prices";
import coinSymbols from "../prices/coinSymbols";

const aUstAddr = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const unitsPerAUst = 1000000;
const query = `{\n  ${aUstAddr}: WasmContractsContractAddressStore(\n    ContractAddress: \"${aUstAddr}\"\n    QueryMsg: \"{\\\"balance\\\":{\\\"address\\\":\\\"${process.env.TERRA_ADDRESS}\\\"}}\"\n  ) {\n    Result\n  }\n  }\n`;

const aUst = async (): Promise<Coin> => {
    const amount = await getAmount();
    const coin = await getMarketCoin(coinSymbols.AUST);

    return {
        coin,
        platform: Platform.TERRA,
        amount,
        usd: {
            price: coin.usd,
            value: amount * coin.usd,
        },
        nzd: {
            price: coin.nzd,
            value: amount * coin.nzd,
        },
    }
}

const getAmount = async () => {
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
