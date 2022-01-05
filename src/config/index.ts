const config = {
    CRYPTO_MINIMUM_VALUE: 0.01,

    COINGECKO_API_URL: "https://api.coingecko.com/api",
    COINGECKO_PRICES_ENDPOINT: "/v3/coins/markets",

    KRAKEN_API_URI: "https://api.kraken.com",
    KRAKEN_API_BALANCES_ENDPOINT: "/0/private/Balance",
    KRAKEN_API_PRICES_ENDPOINT: "/0/public/Ticker",
    KRAKEN_API_ASSET_PAIRS_ENDPOINT: "/0/public/AssetPairs",

    NEXO_API_URL: "https://platform.nexo.io/api/1",
    NEXO_API_BALANCES_ENDPOINT: "/get_balances",

    ERGO_API_URL: "https://api.ergoplatform.com/addresses",
    CARDANOSCAN_URL: "https://cardanoscan.io/stakeKey",

    TERRA_API_URL: "https://fcd.terra.dev/v1/bank",
}

export default config;
