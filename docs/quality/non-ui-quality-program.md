# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-05  
Registry checkpoint: 100 canonical stable assets

## Purpose

This program governs the resumed core workstream after the dedicated UI correction program ended. The active sequence is:

```text
100-record registry-wide audit through lifecycle boundaries — complete
-> EU market-access specification — complete
-> reviewed market-access research checkpoint — active
-> reviewed market-access article after publication gate passes
-> remaining registry-wide audit
-> non-UI release hardening
-> monitoring expansion and scheduled read-only operation
-> statistics implementation
-> controlled growth from 100 to 110
```

The canonical execution order and current PR number are defined by `docs/roadmap.md`.

UI is maintenance-only. A concrete verified UI defect may be corrected through a narrow PR, but UI work is not an active redesign program and must not displace this sequence without an explicit roadmap amendment.

The EU stablecoin market-access work is governed by:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The article is a dated reviewed snapshot, not a live dashboard and not an automatic monitoring output.

## Current status

```text
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
Growth D: complete
100-record production verification: complete
PR #302 lifecycle and relationship boundary audit: complete
PR #303 EU market-access specification amendment: complete
PR #304 market-access research checkpoint: active
PR #305 article: blocked until publication gates pass
Monitoring foundation: implemented
Statistics specification: implemented as specification; page and public stats outputs not yet implemented
Growth beyond 100: not yet authorized until candidate audit phase
```

## Required reading order

Before changing canonical data, evidence, monitoring, statistics, workflows, quality documentation, or EU market-access editorial material:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this document
6. the relevant canonical data, monitoring, editorial, or statistics specification
7. `docs/migration/registry-v3-baseline.json`
8. every queue, validator, fixture, baseline, supporting audit, and research checkpoint named by the work item

Relevant canonical specifications include:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Every non-trivial PR cites the exact queue, audit, schema, fixture, baseline, validator, and research checkpoint it changes.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Month- or year-level evidence is not coerced into a day-level date.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- An unchanged normalized official source must not create a candidate.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- Platform-policy market access must be recorded by function and scope, not flattened into allowed/banned.
- A platform licence is not proof of stablecoin function availability.
- A Global product page is not proof of EU/EEA service scope.
- A market-access source change must not edit the public guide automatically.
- No growth PR may contain more than two new stable assets.
- Growth must use a fresh branch from current `main` and preserve all applicable record groups.
- Ordinary merged changes publish from `main` under `docs/deployment-policy.md`.

## Completed foundation

```text
PR #217-#225  date, reserve, evidence, and traceability quality
PR #226-#229  deployment quality
PR #230-#245  review-only monitoring foundation and source coverage
PR #246         final-eight candidate audit
PR #247-#250   controlled growth through 98 records, with consumed-number deviations recorded in history
PR #278         rebuilt Growth D to 100 records from current implementation lineage
PR #279-#280   production verification and count-aware closure hardening
PR #284-#295   UI recovery and concrete maintenance fixes; dedicated UI program now stopped
PR #296-#302   registry-wide audit through lifecycle and relationship boundaries
PR #303         EU stablecoin market-access research, publication, and monitoring specification
```

Completed monitoring architecture already includes:

```text
official-source observation
-> accepted-baseline comparison
-> change classification
-> private monitoring candidate
-> review material
-> evidence draft
-> draft PR material
-> human approval before any canonical publication
```

The pipeline is review-only. It must not commit, open a pull request, update canonical data, mutate accepted baselines, publish, or deploy automatically.

## EU market-access insertion

### PR #303 — specification and schedule amendment — complete

Fixed:

```text
research scope
platform coverage target
asset coverage target
function-level matrix
source hierarchy
geographic and legal-entity scoping
publication gate
article route and revision policy
material-change rule
later monitoring cadence and safety boundary
```

### PR #304 — research checkpoint and schedule synchronization — active

Research artifacts:

