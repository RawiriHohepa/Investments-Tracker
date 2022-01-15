import axios from "axios";
import config from "../../config";
import { GetAmountsResponse, GetAmountsResponseBalance } from "./types";
import CoinId from "../CoinId";
import { CoinWithoutPrice } from "../types";
import Platform from "../Platform";

type DenomMapping = {
    coinId: CoinId;
    unitsPerCoin: number;
}

const denomMappings: { [s: string]: DenomMapping } = {
    uluna: {
        coinId: CoinId.LUNA,
        unitsPerCoin: 1000000,
    },
    uusd: {
        coinId: CoinId.UST,
        unitsPerCoin: 1000000,
    }
}

const nativeCoins = async (): Promise<CoinWithoutPrice[]> => mapAmounts(await getAmounts());

const getAmounts = async (): Promise<GetAmountsResponse> => {
    if (!process.env.TERRA_ADDRESS) {
        throw new Error("TERRA_ADDRESS key not found in .env file");
    }

    const response = await axios.get<GetAmountsResponse>(`${config.TERRA_API_URL}/${process.env.TERRA_ADDRESS}`);
    return response.data;
}

const mapAmounts = (unmappedAmounts: GetAmountsResponse): CoinWithoutPrice[] => {
    const coinsWithoutPrices: CoinWithoutPrice[] = [];
    const unrecognisedCoins: string[] = [];
    unmappedAmounts.balance.forEach((terraCoin: GetAmountsResponseBalance) => {
        // Ignore coins with no amount
        if (!parseFloat(terraCoin.available)) {
            return;
        }

        // Find corresponding market coin
        const denomMapping: DenomMapping | undefined = denomMappings[terraCoin.denom];
        if (!denomMapping) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(terraCoin.denom);
            return;
        }

        coinsWithoutPrices.push({
            id: denomMapping.coinId,
            platform: Platform.TERRA,
            amount: parseFloat(terraCoin.available) / denomMapping.unitsPerCoin,
        });
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Terra coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin(s) in crypto/terra/nativeCoins.ts`);
    }

    return coinsWithoutPrices;
}

export default nativeCoins;
