# PR-040 — Event Expansion Status Sync

Date: 2026-06-09

## Purpose

Synchronize public documentation and the registry update log with the event expansion and event UX work already present in the repository.

## Synchronized state

```txt
20 stablecoins
16 issuers
23 events
90 evidence records
40 reserve references
50 known unknowns
9 regulatory notes
37 deployments
75 static pages
```

## Included work

### Documentation

Updated:

```txt
docs/current-spec.md
docs/roadmap.md
```

The documents now reflect:

```txt
PR-036 event expansion pass 1
PR-037 event expansion pass 2
PR-038 event expansion pass 3
PR-039 event UX strengthening
23-event current baseline
30-event v0.1 target
PR-041 as the next work item
```

### Public registry updates

Updated:

```txt
data/registry-updates.json
```

Added public update entries for:

```txt
event layer expanded from 3 to 23 records
event search and filtering added
stablecoin event-count visibility added
```

## Deployment state

```txt
PR-038: successful Cloudflare build/deploy confirmed
PR-039: repository implementation confirmed
PR-039 post-change Cloudflare deploy: not explicitly confirmed in this document
```

The absence of an explicit PR-039 deploy confirmation is recorded as an operational check, not as evidence of a failed deployment.

## Compatibility note

Keep this file until validator/import cleanup safely removes the dependency:

```txt
data/known-unknowns-pr034.json
```

Its intended current content is an empty JSON array.

## Next work item

```txt
PR-041 Event quality pass / 30-event target
```

Priority targets:

```txt
FRAX exact-source events
TUSD exact-source events
USDD depeg / market-stress event
GUSD attestation-history event
LUSD V1 / V2 / BOLD lifecycle separation
crvUSD exact launch / collateral events
USDe exact launch / reserve / risk event
sUSD V2 / V3 transition event
```

## Acceptance notes

PR-040 changes documentation and public update data only. It does not alter stablecoin, issuer, event, evidence, reserve, regulatory, deployment, or known-unknown canonical content.