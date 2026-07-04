# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: 235330adcbb3b0ebe6440a25dc1ff9c9886f0393
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
Current item: PR #299 evidence and source-identity integrity audit
Next implementation item: PR #300 reserve, redemption, and backing applicability audit
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

## Completed foundation

- PR #296 resumed the core workstream and synchronized repository authority.
- PR #297 completed identity uniqueness and lineage audit.
- PR #298 completed organization and relationship integrity audit.
- Monitoring foundation and reviewed source coverage exist through the prior non-UI quality program.
- The registry has reached the verified 100-record checkpoint.

## Phase A — 100-record registry-wide audit

### PR #296 — complete

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

Bounded review queues remain explicit:

```text
historical organization without official URL: 1
intentional shared USYC product URL: 1
ended relationships with unresolved exact end date: 4
```

### PR #299 — evidence and source-identity integrity — active

Audit all 501 canonical evidence records, their 455 public source identities, and all 501 evidence relations.

Current result:

```text
canonical evidence records: 501
public source identities: 455
evidence relations: 501
source identity groups: 33
source aliases: 46
critical findings: 0
normalized-only duplicate URL groups: 0
public duplicate URL groups: 0
orphan relation source identities: 0
public source identities without relations: 0
publisher gaps: 0
reliability gaps: 0
claim-scope gaps: 0
unknown taxonomy/provenance/primary/reliability: 0
```

Archive coverage remains explicit:

```text
archive index recorded: 328
archive not recorded: 173
```

An absent archive reference is a quality queue item, not an invalid evidence record, and must not be filled with an unverified archive URL.

### PR #300 — reserve, redemption, and backing applicability — next

Audit every asset across reserve applicability, reserve-report availability, backing model, stabilization mechanism, redemption status and access, fee and minimum disclosure, eligibility and jurisdiction restrictions, and unknown versus not-applicable semantics.

### PR #301 — deployment and chain identity

Audit chain/network identity, contract uniqueness, deployment status, verification state, native/bridged/wrapped/synthetic classification, bridge relationships, legacy deployments, and control-capability knowledge state.

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
PR #299 complete and merge evidence and source-identity integrity audit
then
PR #300 audit reserve, redemption, and backing applicability across 100 assets
```
