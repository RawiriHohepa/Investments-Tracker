import axios from "axios";
import { MarketCoin, Coin } from "../types";
import Platform from "../Platform";
import { GetAUstAmountResponse } from "./types";

const aUstAddr = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const unitsPerAUst = 1000000;
const query = `{\n  ${aUstAddr}: WasmContractsContractAddressStore(\n    ContractAddress: \"${aUstAddr}\"\n    QueryMsg: \"{\\\"balance\\\":{\\\"address\\\":\\\"${process.env.TERRA_ADDRESS}\\\"}}\"\n  ) {\n    Result\n  }\n  }\n`;

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

const getCoin = async (): Promise<MarketCoin> => {
    const responseUsd = await axios.get("https://api.coingecko.com/api/v3/coins/markets?ids=anchorust&vs_currency=usd");
    const coinUsd = responseUsd.data[0];

    const responseNzd = await axios.get("https://api.coingecko.com/api/v3/coins/markets?ids=anchorust&vs_currency=nzd");
    const coinNzd = responseNzd.data[0];

    return {
        id: -1,
        symbol: "AUST",
        name: "AnchorUST",
        slug: "anchor-ust",
        usd: coinUsd.current_price,
        nzd: coinNzd.current_price,
    }
}

export default aUst;
