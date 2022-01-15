import CoinId from "../CoinId";

const marketCoinMap: { [krakenCoinName: string]: CoinId } = {
    "AAVE": CoinId.AAVE,
    "ADA.S": CoinId.ADA,
    "ALGO": CoinId.ALGO,
    "ALGO.S": CoinId.ALGO,
    "ATOM": CoinId.ATOM,
    "BCH": CoinId.BCH,
    "DOT.S": CoinId.DOT,
    "ETH2": CoinId.ETH,
    "ETH2.S": CoinId.ETH,
    "LINK": CoinId.LINK,
    "LRC": CoinId.LRC,
    "MATIC": CoinId.MATIC,
    "SOL": CoinId.SOL,
    "SOL.S": CoinId.SOL,
    "USD.M": CoinId.ZUSD,
    "USDC": CoinId.USDC,
    "XBT.M": CoinId.BTC,
    "XETH": CoinId.ETH,
    "XLTC": CoinId.LTC,
    "XTZ": CoinId.XTZ,
    "XXBT": CoinId.BTC,
    "XXDG": CoinId.DOGE,
    "XXLM": CoinId.XLM,
    "XXMR": CoinId.XMR,
    "XXRP": CoinId.XRP,
    "ZUSD": CoinId.ZUSD,
};

export default marketCoinMap;
