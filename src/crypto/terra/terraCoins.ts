import axios from "axios";
import config from "../../config";
import { GetTerraFinderResponse } from "./types";
import coinSymbols from "../prices/coinSymbols";

const denoms = {
    uluna: {
        marketCoin: coinSymbols.LUNA,
        unitsPerCoin: 1000000,
    },
    uusd: {
        marketCoin: coinSymbols.UST,
        unitsPerCoin: 1000000,
    }
}

const terraCoins = async (): Promise<{ [coin: string]: number }> => {
    const response = await axios.get<GetTerraFinderResponse>(`${config.TERRA_API_URL}/${process.env.TERRA_ADDRESS}`);
    const balances = response.data.balance;

    return mapToMarketCoins(balances);
}

// Map terra coin symbols to corresponding market coins, convert to full coin units
const mapToMarketCoins = (unmappedAmounts: GetTerraFinderResponse["balance"]) => {
    const mappedAmounts: { [marketCoinName: string]: number; } = {};
    const unrecognisedCoins: string[] = [];
    unmappedAmounts.forEach(terraCoin => {
        // Ignore coins with no amount
        if (!parseFloat(terraCoin.available)) {
            return;
        }

        // Find corresponding market coin for given terra coin
        const denomObj = denoms[terraCoin.denom];
        if (!denomObj) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(terraCoin.denom);
            return;
        }

        mappedAmounts[denomObj.marketCoin] = parseFloat(terraCoin.available) / denomObj.unitsPerCoin;
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Terra coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin(s) in crypto/terra/terraCoins.ts`);
    }

    return mappedAmounts;
}

export default terraCoins;
