# Stable or Gone Roadmap

Updated: 2026-07-05  
Status: canonical execution schedule — active

## Current position

```text
Current main checkpoint: ed6fe84ecf1cf7998f6be751b1af0df084dda735
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
Current item: PR #302 lifecycle and relationship boundary audit
Owner-directed insertion: PR #303 specification and schedule amendment for EU stablecoin market access
Next public implementation after PR #302: PR #304 reviewed EU stablecoin market-access guide
```

The dedicated UI correction program ended after PR #295. Verified UI defects may be corrected through narrow maintenance PRs, but UI work must not displace the core data, monitoring, statistics, and record-growth schedule without a deliberate roadmap amendment.

The owner-directed EU stablecoin market-access work is a bounded editorial and monitoring extension. Research may proceed in parallel with PR #302 after PR #303 is merged. The public article implementation waits until PR #302 is merged. After the article PR, the core audit sequence resumes immediately.

## Completed foundation

- PR #296 resumed the core workstream and synchronized repository authority.
- PR #297 completed identity uniqueness and lineage audit.
- PR #298 completed organization and relationship integrity audit.
- PR #299 completed evidence and source-identity integrity audit.
- PR #300 completed reserve, redemption, and backing applicability audit.
- PR #301 completed deployment and chain identity audit.
- Monitoring foundation and reviewed source coverage exist through the prior non-UI quality program.
- The registry has reached the verified 100-record checkpoint.

## Owner-directed EU stablecoin market-access insertion

### PR #303 — specification and schedule amendment — active

Purpose:

```text
freeze the research question
freeze the platform/asset/function matrix
freeze source hierarchy and publication gates
freeze article placement and revision policy
freeze the later monitoring extension
record the revised PR sequence
```

Binding specification:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

This PR is documentation and schedule authority only. It does not publish the article, change canonical stablecoin data, expand live monitoring sources, add a schedule, or deploy.

### PR #304 — reviewed EU stablecoin market-access guide

Begins only after PR #302 is merged.

Target route:

```text
/guides/eu-stablecoin-access-after-mica/
```

Required preconditions:

```text
at least 10 platforms researched
at least 15 stable assets reviewed
function-level access matrix complete enough for publication
EU/EEA/legal-entity scope preserved
major claims backed primarily by regulator or first-party sources
ESMA or relevant register cross-check completed
Revolut scope represented conservatively if first-party confirmation remains incomplete
publication-date current-state recheck completed
```

The article is a dated reviewed editorial snapshot. It is not a live dashboard and must not update automatically from monitoring output.

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

Current baseline after the reviewed source addition in PR #301:

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

### PR #301 — deployment and chain identity — complete

Merge checkpoint:

```text
ed6fe84ecf1cf7998f6be751b1af0df084dda735
```

Result:

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

### PR #302 — lifecycle and relationship boundary audit — active

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

### PR #305 — known-unknown and placeholder integrity

Audit known unknowns, missing-value states, future-event placeholders, conflicting-source states, stale resolvable unknowns, and internal placeholder leakage into public output.

### PR #306 — monitoring coverage recalculation for 100 assets

Classify every asset as automatically monitorable, partially monitorable, manual-review-only, or without a reliable official source. Monitoring remains review-only.

The report must separately identify market-access monitoring coverage introduced by the EU market-access specification rather than treating issuer-source reach as proof of platform-policy coverage.

## Phase B — non-UI release hardening

```text
PR #307 Registry v2/v3 and machine-readable parity
PR #308 counts, manifest, version, and provenance integrity
PR #309 reproducible build and generated-output audit
PR #310 audited 100-record canonical checkpoint
PR #311 non-UI release material
```

## Phase C — monitoring expansion and operation

```text
PR #312 100-asset monitoring baseline synchronization
PR #313 reserve and redemption source expansion
PR #314 lifecycle, regulatory, and EU market-access source/schema expansion
PR #315 bounded scheduled read-only monitoring
```

PR #314 must implement the approved market-access observation family described in:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The market-access extension must distinguish platform policy, regulatory-register state, issuer state, geographic scope, legal entity, product function, and effective date. It must not infer one function state from another.

Target schedule after PR #315:

```text
platform policy sources: daily
platform announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless an existing cadence is stricter
article stale-state review: weekly
```

Monitoring may observe, compare, classify, and create private review material. It may not write canonical data, edit guides automatically, mutate accepted baselines, create branches or pull requests automatically, publish candidates, or deploy.

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

```text
PR #316 deterministic statistics generator and validator
PR #317 immutable checkpoint history
PR #318 /stats/ foundation
PR #319 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, yield, safety, or risk rankings.

## Phase E — controlled growth from 100 to 110

```text
PR #320 next candidate audit
PR #321 100 -> 102
PR #322 102 -> 104
PR #323 104 -> 106
PR #324 106 -> 108
PR #325 108 -> 110
```

Each growth PR is limited to two assets and must preserve all applicable supporting record groups. Unknown information remains explicit.

## Operating rules

- Repository specifications are the source of truth.
- UI is maintenance-only unless the roadmap is deliberately amended.
- Every non-trivial PR cites the exact specification, queue, audit, fixture, baseline, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a value.
- Monitoring executions remain read-only and never update their own accepted baseline.
- Market-access research preserves function-level and geographic scope instead of flattening access into an allowed/banned label.
- A source change never updates the public market-access guide automatically.
- Growth PRs contain no more than two new stable assets.
- A phase transition updates this roadmap before the next implementation sequence continues.

## Immediate next items

```text
1. Merge PR #303 specification and schedule amendment.
2. Continue and merge PR #302 lifecycle and relationship boundary audit.
3. Complete the reviewed EU/EEA market-access research matrix in parallel after PR #303 merge.
4. Implement PR #304 reviewed EU stablecoin market-access guide only after PR #302 merge.
5. Resume the core registry-wide audit at PR #305.
```
