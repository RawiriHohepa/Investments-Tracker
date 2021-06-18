import {
  AssetPair,
  AssetPairArrayLike,
  AssetPairPrice,
  amountsApi,
  assetPairsApi,
  pricesApi, AmountsArrayLike, PriceArrayLike
} from "./krakenApi";
import { Kraken } from "../types";

type Coin = {
  coin: string;
  type: "Staking" | "Spot";
  amount: number;
};

type Price = {
  pair: string;
  price: number;
};

const balances = async () => {
  const amountsResponse = await amountsApi();
  const coins = filterAmounts(amountsResponse);

  const coinNames = coins.map(amount => amount.coin);
  const assetPairsResponse = await assetPairsApi();
  const altNames = filterAssetPairs(coinNames, assetPairsResponse);

  const altNamesJoined = altNames.join(',');
  const pricesResponse = await pricesApi(altNamesJoined);
  const prices = filterPrices(pricesResponse);

  return combineBalances(coins, prices);
};

const filterAmounts = (amounts: AmountsArrayLike) => {
  const amountsFiltered: Coin[] = [];

  Object.keys(amounts).forEach(key => {
    const amount = parseFloat(amounts[key]);
    if (amount !== 0) {
      const isStaking = key.split(".").length > 1;
      const coinWithoutPrefix = key.split(".")[0];

      amountsFiltered.push({
        coin: coinWithoutPrefix,
        type: isStaking ? "Staking" : "Spot",
        amount,
      });
    }
  });

  return amountsFiltered;
}

const filterAssetPairs = (coins: string[], assetPairs: AssetPairArrayLike) => {
  const pairs: AssetPair[] = [];

  coins.forEach(coin => {
    if (coin === "ZUSD" || coin === "USD") {
      // USD Fiat
      pairs.push(assetPairs["USDCUSD"]);
    } else {
      // Anything else
      const pair = Object.values(assetPairs).find(pair =>
          pair.base === coin && pair.quote === "ZUSD"
      );
      if (pair) {
        pairs.push(pair);
      }
    }
  });

  return pairs.map(pair => pair.altname);
}

const filterPrices = (prices: PriceArrayLike) => {
  const pricesFiltered: Price[] = [];

  Object.keys(prices).forEach(key => {
    pricesFiltered.push({
      pair: key,
      price: parseFloat(prices[key].c[0]),
    });
  });

  return pricesFiltered;
};

const combineBalances = (coins: Coin[], prices: Price[]) => {
  const balances: Kraken[] = [];

  coins.forEach(coin => {
    let price: Price | undefined;
    if (coin.coin === "ZUSD" || coin.coin === "USD") {
      // USD Fiat
      price = prices.find(price => price.pair === "USDCUSD");
    } else if (coin.coin === "XXDG") {
      // Dogecoin
      price = prices.find(price => price.pair.includes("XDG"));
    } else {
      // Anything else
      price = prices.find(price => price.pair.includes(coin.coin));
    }
    if (price) {
      balances.push({
        ...coin,
        balance: coin.amount * price.price,
        price: price.price,
      });
    }
  });

  return balances;
}

module.exports = balances;