# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-06

## 1. Purpose

This file defines document authority, conflict resolution, change control, roadmap discipline, release integrity, reproducible-build boundaries, audited checkpoint boundaries, release-material boundaries, monitoring boundaries, comparison boundaries, and publication safety.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts do not override merged repository authority.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for current phase, active item, next item, and PR numbering.
4. Active merged roadmap amendments named by the roadmap.
5. The canonical specification for the active workstream.
6. Supporting audits, inventories, baselines, fixtures, publication-gate reviews, release notes, and research checkpoints.
7. Conversation history and unmerged drafts.

Current schedule amendments:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

For PR numbering after inserted editorial or maintenance work, the roadmap and every active amendment named there supersede older numeric labels in subordinate plans unless the roadmap is deliberately amended again.

## 3. Governing specifications

Current release-hardening work is governed by:

```text
docs/quality/non-ui-quality-program.md
docs/roadmap.md
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/non-ui-release-material-spec.md
docs/releases/100-asset-checkpoint-2026-07-06.md
```

Canonical data semantics remain governed by:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/migration/registry-v3-parity-baseline.json
docs/stats-spec.md
```

Monitoring semantics remain governed by the monitoring specifications under `docs/quality/`. Post-110 product semantics remain governed by `docs/comparison-and-change-product-spec.md` together with the active roadmap amendments.

## 4. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read every active roadmap amendment named by the roadmap;
6. read the canonical specification for the active work item;
7. read every named queue, validator, audit, fixture, baseline, publication-gate review, release note, and research checkpoint.

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
- dependency-lock or pinned runtime semantics;
- reproducible-build timestamp context;
- generated-output roles or protected-input boundaries;
- release-material derivation semantics;
- statistics semantics;
- comparison projection semantics;
- monitoring coverage or baseline semantics;
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
PR #317 reproducible build and generated-output audit complete
PR #318 audited 100-record canonical checkpoint complete
PR #319 guide article spacing maintenance complete, inserted work
PR #320 non-UI release material active
PR #321 100-asset monitoring baseline synchronization next
PR #320-#334 current pre-110 sequence after consumed PR #319
PR #335-#348 post-110 comparison and change-product sequence approved but inactive before reviewed 110-asset checkpoint
```

Do not rewrite completed history to make a changed plan appear unchanged. Record consumed PR numbers, closed attempts, inserted work, and phase transitions explicitly.

## 8. Inserted-work numbering rule

When urgent factual, editorial, security, or narrow verified-maintenance work consumes a PR number allocated to the roadmap:

```text
1. record the actual merged or closed work;
2. do not mark the displaced planned work complete;
3. move the displaced planned item to the next unused PR number;
4. renumber every later unused planned item without changing order or scope;
5. update roadmap, active amendments, authority docs, and workstream guards before planned work resumes.
```

PR #319 is governed by `docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md`.

## 9. Release-integrity governance

PR #316 is governed by:

```text
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
```

Binding rules:

- canonical counts derive from composed canonical manifests and files;
- `version.json` and `data/manifest.json` use shared count and build getters;
- public count-path semantics remain stable unless explicitly versioned;
- checked-in build provenance is an explicit sentinel template, not runtime provenance;
- runtime provenance must contain real commit, branch, timestamp, non-zero canonical hash, and positive canonical file count;
- version and manifest provenance must match after build;
- generated detail routes must match canonical stablecoin, organization, and event sets;
- candidate, monitoring, editorial-research, and private material remain outside canonical public count surfaces and provenance boundaries.

## 10. Reproducible-build governance

PR #317 is governed by:

```text
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
.github/workflows/reproducible-build.yml
```

Binding rules:

- CI, reproducibility audit, and production deployment use the reviewed package lock through `npm ci --no-audit --no-fund`;
- release-hardening workflows pin Node 22.22.0;
- `SOG_BUILD_TIMESTAMP` and `SOURCE_DATE_EPOCH` provide deterministic build timestamp context;
- production timestamp and epoch derive from the deployed commit;
- normal site build must not overwrite the tracked historical registry-stats baseline input;
- two fixed-context builds must compare tree digest, file count, total bytes, per-file byte count, and per-file SHA-256;
- protected historical inputs remain unchanged through both builds;
- reproducibility claims are scoped to the pinned Actions runtime class, Node runtime, lockfile, and fixed build context;
- production provenance and output-parity checks remain required.

