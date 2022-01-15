import { CoinWithoutPrice } from "../types";
import {
    GetAmountsResponseBalance,
    GetAmountsResponse
} from "./types";
import Platform from "../Platform";
import CoinId from "../CoinId";
import getAmounts from "./api";

const nexo = async (nsi: string): Promise<CoinWithoutPrice[]> => mapAmounts(await getAmounts(nsi));

const mapAmounts = (unmappedAmounts: GetAmountsResponse): CoinWithoutPrice[] => {
    const coinsWithoutPrices: CoinWithoutPrice[] = [];
    const unrecognisedCoins: string[] = [];
    unmappedAmounts.balances.forEach((nexoCoin: GetAmountsResponseBalance) => {
        // Ignore coins with no amount
        if (!nexoCoin.total_balance) {
            return;
        }

        // Find corresponding market coin
        const coinId: CoinId | undefined = CoinId[nexoCoin.currency_identity];
        if (!coinId) {
            // Collate all unmapped coins to return in an Error
            unrecognisedCoins.push(nexoCoin.currency_identity);
            return;
        }

        coinsWithoutPrices.push({
            id: coinId,
            platform: Platform.NEXO,
            amount: nexoCoin.total_balance,
        });
    });
    if (unrecognisedCoins.length) {
        throw new Error(`Nexo coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin symbol(s) in crypto/coinId.ts`);
    }

    return coinsWithoutPrices;
}

export default nexo;
