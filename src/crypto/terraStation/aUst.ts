import axios from "axios";

const aUstAddr = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const unitsPerAUst = 1000000;
const query = `{\n  ${aUstAddr}: WasmContractsContractAddressStore(\n    ContractAddress: \"${aUstAddr}\"\n    QueryMsg: \"{\\\"balance\\\":{\\\"address\\\":\\\"${process.env.TERRA_STATION_ADDRESS}\\\"}}\"\n  ) {\n    Height\n    Result\n    __typename\n  }\n  }\n`;

const aUst = async () => {
    const amount = await getAmount();
    return {
        symbol: "aUST",
        token: aUstAddr,
        amount,
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

export default aUst;
