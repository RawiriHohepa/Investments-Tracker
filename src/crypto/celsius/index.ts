import { CoinWithoutPrice } from "../types";
import { getAmounts } from "./api";
import { CelsiusAmounts } from "./types";
import marketCoinMap from "./marketCoinMap";
import CoinId from "../CoinId";
import Platform from "../Platform";

const celsius = async (): Promise<CoinWithoutPrice[]> => mapAmounts(await getAmounts());

const mapAmounts = (unmappedAmounts: CelsiusAmounts): CoinWithoutPrice[] => {
  const uniqueAmounts: { [coinId: string]: number } = {};
  const unrecognisedCoins: string[] = [];
  Object.keys(unmappedAmounts).forEach(celsiusCoinName => {
    // Ignore coins with no amount
    if (!parseFloat(unmappedAmounts[celsiusCoinName])) {
      return;
    }

    // Find corresponding market coin
    const coinId = marketCoinMap[celsiusCoinName];
    if (!coinId) {
      // Collate all unmapped coins to return in an Error
      unrecognisedCoins.push(celsiusCoinName);
      return;
    }

    // Combine celsius coins that share the same market coin
    if (!!uniqueAmounts[coinId]) {
      uniqueAmounts[coinId] = uniqueAmounts[coinId] + parseFloat(unmappedAmounts[celsiusCoinName]);
    } else {
      uniqueAmounts[coinId] = parseFloat(unmappedAmounts[celsiusCoinName]);
    }
  });
  if (unrecognisedCoins.length) {
    throw new Error(`Celsius coin(s) not recognised: [${unrecognisedCoins.join(",")}]\nPlease map the coin(s) to the corresponding market coin symbol(s) in crypto/celsius/marketCoinMap.ts`);
  }

  return Object.keys(uniqueAmounts).map(coinId => ({
    id: coinId as CoinId,
    platform: Platform.CELSIUS,
    amount: uniqueAmounts[coinId],
  }));
}

export default celsius;
