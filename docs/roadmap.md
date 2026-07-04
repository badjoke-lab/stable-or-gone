# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: 51b3acd075dc1a661930574339e9128d718c7b75
Canonical stable assets: 100
Organizations: 94
Events: 172
Evidence: 501
Detail routes: 366
Production data and routes: healthy
UI status: maintenance-only; no active redesign program
Active workstream: 100-record registry-wide audit
Current item: PR #297 identity uniqueness and lineage audit
Next implementation item: PR #298 organization and relationship integrity audit
```

The owner ended the dedicated UI correction program after PR #295. UI defects may be corrected through narrow maintenance PRs when concrete problems are found, but UI work is no longer the active workstream and must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

## Completed foundation

### Data and quality

- date, reserve, evidence, relationship, source-identity, and deployment quality programs completed;
- review-only monitoring foundation and coverage work completed through PR #245;
- reviewed final-eight growth completed;
- Growth D rebuilt and merged from current implementation lineage;
- production verification recorded for the 100-record state;
- PR #296 resumed the core workstream and synchronized repository authority.

### Current verified baseline

```text
Stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 501
Detail routes: 366
```

Growth D added the final two reviewed assets required for the 100-record checkpoint. The registry-wide audit is now executing against the current 100-record baseline.

### UI maintenance checkpoint

The terminal visual family is the current production direction. PR #288 restored the terminal baseline and PR #289-#295 corrected concrete index, filter, footer, typography, mobile, long-form, and spacing defects. The dedicated UI program is now stopped.

Rules from this point:

- no autonomous redesign sequence;
- no new visual direction without explicit owner decision and roadmap amendment;
- verified UI defects may be fixed in narrow maintenance PRs;
- core work continues independently of optional UI maintenance.

## Phase A — 100-record registry-wide audit

### PR #296 — resume the core workstream — complete

- replaced stale UI-active roadmap state;
- marked UI as maintenance-only;
- activated the 100-record registry-wide audit;
- synchronized `AGENTS.md`, governance, non-UI plan, and active-workstream validation;
- preserved canonical data and public output.

Merge checkpoint:

```text
51b3acd075dc1a661930574339e9128d718c7b75
```

### PR #297 — identity uniqueness and lineage — active

Audit all 100 assets for:

```text
id
slug
name
symbol
aliases
official domains
historical names
rebrands
migrations
token upgrades
chain-specific representations
```

Current audit result:

```text
stable assets audited: 100
promoted candidate mappings: 100
critical identity findings: 0
candidate alias gaps after correction: 0
explicit lineage relationships: 4
lineage cycles: 0
```

The first audit run found one reviewed candidate alias missing from the canonical Acala identity. `Acala USD` was restored to the canonical alias set. Shared symbols remain review-visible but do not prove duplicate canonical identity. Organization-domain and HUSD source-boundary warnings are carried into PR #298.

### PR #298 — organization and relationship integrity — next

Audit:

- organization identity uniqueness;
- legal issuer versus brand owner versus protocol operator;
- governance and reserve-management roles;
- current and historical relationships;
- primary display relationship selection;
- relationship status and end-boundary consistency;
- organization official-domain ownership and historical-source boundaries.

### PR #299 — evidence integrity

Audit all evidence and source identities for:

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

Recalculate the monitoring coverage report against the actual 100-asset registry. Classify each asset as:

```text
automatically_monitorable
partially_monitorable
manual_review_only
no_reliable_official_source
```

Monitoring output remains review-only and may not modify canonical data or accepted baselines automatically.

## Phase B — non-UI release hardening

### PR #305 — Registry v2/v3 and machine-readable parity

Verify exact parity between canonical loaders, public HTML ownership, machine-readable outputs, and route families.

### PR #306 — counts, manifest, version, and provenance integrity

Require the same current counts and commit provenance across generated stats, manifests, version output, build provenance, and public-layer verification.

### PR #307 — reproducible build and generated-output audit

Verify a clean checkout can reproduce required generated outputs and complete validation, Astro check, build, and public-layer verification without hidden local artifacts.

### PR #308 — 100-record canonical checkpoint

Record the audited 100-record checkpoint and the exact registry-wide audit results. This is a comparison checkpoint, not a permanent growth ceiling.

### PR #309 — non-UI release material

Generate reviewed internal release material:

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

### PR #310 — 100-asset monitoring baseline synchronization

Reconcile monitored targets, official-source registrations, baseline state, and missing coverage against the audited 100-asset registry.

### PR #311 — reserve and redemption source expansion

Expand reviewed monitoring coverage for attestations, reserve reports, transparency pages, redemption terms, fees, minimums, eligibility, and suspension signals.

### PR #312 — lifecycle and regulatory source expansion

Expand reviewed monitoring coverage for mint halts, wind-downs, migrations, rebrands, shutdowns, regulator notices, and primary enforcement material.

### PR #313 — scheduled read-only monitoring

Add bounded scheduled execution that produces private review material only:

```text
official-source observation
-> baseline comparison
-> change classification
-> private candidate artifact
-> review material
-> human decision
```

Automatic canonical writes, baseline mutation, branch creation, PR creation, publication, and deployment remain prohibited.

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

### PR #314 — deterministic statistics generator and validator

Implement:

```text
scripts/build-stats.mjs
scripts/validate-stats.mjs
/data/stats.json
```

All values must derive from reviewed canonical loaders at build time.

### PR #315 — checkpoint history

Implement `/data/stats-history.json` as reviewed immutable checkpoint snapshots, including the existing historical checkpoints through 100.

### PR #316 — `/stats/` foundation

Publish exact-count statistics for:

- total assets and lifecycle groups;
- organizations, events, and evidence;
- asset class and reference targets;
- backing and stabilization;
- issuance and redemption.

### PR #317 — historical, deployment, organization, and quality statistics

Add:

- events by year;
- depeg outcomes;
- failures and lifecycle transitions;
- deployments by chain and type;
- organization roles;
- data-quality coverage;
- known-unknown coverage;
- verification recency.

Statistics must not become price, market-cap, yield, safety, or risk rankings.

## Phase E — controlled growth from 100 to 110

### PR #318 — next candidate audit

Audit the next growth pool for duplicate identity, lineage, issuer identity, launch boundary, lifecycle, reference target, backing, redemption, reserve applicability, deployments, event history, and primary-source availability.

### PR #319-#323 — two assets per PR

```text
PR #319  100 -> 102
PR #320  102 -> 104
PR #321  104 -> 106
PR #322  106 -> 108
PR #323  108 -> 110
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
PR #297  Complete and merge the 100-record identity uniqueness and lineage audit
then
PR #298  Audit organization identity and relationship integrity
```
