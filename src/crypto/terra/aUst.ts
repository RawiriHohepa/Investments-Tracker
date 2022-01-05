import axios from "axios";
import { CmcCoin, Coin } from "../types";
import Platform from "../Platform";

const aUstAddr = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const unitsPerAUst = 1000000;
const query = `{\n  ${aUstAddr}: WasmContractsContractAddressStore(\n    ContractAddress: \"${aUstAddr}\"\n    QueryMsg: \"{\\\"balance\\\":{\\\"address\\\":\\\"${process.env.TERRA_ADDRESS}\\\"}}\"\n  ) {\n    Height\n    Result\n    __typename\n  }\n  }\n`;

const aUst = async (): Promise<Coin> => {
    const amount = await getAmount();
    const coin = await getCoin();

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
    // TODO add response schema from https://mantle.terra.dev/
    const response = await axios.post("https://mantle.terra.dev/", {
        query,
        variables: {},
    });

    if (response.data.errors && response.data.errors.length) {
        // TODO handle error case
        return response.data.errors;
    }

    const obj = response.data.data[aUstAddr];
    const Result = JSON.parse(obj.Result);
    return parseFloat(Result.balance) / unitsPerAUst;
}

const getCoin = async (): Promise<CmcCoin> => {
    const responseUsd = await axios.get("https://api.coingecko.com/api/v3/coins/markets?ids=anchorust&vs_currency=usd");
    const coinUsd = responseUsd.data[0];

    const responseNzd = await axios.get("https://api.coingecko.com/api/v3/coins/markets?ids=anchorust&vs_currency=nzd");
    const coinNzd = responseNzd.data[0];

    return {
        id: -1,
        symbol: "aust",
        name: "AnchorUST",
        slug: "anchor-ust",
        usd: coinUsd.current_price,
        nzd: coinNzd.current_price,
    }
}

export default aUst;
