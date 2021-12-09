type BaseLatestQuotesResponse<Type> = {
    "status": {
        "timestamp": string,
        "error_code": number,
        "error_message": string,
        "elapsed": number,
        "credit_count": number,
        "notice": string
    },
    "data": {
        [symbol: string]: Type,
    }
}

type BaseLatestQuotesResponseCoin = {
    "id": number,
    "name": string,
    "symbol": string,
    "slug": string,
    "num_market_pairs": number,
    "date_added": string,
    "tags": string[],
    "max_supply": number,
    "circulating_supply": number,
    "total_supply": number,
    "is_active": number,
    "platform": {
        id: number,
        name: string,
        symbol: string,
        slug: string,
        token_address: string
    },
    "cmc_rank": number,
    "is_fiat": number,
    "last_updated": string,
}

type BaseLatestQuotesResponseQuote = {
    "price": number,
    "volume_24h": number,
    "percent_change_1h": number,
    "percent_change_24h": number,
    "percent_change_7d": number,
    "percent_change_30d": number,
    "percent_change_60d": number,
    "percent_change_90d": number,
    "market_cap": number,
    "market_cap_dominance": number,
    "fully_diluted_market_cap": number,
    "last_updated": string
}

export type LatestQuotesResponseUsd = BaseLatestQuotesResponse<
    BaseLatestQuotesResponseCoin & {
        "quote": {
            "USD": BaseLatestQuotesResponseQuote
        }
    }
>;

export type LatestQuotesResponseNzd = BaseLatestQuotesResponse<
    BaseLatestQuotesResponseCoin & {
        "quote": {
            "NZD": BaseLatestQuotesResponseQuote
        }
    }
>;
