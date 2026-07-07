# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. every active roadmap amendment named by the roadmap
6. the canonical specification for the active work item
7. every queue, validator, audit, fixture, baseline, publication-gate review, release note, and research checkpoint named by that work item

Current schedule amendments:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

Current monitoring work must read:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

Release-hardening checkpoints remain binding:

```text
docs/migration/registry-release-integrity-baseline.json
docs/migration/reproducible-build-output-baseline.json
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/releases/100-asset-checkpoint-2026-07-06.md
```

Statistics work must read `docs/stats-spec.md`. Phase F-I work must read `docs/comparison-and-change-product-spec.md` together with current roadmap amendments.

## Repository source of truth

Merged repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

For PR numbering after inserted work, `docs/roadmap.md` and every active roadmap amendment named there override older numeric labels in subordinate plans.

## Current workstream

```text
Audited canonical source checkpoint:
9a106f0938e6323de833c941d6ae863050f1f03b

Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Deployments: 140
Detail routes: 366

PR #316 release integrity: complete
PR #317 reproducible build audit: complete
PR #318 audited 100-record canonical checkpoint: complete
PR #319 guide article spacing maintenance: complete, inserted work
PR #320 non-UI release material: complete
Active: PR #321 100-asset monitoring baseline synchronization
Next: PR #322 reserve and redemption source expansion
```

Approved remaining sequence:

```text
PR #321-#324  monitoring expansion and scheduled read-only operation
PR #325-#328  statistics implementation
PR #329       next candidate audit
PR #330-#334  controlled growth from 100 to 110
PR #335-#339  Comparison Foundation
PR #340-#342  Compare
PR #343-#346  Change Research Tools
PR #347-#348  Reviewed Public Update Layer
PR #349+      optional natural-language filter translation after separate approval
```

Do not skip ahead unless `docs/roadmap.md` is deliberately amended.

## Core data rules

- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce partial-date evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Canonical counts change only through an explicit audited data PR.
- Rebrand, migration continuation, wrapped representation, deployment, or alias records must not become separate canonical assets without scope support and lineage review.
- Archive absence is a quality queue item, not permission to fabricate an archive URL.
- Missing capability data means unknown knowledge state, not `false`.

Protected unresolved states:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## Release and checkpoint rules

- `docs/migration/registry-release-integrity-baseline.json` remains binding for source-state count, manifest, version, route, and provenance semantics.
- `docs/migration/reproducible-build-output-baseline.json` remains binding for reproducibility-sensitive release work until deliberately replaced.
- `docs/migration/audited-100-asset-canonical-checkpoint.json` remains binding for the reviewed 100-asset checkpoint.
- Candidate, monitoring, editorial-research, and private material remain outside canonical machine-readable provenance and public count surfaces.
- Production verification must continue to pass public output, provenance, route/output parity, canonical hash parity, canonical file-count parity, and reviewed count parity.

## PR #321 monitoring synchronization rules

- `docs/quality/monitoring-baseline-synchronization-100-assets-spec.md` is binding for PR #321.
- `scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json` is the binding synchronization snapshot.
- Current boundary is 100 assets, 94 organizations, 110 relationships, 24 sources, and 24 baseline rows.
- Source and baseline IDs must match exactly.
- All 24 baseline rows remain `pending_initial_acceptance`.
- Accepted baseline count remains zero.
- Accepted monitoring asset reach remains zero.
- Registered source reach is 16 assets; 84 assets remain explicitly uncovered.
- Current covered organization count is 12.
- Current multi-family asset count is 7.
- Synchronization is deterministic, offline, private, and read-only.
- PR #321 may not accept baselines, fetch live pages for acceptance, add sources, expand schema, schedule monitoring, write canonical data, edit guides automatically, create automatic canonical PRs, publish candidates, or deploy.
- Source expansion remains PR #322-#323. Scheduled read-only operation remains PR #324.

## Market-access rules

- Do not reduce access to a universal allowed/banned boolean.
- Preserve issuer identity, token regulatory path, service-provider authorization, legal entity, platform service state, geography, customer scope, function or access route, supported network, announcement date, and effective date separately.
- A platform licence is not proof of stablecoin function availability.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- The public guide is a reviewed dated snapshot and is never edited automatically from monitoring output.

## Monitoring rules

- Registered source reach is not accepted monitoring coverage.
- A pending baseline is not an accepted baseline.
- Issuer/protocol reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- Monitoring output is private candidate material only.
- Monitoring may not write canonical data, accept its own baselines, create branches or canonical PRs automatically, edit guides automatically, publish candidates, or deploy.

## Statistics and comparison rules

- `docs/stats-spec.md` is binding for PR #325-#328.
- Statistics derive from reviewed canonical data and do not become live price, market-cap, APY, safety, transparency, or risk rankings.
- Phase F-I begins only after the reviewed 110-asset checkpoint.
- Preserve separate analytical layers for lifecycle, issuance/redemption, legal/regulatory state, and market access.
- Compare uses reviewed canonical data, preserves unknown states, and does not score or recommend assets.
- Change Timeline is a derived projection and does not replace source record families.
- Public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds.

## Growth rule

Growth beyond 100 begins only after monitoring, statistics, and candidate-audit phases. Growth PRs contain no more than two new stable assets and preserve all applicable supporting record groups.

## Deployment rule

Normal merged changes publish from `main` under `docs/deployment-policy.md`. Monitoring synchronization remains internal and does not authorize monitoring output publication or canonical writes.