## 11. Audited checkpoint governance

PR #318 is governed by:

```text
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
.github/workflows/audited-100-checkpoint.yml
```

Binding rules:

- checkpoint source commit is `9a106f0938e6323de833c941d6ae863050f1f03b`;
- checkpoint generation covers canonical Registry v2 data, additive Registry v3 data, income-profile data, and approved compatibility overlays within the current provenance boundary;
- each source group records count, source file count, identity SHA-256, and content SHA-256;
- global canonical identity and content digests remain separate contracts;
- checkpoint release-integrity and reproducible-build baseline IDs must match current binding baselines;
- package-lock and package manifest digests are checkpoint inputs;
- the accepted PR #317 two-pass reproducibility result is checkpointed explicitly;
- production verification may observe a later noncanonical `main` release, but it must still pass public output verification, provenance verification, exact route/output parity, canonical checkpoint hash parity, canonical file-count parity, and reviewed canonical count parity;
- later canonical content, package graph, baseline identity, or checkpoint digest changes require deliberate review and must not silently overwrite this checkpoint.

## 12. Non-UI release-material governance

PR #320 is governed by:

```text
docs/non-ui-release-material-spec.md
docs/releases/100-asset-checkpoint-2026-07-06.md
scripts/validate-non-ui-release-material.mjs
```

Binding rules:

- README, release note, and reviewed update history must agree with the audited 100-asset checkpoint;
- release material derives counts, checkpoint ID, checkpoint source commit, canonical file count, canonical content digest, canonical identity digest, baseline IDs, and reproducibility result from binding repository sources;
- PR #320 must not create a second public count authority or a manually maintained release API;
- existing public machine-readable entry points remain `/version.json`, `/data/manifest.json`, `/llms.txt`, and `/ai.txt`;
- public release claims preserve `canonical_only = true`, `includes_unreviewed_candidates = false`, `includes_internal_monitoring = false`, and `includes_private_notes = false`;
- release material must distinguish checkpoint source commit from later noncanonical production commits;
- release material may not claim complete monitoring coverage, complete regulatory coverage, complete market-access coverage, safety ranking, risk scoring, automated canonical writes, or unimplemented product surfaces;
- PR #320 must not change canonical asset, organization, event, evidence, reserve, deployment, relationship, or Registry v3 source records;
- `package.json` and `package-lock.json` remain unchanged because they are audited checkpoint inputs;
- the existing `/updates/` history may receive the reviewed checkpoint entry, but this does not replace the later Phase I Reviewed Public Update Layer.

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

## 14. Monitoring coverage governance

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
- Zero coverage for a required domain is a valid audit result and must not be filled by inference;
- monitoring baseline synchronization is PR #321;
- reserve and redemption source expansion is PR #322;
- lifecycle, regulatory, and EU market-access source/schema expansion is PR #323;
- scheduled read-only operation is PR #324;
- monitoring output remains private candidate material until reviewed.

## 15. Statistics governance

`docs/stats-spec.md` is binding for PR #325-#328.

Statistics derive from reviewed canonical data and must not become live price, market-cap, APY, safety, transparency, or risk rankings.

## 16. Comparison and change-product governance

Phase F-I remains governed by `docs/comparison-and-change-product-spec.md` and the active numbering amendments.

Binding boundaries:

- Phase F starts only after the reviewed 110-asset checkpoint;
- asset lifecycle, issuance/redemption, legal/regulatory state, and market access remain separate analytical layers;
- canonical Market Access Records remain distinct from monitoring observations and editorial research matrices;
- Compare derives from reviewed canonical data and preserves unresolved states;
- facet freshness derives from authoritative record families;
- Change Timeline is a derived projection and does not replace source record families;
- public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds;
- safety scores, risk scores, best-asset rankings, and universal country availability claims are not approved.

## 17. Data preservation

UI, quality, taxonomy, monitoring, statistics, growth, editorial, release-material, comparison, market-access, timeline, and update-surface work must not silently reduce canonical coverage.

Before and after relevant changes, verify canonical asset, organization, relationship, event, evidence, reserve-context, known-unknown, regulatory-note, deployment, and route counts governed by the active baseline and audited checkpoint.
