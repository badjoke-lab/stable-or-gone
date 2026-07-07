# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-07

## 1. Purpose

This file defines document authority, conflict resolution, change control, roadmap discipline, release integrity, reproducible-build boundaries, audited checkpoint boundaries, release-material boundaries, monitoring synchronization boundaries, monitoring expansion boundaries, comparison boundaries, and publication safety.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts do not override merged repository authority.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for current phase, active item, next item, and PR numbering.
4. Active merged roadmap amendments named by the roadmap.
5. The canonical specification for the active workstream.
6. Supporting audits, inventories, baselines, fixtures, release notes, publication-gate reviews, and research checkpoints.
7. Conversation history and unmerged drafts.

Current schedule amendments:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

## 3. Governing specifications

Release/checkpoint authority:

```text
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/non-ui-release-material-spec.md
```

Current monitoring authority:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

Canonical data semantics remain governed by `docs/stable-asset-scope.md`, `docs/classification-spec.md`, `docs/data-model-v3-spec.md`, and the current registry baselines. Statistics work is governed by `docs/stats-spec.md`. Phase F-I work is governed by `docs/comparison-and-change-product-spec.md` together with active numbering amendments.

## 4. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read every active roadmap amendment named by the roadmap;
6. read the canonical specification for the active work item;
7. read every named queue, validator, audit, fixture, baseline, release note, publication-gate review, and research checkpoint.

A non-trivial PR is not ready for review until it identifies the exact specification and roadmap item it implements.

## 5. Change control

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- canonical enum meaning;
- public status grouping;
- evidence interpretation;
- unknown-state semantics;
- route families or canonical URLs;
- machine-readable output shape;
- count or denominator semantics;
- build provenance semantics;
- canonical hash boundary;
- audited checkpoint source commit or digest boundary;
- dependency-lock or runtime semantics;
- reproducible-build timestamp context;
- release-material derivation semantics;
- monitoring source schema;
- monitoring baseline state semantics;
- monitoring synchronization digest boundary;
- monitoring coverage semantics;
- scheduled trigger or permission boundary;
- statistics semantics;
- comparison projection semantics;
- canonical Market Access Record semantics;
- production publication gates;
- approved PR sequence;
- active workstream state.

No implementation PR may introduce an undocumented alternative.

## 6. Pull-request traceability

Every non-trivial PR body must identify:

```text
Specification references
Roadmap item
Scope
Explicit non-goals
Data preservation
Validation
Deployment classification
```

A PR that cannot cite an approved work item must pause until repository authority is corrected.

## 7. Current execution state

```text
100 canonical stable assets reached
UI maintenance-only after PR #295
PR #309 monitoring coverage recalculation complete
PR #311 Registry v2/v3 and machine-readable parity complete
PR #316 release integrity complete
PR #317 reproducible build audit complete
PR #318 audited 100-record canonical checkpoint complete
PR #319 guide maintenance complete, inserted work
PR #320 non-UI release material complete
PR #321 100-asset monitoring baseline synchronization active
PR #322 reserve and redemption source expansion next
PR #321-#334 current pre-110 sequence
PR #335-#348 post-110 comparison and change-product sequence approved but inactive before reviewed 110-asset checkpoint
```

Do not rewrite completed history to make a changed plan appear unchanged. Record consumed PR numbers, closed attempts, inserted work, and phase transitions explicitly.

## 8. Inserted-work numbering rule

When urgent factual, editorial, security, or narrow verified-maintenance work consumes a roadmap PR number:

```text
1. record the actual merged or closed work;
2. do not mark displaced planned work complete;
3. move displaced work to the next unused PR number;
4. renumber every later unused planned item without changing order or scope;
5. update roadmap, amendments, authority docs, and workstream guards before planned work resumes.
```

PR #319 is governed by `docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md`.

## 9. Release and checkpoint governance

Binding rules:

- canonical counts derive from composed canonical manifests and files;
- public count-path semantics remain stable unless explicitly versioned;
- runtime provenance uses real commit, branch, timestamp, non-zero canonical hash, and positive canonical file count;
- candidate, monitoring, editorial-research, and private material remain outside canonical public count surfaces and provenance boundaries;
- reproducibility-sensitive workflows use the reviewed lockfile and pinned Node runtime;
- normal build does not overwrite protected historical baseline inputs;
- the audited checkpoint keeps identity and content digests separate;
- production may advance through later noncanonical commits only while public output, provenance, route/output parity, canonical hash parity, canonical file-count parity, and reviewed count parity remain valid.

