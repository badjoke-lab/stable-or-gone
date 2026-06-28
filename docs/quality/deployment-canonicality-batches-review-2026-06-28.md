# Deployment canonicality review — batches A–E

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #227

## Scope

This review covers the 28 deployment records in batches A–E that remained without a recorded canonicality after PR #226.

## Result

```text
Reviewed deployments: 28
Canonical bridge: 3
Issuer native: 5
Legacy: 8
Native: 9
Synthetic: 1
Unknown: 2
```

Registry-wide canonicality after PR #227:

```text
Canonical bridge: 5
Issuer native: 60
Legacy: 18
Native: 40
Synthetic: 1
Unknown: 6
Total: 130
```

Canonicality record state:

```text
Recorded: 130
Not recorded: 0
```

## Native and issuer-native decisions

Native records include protocol-issued or canonical issuance environments for MIM, RAI, GHO, BOLD, USD0, USR, USDm, PAXG, and XAUt.

Five EURS settlement-layer records are issuer-native because the issuer's own transparency material lists those networks as supported issuance or settlement environments.

## Legacy decisions

Eight records are historical, migrated, collapsed, or predecessor deployments:

```text
FEI Ethereum
USDN Waves
SAI Ethereum
IRON BNB Smart Chain
IRON Polygon
mUSD Ethereum
EURT Ethereum
EURT Omni
```

Legacy canonicality does not by itself settle current transferability, redemption, terminal date, or legal claims.

## Canonical bridge decisions

USD0 representations on Arbitrum, Base, and BNB Chain are recorded as canonical bridge representations because the protocol's own fact sheet identifies them as official cross-chain deployments tied to the primary Ethereum issuance environment.

## Synthetic decision

alUSD is recorded as `synthetic`, not generic `native`, because it is protocol-issued debt against yield-bearing collateral and represents a synthetic dollar liability rather than direct fiat or asset issuance.

## Explicit unknown decisions

EURS bridge representations on Arbitrum and Gnosis Chain remain explicit `unknown` for canonicality. The issuer source lists the representations but does not identify whether each bridge is issuer-controlled, canonical, or third-party.

## Fixed rules

- Every deployment must record a canonicality value.
- An officially listed bridge is not automatically a canonical bridge.
- Synthetic issuance remains distinct from protocol-native issuance.
- Historical or predecessor issuance is recorded as legacy.
- Canonical bridge classification requires reviewed official representation context.
- Explicit unknown is preferred to a guessed favorable classification.
- Verification and contract-identity review remain separate.

## Data changes

PR #227 adds canonicality to 28 existing deployment rows. No deployment, address, evidence record, route, or UI is added or removed.

## Follow-up

PR #228 reviews contract identity and explicit verification status across all 130 deployment records.

## Deployment classification

```text
No production deployment required
```
