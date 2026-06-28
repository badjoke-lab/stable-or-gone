# Deployment canonicality review — seed and extra groups

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #226

## Scope

This review covers 39 deployment records in:

```text
data/deployments.json
data/deployments-extra.json
data/deployments-issuer-control-2026.json
```

The review records whether each row represents issuer-native issuance, a protocol-native asset, a legacy deployment, or an unresolved aggregate/related-asset context. Canonicality is reviewed separately from operational status, contract verification, and current redemption support.

## Result

```text
Reviewed deployments: 39
Issuer native: 25
Native: 9
Legacy: 3
Unknown: 2
```

Registry-wide canonicality after PR #226:

```text
Canonical bridge: 2
Issuer native: 55
Legacy: 10
Native: 31
Unknown: 32
Total: 130
```

Canonicality record state:

```text
Recorded: 102
Not recorded: 28
```

The not-recorded queue falls from 67 to 28. Those 28 batch A–E records are deferred to PR #227.

## Issuer-native decisions

Twenty-five records are issuer-native because the reviewed record identifies an issuer-supported or issuer-issued representation. This includes selected USDT, USDC, BUSD, TUSD, FDUSD, PYUSD, GUSD, RLUSD, EURC, USDP, USDG, and TRON USDT records.

`issuer_native` does not mean that the deployment is currently active, redeemable, fully verified, or supported in every jurisdiction. BUSD remains issuer-native even during wind-down, and chain identifiers may still require verification.

## Native decisions

Nine records are protocol-native or protocol-issued representations:

```text
DAI Ethereum
FRAX Ethereum
USDD TRON
LUSD Ethereum
crvUSD Ethereum
USDe Ethereum
USDS Ethereum
FRAX aggregate protocol context
USDD TRON context
```

The canonicality value does not resolve contract identity, operational status, or migration state.

## Legacy decisions

Three records are historical or explicitly legacy deployments:

```text
UST on Terra
sUSD on Ethereum
legacy sUSD on Optimism
```

`legacy` records historical canonicality. It does not itself set a terminal date or assert that all transfers, claims, or redemption routes have ended.

## Explicit unknown decisions

Two records receive an explicit `unknown` rather than remaining unrecorded:

```text
sog_dep_susds_ethereum_context
sog_dep_usds_bridge_context
```

sUSDS is a related savings token rather than a simple USDS deployment. The aggregate bridge context does not establish whether each chain representation is canonical, protocol-controlled, or third-party. A favorable classification is not inferred from the record name.

## Remaining queue

The remaining 28 not-recorded records are exactly the deployment rows in batches A–E. They include native, historical, issuer-supported, bridge, and synthetic records and are assigned to PR #227.

## Fixed rules

- Canonicality is separate from operational state.
- Issuer-native does not imply current redemption or verified contract identity.
- Legacy does not replace lifecycle or terminal status.
- Aggregate and related-asset contexts may remain explicitly unknown.
- Contract identity and verification are reviewed separately in PR #228–#229.
- Chain name alone is not evidence of canonicality.
- No deployment is classified from an unreviewed ticker or third-party name match.

## Data changes

PR #226 adds canonicality to 39 existing deployment rows. It adds no deployment record, contract address, evidence record, route, or public page.

## Deployment classification

```text
No production deployment required
```
