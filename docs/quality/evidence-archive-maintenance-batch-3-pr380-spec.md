# PR #380 Evidence and Archive Maintenance Batch 3 Specification

Status: reviewed implementation complete; merge pending  
Review PR: 380  
Public surface: unchanged

## Objective

Manually review exactly the ten PR #378 Evidence identities and apply only source-safe archive additions or source replacements supported by reviewed exact evidence.

## Required inputs

```text
config/evidence-archive-maintenance-batch-3-pr380.json
config/evidence-archive-maintenance-batch-3-pr380-decisions.json
docs/migration/post-pr378-review-gate-pr379.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378.json
docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json
config/evidence-archive-review-history-v1-pr377.json
docs/migration/evidence-archive-review-history-manifest-pr377.json
docs/migration/evidence-archive-review-history-audit-pr377.json
docs/migration/current-canonical-checkpoint.json
```

## Review protocol

For every selected Evidence identity:

1. inspect the current canonical URL and claim scope;
2. test the exact source URL and redirect boundary;
3. inspect available dated archive captures;
4. verify that any accepted capture is the same source identity and supports the recorded source-version scope;
5. accept a replacement only when claim scope and source-version equivalence are reviewed;
6. otherwise retain the canonical row and record `reviewed_no_safe_change`.

## Allowed outcomes

```text
dated_exact_archive_added
reviewed_source_replacement
reviewed_no_safe_change
```

Exactly one outcome is required for each of the ten identities.

## Reviewed result

```text
selected identities: 10
canonical records changed: 10
dated exact archives added: 9
reviewed source replacements: 1
reviewed no-safe-change: 0
archive recorded: 390 → 399
archive not recorded: 169 → 160
canonical Evidence identities: 559
Evidence Relations: 559
assets: 112
```

The sole source replacement is the Circle Mint route:

```text
https://www.circle.com/mint
→ https://www.circle.com/circle-mint
```

The old route produced no exact dated capture and redirects successfully to the same Circle Mint product identity and business minting/conversion claim scope. No archive was inferred for that replacement.

## Required outputs

```text
docs/migration/evidence-archive-maintenance-batch-3-pr380-review-queue.json
docs/migration/evidence-archive-maintenance-outcomes-pr380.json
docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json
```

## Canonical constraints

- at most ten existing Evidence records may be touched;
- no Evidence identity may be added or removed;
- no Evidence Relation may change;
- no selected ID may be substituted;
- every accepted archive must be a dated exact-source capture;
- every accepted replacement must preserve reviewed claim scope and source-version meaning;
- unselected canonical Evidence must remain byte-equivalent by record projection;
- canonical counts remain 112 assets and 559 Evidence identities.

## Validation

- exact selected-ID set and deterministic queue identity;
- one reviewed outcome per selected ID;
- field-level canonical diff limited to accepted outcomes;
- exact 390/169 to 399/160 archive transition;
- no wildcard archive accepted as a dated capture;
- no automatic capture or replacement;
- immutable PR #377–#379 inputs;
- canonical registry, Evidence relation, parity, release-integrity, statistics-history, Astro check, build, and public-layer safety;
- final authority is `REVIEW GATE`.

## Prohibited work

- any Evidence identity outside the selected ten;
- new Evidence identities or relation changes;
- asset, organization, deployment, Market Access, dossier, ranking, score, recommendation, or public-surface changes;
- automatic monitoring/editorial promotion;
- work after PR #380 without a new review gate.
