# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-06

## 1. Purpose

This file defines document authority, conflict resolution, change control, roadmap discipline, release integrity, reproducible-build boundaries, inserted urgent work handling, monitoring boundaries, comparison boundaries, and publication safety.

SOG work must not depend on chat memory, an old handoff, or an unstated interpretation. Merged repository specifications are the source of truth.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for current phase, active item, next item, and PR numbering.
4. Active merged roadmap amendments explicitly named by the roadmap.
5. The canonical specification or implementation plan for the active workstream.
6. Supporting audits, inventories, baselines, examples, publication-gate reviews, and research checkpoints.
7. Conversation history, issue discussion, generated output, and unmerged drafts.

Current schedule amendment:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
```

For PR numbering after the July 6 editorial insertions, the roadmap and that amendment supersede older numeric labels in subordinate plans. Work order and scope remain unchanged unless deliberately amended.

## 3. Governing specifications

Core workstream:

```text
docs/quality/non-ui-quality-program.md
docs/roadmap.md
```

Current release-hardening work:

```text
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
docs/audits/counts-manifest-version-provenance-integrity-100-assets.md
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
docs/audits/reproducible-build-generated-output-audit-2026-07-06.md
```

Canonical data semantics:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/migration/registry-v3-parity-baseline.json
docs/stats-spec.md
```

Monitoring semantics:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

Post-110 product semantics:

```text
docs/comparison-and-change-product-spec.md
```

## 4. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. Read `AGENTS.md`.
2. Read this file.
3. Read `docs/roadmap.md`.
4. Read `docs/deployment-policy.md`.
5. Read every active roadmap amendment named by the roadmap.
6. Read the canonical specification for the active work item.
7. Read every named queue, validator, audit, fixture, baseline, publication-gate review, and research checkpoint.

A non-trivial PR is not ready for review until it identifies the exact specification and roadmap item it implements.

## 5. Source-of-truth rule

A decision becomes binding only when it is written into the relevant canonical repository document and merged.

If implementation and specification disagree, implementation is defective unless the specification is deliberately updated through review.

Supporting research may record facts, unresolved states, or source gaps. It does not authorize publication until the applicable review gate passes.

Monitoring observations and editorial research matrices are not canonical Market Access Records.

## 6. Change-control rule

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- canonical enum meaning;
- public status grouping;
- primary-relationship selection;
- evidence interpretation;
- unknown or missing-value semantics;
- route families or canonical URLs;
- machine-readable output shape;
- count or denominator semantics;
- build provenance semantics;
- canonical hash boundary;
- dependency-lock or pinned runtime semantics for release builds;
- reproducible-build timestamp context;
- generated-output roles or protected historical input boundaries;
- statistics denominator or grouping semantics;
- comparison projection shape or semantics;
- facet-freshness derivation semantics;
- monitoring observation, source-family, coverage, or baseline semantics;
- canonical Market Access Record semantics;
- Access & Regulation Explorer indexing semantics;
- Change Timeline projection semantics;
- reviewed public update derivation semantics;
- production publication gates;
- the approved PR sequence;
- the active workstream or its pause/resumption state.

No implementation PR may introduce an undocumented alternative.

## 7. Pull-request traceability

Every non-trivial PR body must include:

```text
Specification references:
- file and section

Roadmap item:
- phase and PR number

Scope:
- what changes
- what explicitly does not change

Data preservation:
- record groups and counts checked

Validation:
- commands and checks run

Deployment classification:
- one value from docs/deployment-policy.md
```

A PR that cannot cite an approved work item must pause until the roadmap or specification is corrected.

## 8. Roadmap discipline

`docs/roadmap.md` is the canonical execution schedule. Update it when a phase changes, a PR is merged or reordered, counts change, a publication checkpoint changes, or a blocker changes the next work item.

Do not rewrite completed history to make a changed plan appear unchanged. Record deviations, consumed PR numbers, research-only checkpoints, publication-gate reviews, superseded visual directions, and stale branches explicitly.

Current execution state:

```text
100 canonical stable assets reached
100-record production verification recorded
UI maintenance-only after PR #295
PR #302 lifecycle and relationship boundary audit complete
PR #303-#307 EU market-access specification, research, and guide publication complete
PR #308 known-unknown and placeholder integrity audit complete
PR #309 monitoring coverage recalculation complete
PR #311 Registry v2/v3 and machine-readable parity complete
PR #312 Ripple EU CASP guide update complete
PR #313 first EEA-scope follow-up closed without merge
PR #314 corrected guide follow-up complete
PR #315 schedule amendment and PR renumbering complete
PR #316 counts, manifest, version, and provenance integrity complete
PR #317 reproducible build and generated-output audit active
PR #318 audited 100-record canonical checkpoint next
PR #316-#333 current pre-110 sequence
PR #334-#347 post-110 comparison and change-product sequence approved but inactive before reviewed 110-asset checkpoint
```

## 9. Inserted urgent work and consumed PR numbers

Urgent factual corrections, verified public breakage, owner-directed dated editorial work, or security fixes may interrupt the planned sequence through a narrow PR.

When an interruption consumes preallocated PR numbers:

