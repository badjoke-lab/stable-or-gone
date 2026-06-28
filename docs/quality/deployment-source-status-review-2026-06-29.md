# Deployment source-status finalization

Status: supporting audit  
Date: 2026-06-29  
Roadmap item: PR #229

## Scope

PR #229 reviews the fifteen deployment rows previously classified as `review_needed` and the one historical UST row previously classified as `unknown`.

## Result

```text
Deployments reviewed: 16
Contract or mint identifiers resolved: 15
Native denomination identifiers resolved: 1
Verified deployments after review: 16
Source review needed after review: 0
Unknown verification states after review: 0
Total deployment verification coverage: 130 / 130
```

The remaining 114 deployment rows retain their PR #228 conservative classifications:

```text
Identifier recorded, verification not recorded: 45
Source linked, identifier not recorded: 69
```

## Resolved identifiers

| Deployment | Network | Identifier type | Identifier |
|---|---|---|---|
| USDT | Ethereum | EVM contract | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| DAI | Ethereum | EVM contract | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |
| UST | Terra Classic | Native denomination | `uusd` |
| BUSD | Ethereum | EVM contract | `0x4fabb145d64652a948d72533023f6e7a623c7c53` |
| FRAX | Ethereum | EVM contract | `0x853d955aCEf822Db058eb8505911ED77F175b99e` |
| TUSD | Ethereum | EVM contract | `0x0000000000085d4780B73119b644AE5ecd22b376` |
| FDUSD | Ethereum | EVM contract | `0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409` |
| PYUSD | Ethereum | EVM contract | `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8` |
| PYUSD | Solana | Solana mint | `2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo` |
| USDD | TRON | TRON contract | `TCrEVahRbhDFB6uRXEWUg7wkptXvg47GKs` |
| GUSD | Ethereum | EVM contract | `0x056Fd409E1d7A124BD7017459dFEa2F387B6d5Cd` |
| LUSD | Ethereum | EVM contract | `0x5f98805A4E8be255a32880FDeC7F6728C6568bA0` |
| crvUSD | Ethereum | EVM contract | `0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E` |
| USDe | Ethereum | EVM contract | `0x4c9EDD5852cd905f086C759E8383e09bff1E68B3` |
| sUSD | Ethereum | EVM contract | `0x57Ab1ec28D129707052df4dF418D58a2D46d5f51` |
| sUSD | Optimism | EVM contract | `0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9` |

## UST modeling decision

Historical UST was a native Terra bank-module denomination, not a smart-contract token. Its deployment row therefore records:

```text
identifier_type: native_denom
deployment_identifier: uusd
contract_address: null
```

This avoids coercing a native denomination into a contract-address field and preserves the distinction between the original UST identity, the later USTC name, and the post-collapse Terra Classic lifecycle.

## Verification rule

`verified` in this review means that the deployment identifier and network pairing were directly confirmed against official issuer, protocol, developer, signed-report, or project-controlled technical material on 2026-06-29. It does not mean:

- the asset is safe;
- the deployment is currently mintable or redeemable;
- the deployment is economically healthy;
- the deployment remains issuer-supported;
- the asset's broader lifecycle status is active.

Operational state, canonicality, issuer support, bridge status, and verification remain separate fields.

## Machine-readable files

- `data/deployments.json` contains the resolved identifiers.
- `data/deployment-verification-pr229.json` contains the 130-record current verification overlay and the sixteen reviewed source decisions.
- `scripts/validate-deployment-source-status-pr229.mjs` checks exact identifier parity, source URLs, counts, and absence of unresolved sentinels.

## Follow-up

The deployment-quality sequence is complete. The active workstream advances to PR #230, the first review-only monitoring-pipeline implementation.

## Deployment classification

```text
No production deployment required
```
