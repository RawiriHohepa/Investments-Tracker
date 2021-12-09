export type GetBalancesResponse = {
    access: boolean;
    payload: {
        balances: GetBalancesResponseBalances[];
        total_collateral_value: number;
        total_amount_in_credit_wallet_in_usd: number;
        total_amount_in_deposit_wallet_in_usd: number;
        total_amount_in_locked_wallet_in_usd: number;
        total_crypto_amount_in_deposit_wallet_in_usd: number;
        total_portfolio_balance: number;
        total_overdaft_limit: number;
        outstanding_overdraft: number;
        outstanding_overdraft_undiscounted: number;
        requested_outstanding_overdraft: number;
        liquidatable_requested_outstanding_overdraft: number;
        liquidated_requested_outstanding_overdraft: number;
        oo_liquidation_margine_percent: number;
        liquidation_limit: number;
        liquidation_deficit: number;
        liquidation_deficit_main: number;
        liquidation_deficit_micro: number;
        available_overdraft_limit_in_credit_wallet: number;
        available_overdraft_limit_in_credit_wallet_unsigned: number;
        available_overdraft_limit_in_deposit_wallet: number;
        available_overdraft_limit_in_deposit_wallet_unsigned: number;
        available_overdraft_limit: number;
        available_overdraft_limit_main: number;
        available_overdraft_limit_main_unsigned: number;
        available_collateral_value: number;
        rest_interest: number;
        interest: number;
        outstanding_overdraft_interest: number;
        is_migrated_to_earnable_account_v2: number;
        auto_move_deposit_to_collateral_enabled: number;
        outstanding_overdraft_interest_undiscounted: number;
        earn_in_collateral_id_preference: any;
        total_fiatx_balance_in_usd: number;
    }
}

type GetBalancesResponseBalances = {
    collateral_id: number;
    currency_id: number;
    currency_identity: string;
    liquidation_priority_order: number;
    name: string;
    short_name: string;
    balance: number;
    deposit_balance: number;
    deposit_balance_in_usd: number;
    locked_balance: number;
    earning_balance: number;
    total_balance: number;
    total_earned_interest: number;
    enabled_as_collateral: number;
    balance_main: number;
    requested_for_withdrawal_balance: number;
    collateral_value: number;
    collateral_value_main: number;
    overdaft_limit: number;
    transferable_to_deposit_overdaft_limit: number;
    aol_in_credit_wallet: number;
    aol_in_deposit_wallet: number;
    ltv: number;
    deposit_disabled: boolean;
    withdrawal_disabled: boolean;
    repayment_disabled: number;
    overdaft_disabled: boolean;
    usd_course: number;
    minimum_sell_order_size: number;
    max_repayment_value: number;
    transfer_to_credit_wallet_priority: number;
    interest_earning_enabled: number;
    bundle_collateral_id: number;
    position: number;
    available_for_transfer_to_deposit_wallet: number;
    available_for_withdrawal: number;
    io: {
        assets: {
            1: {
                available_in_deposit: number;
                total_available: string;
            }
        }
    }
};
