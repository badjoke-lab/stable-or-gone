# PR #334 controlled growth activation — CADC and ZARP

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
PR #330 100 -> 102 controlled growth: complete
PR #331 Stats contrast and responsive UI remediation: complete
PR #332 102 -> 104 controlled growth: complete
PR #333 104 -> 106 controlled growth: complete
PR #334 106 -> 108 controlled growth: active
PR #335 108 -> 110 controlled growth: next
```

## Promotion allocation

PR #334 may promote only:

```text
sog_cand_000107 -> sog_st_cadc    CADC / Loon
sog_cand_000108 -> sog_st_zarp    ZARP Stablecoin
```

## CADC identity correction and current-state boundary

PR #334 corrects the PR #329 audit-stage issuer misattribution that associated CADC with Stablecorp. Current primary sources identify Loon as current CADC issuer, while Stablecorp's current Canadian-dollar stablecoin product is QCAD.

The reviewed Loon source chain establishes:

- CADC current identity and Loon issuer responsibility;
- Loon's 2025-10-27 acquisition of CADC and assumption of issuer responsibility;
- PayTrie as the original issuer context and 2021 as the historical launch year;
- 1:1 Canadian-dollar reserve backing;
- reserves held in a segregated cash account at ATB Financial;
- monthly third-party attestation publication;
- direct 1:1 minting and redemption for users who complete Loon signup and verification;
- permissionless wallet holding, sending, and receiving;
- exact current identifiers on Ethereum, Base, Polygon, Arbitrum, and Solana;
- Ethereum as native issuance and Base, Polygon, Arbitrum, and Solana as bridged representations according to current Loon product materials.

The exact original CADC launch day remains unresolved. The 2021 year-level statement and the 2025 issuer transition are not coerced into a day-level launch date.

## ZARP current-state boundary

The reviewed ZARP source chain establishes:

- active South African rand stablecoin status;
- 1:1 rand reserve backing;
- reserves managed by Old Mutual Wealth;
- current treasury transparency and independent attestation context;
- approved-partner issuance and redemption;
- authorised-wallet and institution-name bank-account requirements;
- token destruction on redemption before corresponding fiat settlement;
- current officially documented native issuance/redemption support on Base, Ethereum, Polygon, and Solana;
- exact current EVM and Solana identifiers;
- a dated 2025-07-11 Solana Token-2022 migration announcement.

Gnosis branding or ecosystem references on the public homepage are not treated as current native issuer-supported deployment evidence because the official blockchain documentation defines current native issuance/redemption support as Base, Ethereum, Polygon, and Solana.

The exact original ZARP asset launch day remains unresolved.

## Canonical count transition

```text
stable assets:       106 -> 108
organizations:        99 -> 101
relationships:       116 -> 118
classifications:     106 -> 108
profiles:            106 -> 108
events:              183 -> 185
event details:       183 -> 185
evidence:            525 -> 537
reserve reports:     114 -> 116
known unknowns:      307 -> 313
deployments:         159 -> 168
legal profiles:      106 -> 108
reserve components:  139 -> 141
income profiles:     106 -> 108
```

## Event boundary

PR #334 adds two canonical events:

```text
2025-10-27  CADC issuer transition to Loon
2025-07-11  ZARP Solana Token-2022 migration
```

The CADC event records issuer succession and does not replace the unresolved original launch day. The ZARP event records the current Solana migration boundary and does not imply that the asset itself launched in 2025.

## Deployment boundary

PR #334 adds nine exact deployment rows:

```text
CADC: Ethereum, Base, Polygon, Arbitrum, Solana
ZARP: Base, Ethereum, Polygon, Solana
```

All nine exact identifiers are taken from current first-party product or documentation surfaces. CADC Ethereum is recorded as issuer-native and the four additional CADC networks as canonical bridge representations according to current Loon wording. ZARP's four documented networks are recorded as issuer-native.

Deployment verification growth is stored in an additive PR334 overlay and composed with the protected PR229 verification base at audit time.

## Statistics checkpoint boundary

The audited 100-asset checkpoint and reviewed 102/104/106 checkpoints remain immutable historical evidence.

PR #334 introduces:

```text
sog_controlled_growth_108_checkpoint_pr334_2026_07_09
```

The reviewed 108-asset statistics snapshot may only be appended after the exact 100/102/104/106 snapshot prefix.

## Completion condition

PR #334 completes when:

- exactly candidates 107 and 108 are promoted;
- candidate 107's issuer identity correction is enforced by candidate-control validation;
- canonical stable asset count is exactly 108;
- both assets remain lifecycle-active while direct issuance/redemption access restrictions remain explicit in separate fields;
- two canonical events and typed details preserve issuer-transition and token-migration boundaries;
- twelve reviewed evidence records support identity, issuer, reserve, redemption, deployment, compliance, and event claims;
- nine exact deployment identifiers are verified through composed deployment-verification overlays;
- six explicit known-unknown records preserve unresolved launch, historical lineage, reserve-history, and migration-lineage questions;
- current Registry v2/v3, public counts, routes, statistics, and provenance baselines bind the 108-asset checkpoint;
- the 108-asset statistics snapshot is appended without rewriting the 100/102/104/106 history prefix;
- full CI and independent audit workflows are green.
