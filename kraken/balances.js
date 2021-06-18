const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');

const balances = async () => {
  const amounts = await amountsApi();
  const amountsFiltered = filterAmounts(amounts);

  const prices = await pricesApi(amountsFiltered.map(amount => amount.coin));
  const pricesFiltered = filterPrices(prices);

  return combineBalances(amountsFiltered, pricesFiltered);
};

const amountsApi = async () => {
  const nonce = new Date().getTime();
  const message = `nonce=${nonce}`;
  const signature = apiSign(process.env.KRAKEN_API_BALANCES_ENDPOINT, { nonce }, process.env.KRAKEN_PRIVATE_KEY, nonce);

  const res = await axios.post(process.env.KRAKEN_API_URI + process.env.KRAKEN_API_BALANCES_ENDPOINT, message, {
    headers: {
      'API-Key': process.env.KRAKEN_API_KEY,
      'API-Sign': signature,
    },
  });

  return res.data.result;
}

const pricesApi = async (coins) => {
  const assetPairs = await assetPairsApi();
  const assetPairsFiltered = filterAssetPairs(coins, assetPairs);

  const res = await axios.get(process.env.KRAKEN_API_URI + process.env.KRAKEN_API_PRICES_ENDPOINT, {
    params: {
      pair: assetPairsFiltered.join(','),
    }
  });

  return res.data.result;
}

const assetPairsApi = async () => {
  const res = await axios.get(process.env.KRAKEN_API_URI + process.env.KRAKEN_API_ASSET_PAIRS_ENDPOINT);

  return res.data.result;
}

// https://github.com/nothingisdead/npm-kraken-api
const apiSign = (path, request, secret, nonce) => {
  const message       = qs.stringify(request);
  const secret_buffer = new Buffer(secret, 'base64');
  const hash          = new crypto.createHash('sha256');
  const hmac          = new crypto.createHmac('sha512', secret_buffer);
  const hash_digest   = hash.update(nonce + message).digest('binary');
  const hmac_digest   = hmac.update(path + hash_digest, 'binary').digest('base64');

  return hmac_digest;
};

const filterAmounts = amounts => {
  const amountsFiltered = [];

  const keysFiltered = Object.keys(amounts).filter(key =>
    amounts[key].replace(".", "").replaceAll("0", "").length !== 0
  );
  keysFiltered.forEach(key => {
    const isStaking = key.split(".").length > 1;
    const coinWithoutPrefix = key.split(".")[0];

    amountsFiltered.push({
      coin: coinWithoutPrefix,
      type: isStaking ? "Staking" : "Spot",
      amount: amounts[key],
    });
  });

  return amountsFiltered;
}

const filterPrices = prices => {
  const pricesFiltered = [];

  const keys = Object.keys(prices);
  keys.forEach(key => {
    pricesFiltered.push({ pair: key, price: prices[key].c[0] })
  });

  return pricesFiltered;
};

const filterAssetPairs = (coins, assetPairs) => {
  const pairs = coins.map(coin => {
    if (coin === "ZUSD" || coin === "USD") {
      return assetPairs["USDCUSD"];
    }
    return Object.values(assetPairs).find(pair =>
      pair.base === coin && pair.quote === "ZUSD"
    );
  });
  return pairs
    .filter(pair => pair)
    .map(pair => pair.altname);
}

const combineBalances = (amountsFiltered, pricesFiltered) => {
  const balances = amountsFiltered;

  balances.forEach(balance => {
    let pricePair;
    if (balance.coin === "ZUSD" || balance.coin === "USD") {
      pricePair = pricesFiltered.find(price => price.pair === "USDCUSD");
    } else if (balance.coin === "XXDG") {
      pricePair = pricesFiltered.find(price => price.pair.includes("XDG"));
    } else {
      pricePair = pricesFiltered.find(price => price.pair.includes(balance.coin));
    }
    if (pricePair) {
      balance.balance = balance.amount * pricePair.price;
      balance.price = pricePair.price;
    }
  });

  return balances;
}

module.exports = balances;