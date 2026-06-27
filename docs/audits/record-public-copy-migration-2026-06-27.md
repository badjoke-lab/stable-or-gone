# Record-Specific Public Copy and 92-Record Migration Audit

Date: 2026-06-27  
Phase: Phase 2 — public taxonomy and canonical-semantics repair  
Plan unit: PR 16 — move record-specific public copy out of components and complete the 92-record migration

## Result

Status: **PASS**

PR 16 removes the remaining asset-specific summary table from the stablecoin rendering component, moves the reviewed copy into an approved data overlay keyed by canonical stablecoin ID, and validates all 92 current stable-asset records against the repaired PR 5–15 semantics.

## Public-copy migration

Before migration:

```text
Source:                         src/components/StablecoinDetailView.astro
Representation:                 embedded publicSummaries map keyed by slug
Reviewed summary overrides:     20
Canonical-summary fallbacks:    72
Stable assets covered:          92
```

After migration:

```text
Source:                         src/data/stablecoinPublicCopy.ts
Representation:                 approved public-copy overlay keyed by canonical stablecoin ID
Reviewed summary overrides:     20
Canonical-summary fallbacks:    72
Stable assets covered:          92
```

The rendering component now calls `getStablecoinPublicSummary(coin)` for every record. It contains no asset-specific summary table.

## Before-and-after preservation

The pre-migration summary set is recorded in:

```text
docs/migration/record-public-copy-baseline.json
```

The generated preservation report verifies:

```text
Stablecoin count preserved:              true
Summary override count preserved:        true
Canonical fallback count preserved:      true
Summary override ID set preserved:       true
Summary text digest preserved:           true
Overall preservation result:             PASS
```

The reviewed summary-map digest remained:

```text
sha256:90fbe0de0a5d9d34ae8b387141ab31241f98337b8d740927e26376d57af46c7c
```

No summary wording changed during the migration.

## 92-record migration matrix

```text
Stable assets audited:                  92
Migration-ready records:                92
Incomplete records:                      0
Unique stablecoin routes:               92
Records missing identity:                0
Records missing organization relation:   0
Records missing evidence relation:       0
Records missing public source identity:  0
```

Each matrix row records:

- canonical stablecoin ID;
- slug and public route;
- lifecycle and issuance state;
- organization relationship count;
- event count;
- canonical evidence relation count;
- public source identity count;
- reserve-report count;
- known-unknown count;
- deployment count;
- public-copy occurrence inventory;
- migration readiness.

## Canonical and public evidence preservation

```text
Canonical evidence relations:     455
Public source identities:          410
Orphan source relation IDs:          0
Invalid stablecoin relation IDs:     0
```

PR 16 does not change the source-identity or relation model completed in PR 15.

## Source-code occurrence audit

The scanner examined 77 source files and found 595 stablecoin-specific textual occurrences across 22 files. These are not all defects. Every finding is assigned an explicit disposition.

```text
Unresolved migration targets:       0
Approved data-overlay occurrences: 270
Editorial references:              319
Search examples:                     4
Schema examples:                     2
Shared-infrastructure references:    0
Total occurrences:                 595
```

Disposition meanings:

- `migration_target`: record-specific copy embedded in a reusable rendering component or unapproved page surface;
- `approved_data_overlay`: reviewed record copy or editorial linkage intentionally stored in `src/data/`;
- `editorial_reference`: intentional named examples in guides, methodology, glossary, model, support, or home-page editorial content;
- `search_example`: intentional example query text;
- `schema_example`: illustrative schema content;
- `shared_infrastructure`: intentional stablecoin-specific reference in shared implementation code.

Only `migration_target` is release-blocking. Its final count is zero.

## Validation artifacts

```text
data/generated/record-public-copy-audit.json
data/generated/record-public-copy-preservation.json
data/generated/record-public-copy-validation.json
```

Generated artifacts contain:

- the full 92-record migration matrix;
- every scanned occurrence with file, line, context, stablecoin ID, surface, and disposition;
- the before-and-after copy-preservation result;
- unresolved-file inventory;
- relation-integrity checks;
- deterministic inventory digest.

## Protected implementation

```text
src/data/stablecoinPublicCopy.ts
scripts/record-public-copy-audit-lib.mjs
scripts/record-public-copy-occurrences.mjs
scripts/record-migration-matrix.mjs
scripts/collect-record-public-copy-audit.mjs
scripts/validate-record-public-copy-audit.mjs
.github/workflows/record-public-copy-migration.yml
```

The main build and site build both regenerate and validate the audit.

## Gate C conclusion

PRs 5–16 now provide:

- normalized public taxonomy;
- separated lifecycle and issuance semantics;
- reference-target and backing-model normalization;
- event and organization taxonomy;
- evidence provenance, reliability, type, source identity, and relation separation;
- deployment operational and verification-state separation;
- explicit value states;
- deterministic primary display relationships;
- deduplicated public evidence sources with preserved claims;
- record-specific copy outside rendering components;
- a passing 92-record migration matrix.

After this PR merges, Gate C is complete. The next approved phase is Phase 3 information architecture and responsive specification, beginning with plan PR 17. Routine record growth remains paused at 92 assets.

## Scope boundaries

This PR does not:

- add stable assets;
- select Batch 18;
- alter canonical stablecoin facts;
- delete canonical evidence records;
- change the 455 evidence relations or 410 source identities;
- redesign the site architecture;
- enable automatic production deployment;
- publish the repair branch to production.
