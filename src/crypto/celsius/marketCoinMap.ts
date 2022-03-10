import CoinId from "../CoinId";

const marketCoinMap: { [celsiusCoinName: string]: CoinId } = {
    "btc": CoinId.BTC,
    "eth": CoinId.ETH,
};

export default marketCoinMap;