## 10. Monitoring baseline synchronization governance

PR #321 is governed by:

```text
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
scripts/generate-monitoring-baseline-sync-100-assets.mjs
scripts/validate-monitoring-baseline-sync-100-assets.mjs
.github/workflows/monitoring-baseline-sync-100.yml
```

Binding rules:

- synchronization boundary is exactly 100 assets, 94 organizations, and 110 relationships;
- current configuration contains 24 reviewed enabled source rows and 24 baseline rows;
- source IDs and baseline IDs match exactly;
- all 24 baseline rows remain `pending_initial_acceptance`;
- accepted baseline count remains zero;
- missing baseline count remains zero;
- registered source reach is 16 assets and uncovered queue is 84 assets;
- covered organization count is 12;
- accepted monitoring asset reach remains zero;
- multi-family asset count is 7;
- current source-family counts and asset-family reach are fixed by the synchronization snapshot;
- asset, organization, source/baseline, uncovered-queue, source-file, and baseline-file digests are deterministic contracts;
- synchronization performs no network access and authorizes no canonical action;
- synchronization snapshot and baseline data remain private/internal and are excluded from public machine-readable output;
- PR #321 may not accept baselines, add sources, expand market-access schema, schedule monitoring, write canonical data, edit guides automatically, create automatic canonical PRs, publish candidates, or deploy.

A future pending-to-accepted baseline transition requires a separate human-reviewed change with live observation provenance under the current normalization version.

## 11. Monitoring coverage governance

Coverage remains multidimensional:

```text
issuer/protocol source reach
reserve/assurance reach
redemption/mint terms reach
issuer lifecycle reach
regulatory action/guidance reach
platform-policy reach
platform service-state reach
regulatory-register reach
EU/EEA market-access function reach
accepted-baseline reach
```

Rules:

- a registered source is not an accepted baseline;
- a pending baseline is not accepted monitoring coverage;
- issuer/protocol reach is not platform-policy coverage;
- regulatory action pages are not regulatory-register coverage;
- a generic issuer or product page is not function-level market-access coverage;
- zero coverage for a required domain is a valid audit result and must not be filled by inference;
- PR #322 expands reserve and redemption sources;
- PR #323 expands lifecycle, regulatory, and EU market-access source/schema coverage;
- PR #324 activates bounded scheduled read-only operation;
- monitoring output remains private candidate material until reviewed.

## 12. Monitoring safety boundary

Monitoring must remain review-only and read-only with respect to canonical data.

Fixed prohibitions:

```text
no canonical write
no self-accepting baseline
no automatic guide edit
no automatic canonical PR
no candidate publication
no production deployment
```

Scheduled operation in PR #324 must preserve `contents: read` and the existing no-write boundary.

## 13. Unknown-value and placeholder governance

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These states are not structural placeholders and must not be overwritten merely to satisfy completeness or comparison presentation.

Structural placeholders such as TODO/TBD identity fields, fake URLs, fabricated dates, and placeholder identifiers are defects.

## 14. Statistics governance

`docs/stats-spec.md` is binding for PR #325-#328.

Statistics derive from reviewed canonical data and must not become live price, market-cap, APY, safety, transparency, or risk rankings.

## 15. Comparison and change-product governance

Phase F-I remains governed by `docs/comparison-and-change-product-spec.md` and active numbering amendments.

Binding boundaries:

- Phase F starts only after the reviewed 110-asset checkpoint;
- lifecycle, issuance/redemption, legal/regulatory state, and market access remain separate analytical layers;
- canonical Market Access Records remain distinct from monitoring observations and editorial research matrices;
- Compare derives from reviewed canonical data and preserves unresolved states;
- facet freshness derives from authoritative record families;
- Change Timeline is a derived projection and does not replace source record families;
- public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds;
- safety scores, risk scores, best-asset rankings, and universal country availability claims are not approved.

## 16. Data preservation

UI, quality, taxonomy, monitoring, statistics, growth, editorial, release-material, comparison, market-access, timeline, and update-surface work must not silently reduce canonical coverage.

Before and after relevant changes, verify canonical asset, organization, relationship, event, evidence, reserve-context, known-unknown, regulatory-note, deployment, and route counts governed by the active baseline and audited checkpoint.
