import axios from "axios";
import config from "../../config";
import { GetTerraFinderResponse } from "./types";
import CoinId from "../CoinId";
import { CoinWithoutPrice } from "../types";
import Platform from "../Platform";

type DenomMapping = {
    coinId: CoinId;
    unitsPerCoin: number;
}

const denoms: { [s: string]: DenomMapping } = {
    uluna: {
        coinId: CoinId.LUNA,
        unitsPerCoin: 1000000,
    },
    uusd: {
        coinId: CoinId.UST,
        unitsPerCoin: 1000000,
    }
}

const terraCoins = async (): Promise<CoinWithoutPrice[]> => {
    const response = await axios.get<GetTerraFinderResponse>(`${config.TERRA_API_URL}/${process.env.TERRA_ADDRESS}`);
    const balances = response.data.balance;

    return mapToMarketCoins(balances);
}

// Map terra coin symbols to corresponding market coins, convert to full coin units
const mapToMarketCoins = (unmappedAmounts: GetTerraFinderResponse["balance"]) => {
    const coinsWithoutPrices: CoinWithoutPrice[] = [];
    const unrecognisedCoins: string[] = [];
    unmappedAmounts.forEach(terraCoin => {
        // Ignore coins with no amount
        if (!parseFloat(terraCoin.available)) {
            return;
        }

        // Find corresponding market coin for given terra coin
        const denomObj: DenomMapping | undefined = denoms[terraCoin.denom];
        if (!denomObj) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(terraCoin.denom);
            return;
        }

        coinsWithoutPrices.push({
            id: denomObj.coinId,
            platform: Platform.TERRA,
            amount: parseFloat(terraCoin.available) / denomObj.unitsPerCoin,
        });
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Terra coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin(s) in crypto/terra/terraCoins.ts`);
    }

    return coinsWithoutPrices;
}

export default terraCoins;