```text
1. record the inserted work and exact merge/closure status;
2. preserve any unmerged attempt as explicit history;
3. identify which planned work item actually completed, if implementation moved to another PR;
4. create a roadmap amendment before planned work resumes;
5. renumber every remaining planned item without changing work order unless separately approved;
6. update the active-workstream validator;
7. keep subordinate specification content unchanged except for numbering supersession unless scope is deliberately amended.
```

The July 6 implementation is recorded in the current roadmap amendment.

## 10. Release-integrity governance

PR #316 is governed by:

```text
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
```

Binding rules:

- canonical counts are derived from composed canonical manifests and files;
- `version.json` and `data/manifest.json` use shared machine-readable count and build getters;
- public count-path semantics remain stable unless explicitly versioned;
- the checked-in build-provenance file is an explicit sentinel template, not valid runtime provenance;
- the sentinel must carry current reviewed counts and route counts;
- build-time provenance must replace sentinel commit, timestamp, hash, and file-count fields with real values;
- runtime provenance must use a non-zero sha256 canonical-data hash and positive canonical file count;
- version and manifest build provenance must match after build;
- generated detail routes must match canonical stablecoin, organization, and event sets;
- candidate, monitoring, editorial-research, and private material are excluded from canonical machine-readable provenance and public count surfaces;
- source-state integrity validation complements, but does not replace, built-output and production provenance verification.

## 11. Reproducible-build governance

PR #317 is governed by:

```text
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
.github/workflows/reproducible-build.yml
```

Binding rules:

- CI, reproducibility audit, and production deployment use the reviewed package lock through `npm ci --no-audit --no-fund`;
- release-hardening CI, reproducibility audit, and production deployment pin Node 22.22.0;
- `SOG_BUILD_TIMESTAMP` is the explicit timestamp override and `SOURCE_DATE_EPOCH` is the standard deterministic fallback;
- production build timestamp and epoch derive from the deployed commit;
- timestamped generators covered by PR #317 use the shared build-timestamp helper;
- normal site build must not overwrite the tracked historical `data/generated/registry-stats.json` quality-baseline input;
- the two-pass audit runs two builds with identical source commit, branch label, timestamp, epoch, dependency graph, Node runtime, and runner class;
- audited outputs include `dist/**`, generated build provenance, and generated deployment-taxonomy diagnostic output;
- comparison must check tree digest, file count, total bytes, per-file byte count, and per-file SHA-256;
- protected historical inputs named by the baseline must remain unchanged through both builds;
- reproducibility claims are scoped to the pinned GitHub Actions Linux runtime class, pinned Node runtime, reviewed lockfile, and fixed build context;
- production provenance verification remains required and is not replaced by local or CI byte reproducibility.

## 12. Unknown-value and placeholder governance

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These states are not structural placeholders and must not be overwritten merely to satisfy completeness or comparison presentation.

Structural placeholders such as TODO/TBD identity fields, fake URLs, fabricated dates, and placeholder addresses, contracts, or identifiers are defects.

## 13. Monitoring coverage governance

PR #309 completed coverage recalculation from the checked-in source allowlist and baseline state. It was an audit item, not source expansion.

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

Governance rules:

- A registered source is not an accepted baseline.
- A pending baseline is not accepted monitoring coverage.
- Issuer/protocol reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- A generic issuer or product page is not function-level market-access coverage.
- Zero coverage for a required domain is a valid audit result and must not be filled by inference.
- Monitoring baseline synchronization is PR #320.
- Source and schema expansion is PR #321-#322.
- Scheduled read-only operation is PR #323.
- Monitoring output remains private candidate material until reviewed.
- Monitoring observation schema does not itself create a canonical Market Access Record family.

## 14. Comparison and change-product governance

Phase F-I is governed by `docs/comparison-and-change-product-spec.md` together with the current numbering amendment.

Binding boundaries:

- Phase F starts only after the reviewed 110-asset checkpoint.
- Asset lifecycle, issuance/redemption, legal/regulatory state, and market access remain separate analytical layers.
- Legal and regulatory claims remain jurisdiction-scoped and evidence-backed.
- Canonical Market Access Records remain distinct from monitoring observations and editorial research matrices.
- Compare derives from reviewed canonical data and preserves unresolved states.
- Facet freshness derives from authoritative record families.
- Access and regulation may share an exploration surface while retaining separate canonical record families.
- Change Timeline is a derived projection and may not replace source record families with a lossy generic event object.
- Public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds.
- Safety scores, risk scores, best-asset rankings, and universal country availability claims are not approved.

## 15. UI maintenance and approved product UI governance

There is no free-standing redesign sequence. Narrow UI maintenance must start from a concrete observed defect and must not displace the active roadmap.

Approved product surfaces such as Compare, Access & Regulation Explorer, and Change Timeline are governed by their canonical specification and roadmap item when their phases become active.

## 16. Data-preservation rule

UI, quality, taxonomy, monitoring, statistics, growth, editorial, comparison, market-access, timeline, and update-surface work must not silently reduce canonical coverage.

Before and after relevant changes, verify canonical asset, organization, relationship, event, evidence, reserve-context, known-unknown, regulatory-note, deployment, and route counts governed by the active baseline.

After canonical Market Access Records are introduced, relevant PRs must also verify count, referential integrity, evidence linkage, scope fields, date semantics, and exclusion of private monitoring candidate data.
