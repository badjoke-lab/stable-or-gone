# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: f97df82c023646220f44c72de9227eab7549d228
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 501
Detail routes: 366
Production data and routes: healthy
UI status: maintenance-only; no active redesign program
Active workstream: 100-record registry-wide audit
Current item: PR #298 organization and relationship integrity audit
Next implementation item: PR #299 evidence and source-identity integrity audit
```

The owner ended the dedicated UI correction program after PR #295. UI defects may be corrected through narrow maintenance PRs when concrete problems are found, but UI work is no longer the active workstream and must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

## Completed foundation

- date, reserve, evidence, relationship, source-identity, and deployment quality programs completed;
- review-only monitoring foundation and coverage work completed through PR #245;
- reviewed final-eight growth completed;
- Growth D rebuilt and merged from current implementation lineage;
- production verification recorded for the 100-record state;
- PR #296 resumed the core workstream and synchronized repository authority;
- PR #297 completed identity uniqueness and lineage audit with 0 critical findings, 0 alias gaps after correction, and 0 lineage cycles.

### Current verified baseline

```text
Stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 501
Detail routes: 366
```

## UI maintenance checkpoint

The terminal visual family is the current production direction. PR #288 restored the terminal baseline and PR #289-#295 corrected concrete index, filter, footer, typography, mobile, long-form, and spacing defects. The dedicated UI program is now stopped.

Rules:

- no autonomous redesign sequence;
- no new visual direction without explicit owner decision and roadmap amendment;
- verified UI defects may be fixed in narrow maintenance PRs;
- core work continues independently of optional UI maintenance.

## Phase A — 100-record registry-wide audit

### PR #296 — resume the core workstream — complete

Merge checkpoint:

```text
51b3acd075dc1a661930574339e9128d718c7b75
```

Result:

- stale UI-active authority removed;
- UI marked maintenance-only;
- 100-record audit activated;
- roadmap, governance, non-UI plan, AGENTS, and workstream validation synchronized.

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

The audit restored the reviewed `Acala USD` alias and confirmed that shared USDN, USDM, USX, USDX, and AUSD/aUSD tokens are disambiguation cases rather than duplicate canonical identities.

### PR #298 — organization and relationship integrity — active

Audit scope:

- organization identity uniqueness;
- legal issuer versus brand owner versus protocol operator;
- governance and reserve-management roles;
- current and historical relationships;
- primary display relationship selection;
- relationship status and end-boundary consistency;
- organization official-domain ownership and historical-source boundaries.

Current audit result:

```text
organizations audited: 94
relationships audited: 110
critical findings: 0
invalid primary selections: 0
ambiguous primary selections: 0
legacy issuer compatibility gaps: 0
orphan organizations: 0
active relationships with end date: 0
start-after-end boundaries: 0
```

Bounded review queues:

```text
historical organization without official URL: 1
intentional shared USYC product URL: 1
ended relationships with unresolved exact end date: 4
```

These unresolved boundaries remain explicit rather than guessed.

### PR #299 — evidence and source-identity integrity — next

Audit all 501 evidence records and their relations for:

- exact and normalized URL duplication;
- source-identity grouping;
- claim scope;
- evidence relation preservation;
- publisher identity;
- reliability value;
- archive coverage;
- orphan evidence and orphan relations.

### PR #300 — reserve, redemption, and backing applicability

Audit every asset across:

- reserve applicability;
- reserve-report availability;
- backing model;
- stabilization mechanism;
- redemption status and access;
- fee and minimum disclosure;
- eligibility and jurisdiction restrictions;
- unknown versus not-applicable semantics.

### PR #301 — deployment and chain identity

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

Audit:

- launch boundaries;
- terminal boundaries;
- migration boundaries;
- wind-down dates;
- rebrand dates;
- relationship end dates;
- redemption deadlines versus actual terminal boundaries.

Contract deployment, first mint, guarded beta, public launch, exchange listing, migration announcement, migration start, redemption deadline, and terminal state remain separate concepts.

### PR #303 — known-unknown and placeholder integrity

Audit:

- known unknowns;
- `unknown_after_review`;
- `not_recorded`;
- `not_public`;
- `not_applicable`;
- future-event placeholders;
- conflicting-source states;
- stale unknowns that can now be resolved;
- internal placeholder leakage into public output.

### PR #304 — monitoring coverage recalculation for 100 assets

Recalculate monitoring coverage against the actual 100-asset registry. Classify each asset as:

```text
automatically_monitorable
partially_monitorable
manual_review_only
no_reliable_official_source
```

Monitoring output remains review-only and may not modify canonical data or accepted baselines automatically.

## Phase B — non-UI release hardening

```text
PR #305 Registry v2/v3 and machine-readable parity
PR #306 counts, manifest, version, and provenance integrity
PR #307 reproducible build and generated-output audit
PR #308 audited 100-record canonical checkpoint
PR #309 non-UI release material
```

PR #309 material may include:

```text
100-record count summary
change history
quality-audit results
known-unknown inventory
monitoring coverage summary
deployment checklist
rollback checklist
release-note draft
checkpoint commit reference
```

## Phase C — monitoring expansion and operation

```text
PR #310 100-asset monitoring baseline synchronization
PR #311 reserve and redemption source expansion
PR #312 lifecycle and regulatory source expansion
PR #313 bounded scheduled read-only monitoring
```

Scheduled monitoring may observe sources, compare baselines, classify changes, and create private review material. Automatic canonical writes, baseline mutation, branch creation, PR creation, publication, and deployment remain prohibited.

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

```text
PR #314 deterministic statistics generator and validator
PR #315 immutable checkpoint history
PR #316 /stats/ foundation
PR #317 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data at build time and must not become price, market-cap, yield, safety, or risk rankings.

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
- Monitoring candidates never write directly to canonical public data.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Normal merged changes publish from `main` under `docs/deployment-policy.md`.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next item

```text
PR #298  Complete and merge organization and relationship integrity audit
then
PR #299  Audit evidence and source-identity integrity across 501 evidence records
```
