# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: 8d1d3dce7faa0c3efe0f541a548aa7f6b65a31fa
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
Production data and routes: healthy
UI status: maintenance-only; no active redesign program
Active workstream: 100-record registry-wide audit
Current item: PR #301 deployment and chain identity audit
Next implementation item: PR #302 lifecycle and relationship boundary audit
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

## Completed foundation

- PR #296 resumed the core workstream and synchronized repository authority.
- PR #297 completed identity uniqueness and lineage audit.
- PR #298 completed organization and relationship integrity audit.
- PR #299 completed evidence and source-identity integrity audit.
- PR #300 completed reserve, redemption, and backing applicability audit.
- Monitoring foundation and reviewed source coverage exist through the prior non-UI quality program.
- The registry has reached the verified 100-record checkpoint.

## Phase A — 100-record registry-wide audit

### PR #296 — workstream resumption — complete

Merge checkpoint:

```text
51b3acd075dc1a661930574339e9128d718c7b75
```

### PR #297 — identity uniqueness and lineage — complete

Merge checkpoint:

```text
f97df82c023646220f44c72de9227eab7549d228
```

Result:

```text
stable assets audited: 100
promoted candidate mappings: 100
critical identity findings: 0
candidate alias gaps after correction: 0
explicit lineage relationships: 4
lineage cycles: 0
```

### PR #298 — organization and relationship integrity — complete

Merge checkpoint:

```text
235330adcbb3b0ebe6440a25dc1ff9c9886f0393
```

Result:

```text
organizations audited: 94
relationships audited: 110
critical findings: 0
invalid primary selections: 0
ambiguous primary selections: 0
legacy issuer compatibility gaps: 0
orphan organizations: 0
```

Bounded queues remain explicit:

```text
historical organization without official URL: 1
intentional shared USYC product URL: 1
ended relationships with unresolved exact end date: 4
```

### PR #299 — evidence and source-identity integrity — complete

Merge checkpoint:

```text
349b38c7641578e6a7be58a91256092722bcdb4f
```

PR #299 closed at the 501 / 455 / 501 evidence checkpoint. PR #301 adds one reviewed official USDf contract source, so the current baseline is now:

```text
canonical evidence records: 502
public source identities: 456
evidence relations: 502
source identity groups: 33
source aliases: 46
critical findings: 0
archive not recorded queue: 173
```

### PR #300 — reserve, redemption, and backing applicability — complete

Merge checkpoint:

```text
8d1d3dce7faa0c3efe0f541a548aa7f6b65a31fa
```

Result:

```text
stable assets: 100
classifications: 100
reserve/redemption profiles: 100
reserve-context rows: 108
assets covered by reserve-context rows: 88
assets covered by explicit applicability decisions: 12
overlap: 0
uncovered: 0
critical findings: 0
backing mismatches: 0
invalid reserve/redemption references: 0
```

Bounded review queues:

```text
reserve-context rows without period-specific report_date: 64
FEI lifecycle/redemption review item: 1
redemption source-review-needed fields: 10
reserve source-status unresolved assets: 2
```

### PR #301 — deployment and chain identity — active

Current result:

```text
deployments: 140
stable assets with deployment rows: 100
recorded chain labels: 35
critical findings: 0
duplicate identifier groups: 0
invalid origin references: 0
origin cycles: 0
duplicate primary deployments: 0
verification overlay ids: 140
verification review-needed: 0
verification not-recorded/unknown: 0
```

Verification distribution:

```text
verified: 19
identifier_recorded_unverified: 45
source_linked_no_identifier: 76
```

PR #301 detected and corrected a real USDf Ethereum contract-identity error, added one official Falcon Finance contract source, and expanded the deployment verification overlay from 130 to 140 rows.

Bounded review queues:

```text
identifier not recorded: 76
network review-needed: 2
aggregate network context: 4
freeze capability not recorded: 139
blacklist capability not recorded: 139
```

### PR #302 — lifecycle and relationship boundary audit — next

Audit:

- launch boundaries;
- terminal boundaries;
- migration boundaries;
- wind-down dates;
- rebrand dates;
- relationship end dates;
- redemption deadlines versus actual terminal boundaries;
- event chronology consistency;
- lifecycle/status consistency.

Contract deployment, first mint, guarded beta, public launch, exchange listing, migration announcement, migration start, redemption deadline, and terminal state remain separate concepts.

### PR #303 — known-unknown and placeholder integrity

Audit known unknowns, missing-value states, future-event placeholders, conflicting-source states, stale resolvable unknowns, and internal placeholder leakage into public output.

### PR #304 — monitoring coverage recalculation for 100 assets

Classify every asset as automatically monitorable, partially monitorable, manual-review-only, or without a reliable official source. Monitoring remains review-only.

## Phase B — non-UI release hardening

```text
PR #305 Registry v2/v3 and machine-readable parity
PR #306 counts, manifest, version, and provenance integrity
PR #307 reproducible build and generated-output audit
PR #308 audited 100-record canonical checkpoint
PR #309 non-UI release material
```

## Phase C — monitoring expansion and operation

```text
PR #310 100-asset monitoring baseline synchronization
PR #311 reserve and redemption source expansion
PR #312 lifecycle and regulatory source expansion
PR #313 bounded scheduled read-only monitoring
```

Monitoring may observe, compare, classify, and create private review material. It may not write canonical data, mutate accepted baselines, create branches or pull requests automatically, publish, or deploy.

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

```text
PR #314 deterministic statistics generator and validator
PR #315 immutable checkpoint history
PR #316 /stats/ foundation
PR #317 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, yield, safety, or risk rankings.

## Phase E — controlled growth from 100 to 110

```text
PR #318 next candidate audit
PR #319 100 -> 102
PR #320 102 -> 104
PR #321 104 -> 106
PR #322 106 -> 108
PR #323 108 -> 110
```

Each growth PR is limited to two assets and must preserve all applicable supporting record groups. Unknown information remains explicit.

## Operating rules

- Repository specifications are the source of truth.
- UI is maintenance-only unless the roadmap is deliberately amended.
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next item

```text
PR #301 complete and merge deployment and chain identity audit
then
PR #302 audit lifecycle and relationship boundaries across the 100-record registry
```