```text
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-02-2026-07-05.md
```

Current research state:

```text
platform breadth floor: met
stable-asset breadth floor: met as touched-by-reviewed-findings breadth
function-level matrix complete: no
Revolut USDT policy scope confirmed: no
publication-date current-state recheck complete: no
article publishable: no
```

The ten-platform breadth threshold does not authorize publication. Several platform rows currently establish only licensing or service context. Function-level evidence remains required for the comparative claims used in the article.

### PR #305 — reviewed article and initial market-access snapshot

Target route:

```text
/guides/eu-stablecoin-access-after-mica/
```

PR #305 begins only after the publication gate in the canonical market-access specification passes. The article must use reviewed sources, include an information-current-through date, support revision history, and remain separate from raw monitoring output.

## Remaining Phase A — 100-record registry-wide audit

Completed audit sequence:

```text
PR #297 identity uniqueness and lineage
PR #298 organization and relationship integrity
PR #299 evidence and source-identity integrity
PR #300 reserve, redemption, and backing applicability
PR #301 deployment and chain identity
PR #302 lifecycle and relationship boundaries
```

Remaining:

```text
PR #306 known-unknown and placeholder integrity
PR #307 monitoring coverage recalculation for 100 assets
```

An audit result may:

- resolve a value from reviewed evidence;
- preserve a value as unknown;
- record that no reliable official source is available;
- record a bounded unresolved conflict;
- identify a duplicate or lineage issue for separate reviewed correction.

It must not reduce uncertainty by guessing.

PR #307 must distinguish issuer/protocol monitoring coverage from market-access platform-policy coverage. Existing issuer-source reach is not evidence that a platform's buy, trade, deposit, withdrawal, custody, or conversion policy is monitored.

## Phase B — non-UI release hardening

```text
PR #308 Registry v2/v3 and machine-readable parity
PR #309 counts, manifest, version, and provenance integrity
PR #310 reproducible build and generated-output audit
PR #311 audited 100-record canonical checkpoint
PR #312 non-UI release material
```

Release material is internal review material and may include:

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
PR #313 100-asset monitoring baseline synchronization
PR #314 reserve and redemption source expansion
PR #315 lifecycle, regulatory, and EU market-access source/schema expansion
PR #316 bounded scheduled read-only monitoring
```

PR #315 extends the existing review-only architecture to approved first-party platform-policy sources and official regulator/register sources. The implementation must preserve:

```text
platform
legal entity
region scope
stablecoin
function
announced date
effective date
source identity
review state
```

The scheduled workflow may observe sources and produce private artifacts. It may not perform canonical writes, guide edits, baseline mutation, branch creation, automatic pull-request creation, publication, or deployment.

Target cadence after PR #316:

```text
platform policy and announcement sources: daily
news discovery: daily
ESMA and regulatory registers: weekly
issuer regulatory/transparency sources: weekly unless an existing cadence is stricter
article stale-state review: weekly
```

## Phase D — statistics implementation

The binding specification is `docs/stats-spec.md`.

```text
PR #317 deterministic stats generator and validator
PR #318 immutable checkpoint history
PR #319 /stats/ foundation
PR #320 historical, deployment, organization, and data-quality statistics
```

Statistics are derived from reviewed canonical data at build time. They are not live price, market-cap, yield, safety, or risk rankings.

## Phase E — controlled growth from 100 to 110

```text
PR #321 next candidate audit
PR #322 100 -> 102
PR #323 102 -> 104
PR #324 104 -> 106
PR #325 106 -> 108
PR #326 108 -> 110
```

Each growth PR contains no more than two new stable assets and must add every applicable supporting record group. Missing information remains explicit rather than inferred.

## Deployment classification

Quality, monitoring, statistics, growth, and editorial research PRs follow `docs/deployment-policy.md`. Normal merged changes publish from `main`; monitoring execution itself remains read-only and publication-neutral.
