# Launch Date Boundary Review — Batch 1 Specification

Status: canonical work-item specification  
Authority PR: #502  
Implementation PR: #503

## Scope

Review exactly six canonical records whose launch dates are null and whose current unresolved-queue entries lack a complete reviewed-source checkpoint.

| Canonical ID | Review focus |
| --- | --- |
| `sog_st_msusd` | announcement, legacy/current contract lineage, first mint, first redeemable availability |
| `sog_st_stablesusdx` | product announcement, deployment, approved access, first issuance |
| `sog_st_susde` | USDe launch versus sUSDe staking activation and first public staking availability |
| `sog_st_usd1` | planned launch, contract deployment, first mint, testing, broad availability |
| `sog_st_usdm` | original Celo Dollar launch versus later Mento Dollar rename and multichain expansion |
| `sog_st_usdh` | proposal, ticker award, capped mint/redeem phase, HyperCore activation, public spot availability |

## Required source order

1. issuer, protocol, foundation, governance, or official product publication;
2. official technical documentation and verified contract or transaction metadata;
3. official partner publication when it directly records the operational boundary;
4. high-quality contemporaneous reporting only as corroboration, never as the sole basis when a primary source is available.

## Canonical date rule

A date may be written to `launch_date` only when all of the following are true:

- the source is primary and identifies the same canonical asset identity;
- the source provides an exact calendar day;
- the described action matches the intended launch boundary;
- lineage, wrapper, network, and rebrand distinctions are resolved;
- the date is not inferred from publication metadata alone;
- supporting Evidence and Evidence Relation records exist.

## Null-preservation rule

When the evidence supports only a month, year, range, deployment date, proposal date, first mint, exchange listing, network launch, or rebrand boundary, the canonical launch date remains null. The queue entry must then record:

- `best_known_range`;
- a specific `reason_code`;
- a substantive `review_note`;
- `last_reviewed: 2026-08-01`;
- all reviewed primary-source URLs.

## Allowed implementation changes

- the six named canonical stablecoin rows, limited to `launch_date` and review metadata already owned by those records;
- `data/quality/launch-date-unresolved.json`;
- canonical Evidence and Evidence Relations directly supporting named launch claims;
- a private source-review artifact and a blocking validator;
- forward-only checkpoint material required by deterministic counts or provenance when canonical Evidence changes.

## Prohibited changes

- any seventh target or replacement target;
- new assets, issuers, relationships, deployments, Market Access records, route families, guides, rankings, scores, recommendations, or material UI changes;
- converting deployment, announcement, rebrand, migration, or listing dates into launch dates without explicit equivalence;
- deleting unrelated unknowns;
- automatic continuation after PR #503.

## Acceptance

PR #503 is acceptable only when all six targets have a disposition, all canonical changes are individually evidenced, unresolved dates remain null, full CI passes, production converges exactly after merge, and the repository returns to REVIEW GATE.
