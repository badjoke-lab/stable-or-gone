# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: 349b38c7641578e6a7be58a91256092722bcdb4f
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 501
Public source identities: 455
Detail routes: 366
Production data and routes: healthy
UI status: maintenance-only; no active redesign program
Active workstream: 100-record registry-wide audit
Current item: PR #300 reserve, redemption, and backing applicability audit
Next implementation item: PR #301 deployment and chain identity audit
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

## Completed foundation

- PR #296 resumed the core workstream and synchronized repository authority.
- PR #297 completed identity uniqueness and lineage audit.
- PR #298 completed organization and relationship integrity audit.
- PR #299 completed evidence and source-identity integrity audit.
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

Result:

```text
canonical evidence records: 501
public source identities: 455
evidence relations: 501
source identity groups: 33
source aliases: 46
critical findings: 0
public duplicate URL groups: 0
orphan relation source identities: 0
publisher/reliability/claim-scope gaps: 0
unknown taxonomy/provenance/primary/reliability: 0
archive not recorded queue: 173
```

### PR #300 — reserve, redemption, and backing applicability — active

Current result:

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

The audit treats undated transparency indexes, protocol context pages, and source entry points as valid context rows rather than fabricating period-specific dates. FEI remains reviewable rather than being silently rewritten.

### PR #301 — deployment and chain identity — next

Audit:

- chain and network identity;
- contract or identifier uniqueness;
- deployment status;
- verification state;
- issuer-native versus bridged versus wrapped versus synthetic status;
- canonical and third-party bridge relationships;
- legacy deployments;
- freeze, blacklist, and control-capability knowledge state.

### PR #302 — lifecycle boundary audit

Audit launch, terminal, migration, wind-down, rebrand, relationship-end, and redemption-deadline boundaries. Contract deployment, first mint, guarded beta, public launch, exchange listing, migration announcement, migration start, redemption deadline, and terminal state remain separate concepts.

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
PR #300 complete and merge reserve, redemption, and backing applicability audit
then
PR #301 audit deployment and chain identity across the 100-record registry
```
