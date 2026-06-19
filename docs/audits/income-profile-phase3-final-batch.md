# Income-profile Phase 3 Final Batch

Updated: 2026-06-20

This batch resolves the final 21 all-unknown Registry v3 income profiles.

## Plain non-accruing base assets

UST, BUSD, USDD, sUSD, FEI, USDN, PAXG, XAUT, SPOT, USD0, USR, SAI, HUSD, IRON, EURS, EURT, USDm, alUSD, and Acala aUSD are classified without intrinsic holder income.

This does not copy reserve earnings, collateral yield, external lending rates, staking positions, savings wrappers, commodity-price appreciation, or protocol incentives onto the canonical base token.

## RAI

RAI is not treated as a fixed-dollar yield token. Its protocol redemption rate changes the protocol redemption price without rebasing token balances. The profile records protocol-determined native mechanics using the protocol-position accrual category.

## SPOT

SPOT is an index-linked, non-rebasing perpetual note. AMPL tranche and rotation mechanics are part of stabilization and valuation, not holder income on the SPOT balance.

## NUON

NUON is the only remaining native rebasing profile in this batch. Existing protocol documentation describes positive inflation-linked rebasing; the profile uses mixed source, balance rebase, and variable rate.

## Queue impact

```text
All-unknown income profiles: 21 → 0
Canonical income profiles:   70 unchanged
Canonical stable assets:     70 unchanged
```

No live APY, ranking, campaign, or market-performance data is added.

## Deployment classification

No production deployment required. Cloudflare access is not used.
