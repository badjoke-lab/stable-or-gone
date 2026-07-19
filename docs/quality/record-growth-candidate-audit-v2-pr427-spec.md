# PR #427 Record Growth Candidate Audit v2 Specification

Status: reviewed internal audit  
Deployment class: private research and planning only

## 1. Authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-18-pr426-post-ui-v3-data-growth-reset.md
docs/quality/post-ui-v3-data-growth-reset-pr426-spec.md
config/post-ui-v3-data-growth-reset-pr426.json
docs/migration/post-ui-v3-data-growth-reset-pr426.json
```

PR #426 authorizes exactly PR #427 as a private, noncanonical candidate audit over no more than twelve leads, followed by a mandatory review gate.

## 2. Reviewed scope

The audit reviews eleven leads:

```text
Open USD / OUSD
FIUSD / FIUSD
AllUnity EUR / EURAU
AllUnity CHF / CHFAU
AllUnity SEK / SEKAU
Quantoz EURQ / EURQ
Quantoz USDQ / USDQ
Quantoz PLNQ / PLNQ
Quantoz GBPQ / GBPQ
Resolv USD / USR
Roughrider Coin / symbol unresolved
```

## 3. Duplicate findings

Four leads are exact existing canonical identities and are not growth candidates:

```text
EURAU -> sog_st_eurau -> data/stablecoins-batch-p.json
EURQ  -> sog_st_eurq  -> data/stablecoins-batch-j.json
USDQ  -> sog_st_usdq  -> data/stablecoins-batch-f.json
USR   -> sog_st_usr   -> data/stablecoins-batch-c.json
```

The audit must classify these rows `duplicate_existing`. Existing record gaps or current incidents belong to maintenance, event, or dossier work, not duplicate asset promotion.

## 4. Review-ready pool

Four distinct launched identities have enough primary-source coverage to proceed to full-record review, but are not canonical and are not authorized for promotion in PR #427:

```text
CHFAU
SEKAU
PLNQ
GBPQ
```

Two non-ranking context pairs are recorded for the review gate:

```text
AllUnity regulated non-EUR expansion: CHFAU + SEKAU
Quantoz regulated non-EUR expansion: PLNQ + GBPQ
```

The pairing is for coherent research context only. It is not a quality, safety, importance, or investment ranking.

## 5. Deferred and blocked rows

```text
Open USD: deferred
FIUSD: insufficient_evidence
Roughrider Coin: prelaunch_or_noncanonical
```

Open USD is integrated into an initially select-client beta platform, but the current checkpoint does not establish the full legal issuer, reserve, contract, and public-circulation record families.

FIUSD has a current official product page and launch announcement, but legal issuance identity, canonical contracts, reserve-report series, and first public issuance remain insufficient for a complete-record commitment.

Roughrider Coin has an official announcement and 2026 availability target, but no confirmed current launch, symbol, contract identity, or circulation evidence in this checkpoint.

## 6. Source rules

Each row records source identity, publisher, URL, source type, primary-source status, and bounded claim scopes. A source lead is not canonical Evidence. PR #427 does not create Evidence records.

`ready_for_full_record_review` means only that a complete manual record review is justified. It does not mean the candidate is accepted, safe, widely available, or ready for automatic promotion.

## 7. Required outputs

```text
data/editorial-research/record-growth-candidate-audit-v2-pr427.json
docs/migration/record-growth-candidate-audit-v2-pr427-duplicate-report.json
docs/migration/record-growth-candidate-audit-v2-pr427-source-coverage.json
docs/migration/record-growth-candidate-audit-v2-pr427-handoff.json
```

## 8. Hard boundaries

PR #427 changes no canonical asset, organization, relationship, event, Evidence, Evidence Relation, deployment, reserve report, legal profile, Market Access Record, statistics snapshot, public route, public machine-readable output, metadata contract, or UI.

Candidate files remain private. Automatic promotion and automatic canonical PR creation remain disabled. No ranking, score, endorsement, recommendation, or thin record is permitted.

## 9. Exit state

```text
REVIEW GATE
```

The review gate may authorize at most two complete records in a later Record Growth Batch 2. It must choose a bounded context only after reviewing source coverage and full-record feasibility. PR #427 itself authorizes no canonical change.
