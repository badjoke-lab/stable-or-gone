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
7. every queue, validator, audit, fixture, baseline, publication-gate review, and research checkpoint named by that work item

Current schedule amendments:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

Current release-hardening specifications and baselines:

```text
docs/quality/non-ui-quality-program.md
docs/data-model-v3-spec.md
docs/registry-v2-v3-machine-readable-parity-spec.md
docs/migration/registry-v3-parity-baseline.json
docs/counts-manifest-version-provenance-integrity-spec.md
docs/migration/registry-release-integrity-baseline.json
docs/audits/counts-manifest-version-provenance-integrity-100-assets.md
docs/reproducible-build-generated-output-audit-spec.md
docs/migration/reproducible-build-output-baseline.json
docs/audits/reproducible-build-generated-output-audit-2026-07-06.md
docs/audited-100-asset-canonical-checkpoint-spec.md
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/audits/audited-100-asset-canonical-checkpoint-2026-07-06.md
docs/non-ui-release-material-spec.md
docs/releases/100-asset-checkpoint-2026-07-06.md
```

Monitoring work must also read the monitoring specifications under `docs/quality/`. Statistics work must read `docs/stats-spec.md`. Phase F-I work must read `docs/comparison-and-change-product-spec.md` together with the current roadmap amendments.

## Repository source of truth

Merged repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

For PR numbering after inserted editorial or maintenance work, `docs/roadmap.md` and every active roadmap amendment named there override older numeric labels in subordinate plans. Approved work order and scope remain unchanged unless the roadmap explicitly says otherwise.

## Current workstream

```text
Audited canonical source checkpoint:
9a106f0938e6323de833c941d6ae863050f1f03b

PR #318 merge checkpoint:
b275178f3816d1ebf3828f223b546f04de1edae7

Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366

PR #311 Registry v2/v3 and machine-readable parity: complete
PR #312 Ripple EU CASP guide update: complete
PR #313 first EEA-scope follow-up: closed without merge
PR #314 corrected guide follow-up: complete
PR #315 schedule amendment and PR renumbering: complete
PR #316 counts, manifest, version, and provenance integrity: complete
PR #317 reproducible build and generated-output audit: complete
PR #318 audited 100-record canonical checkpoint: complete
PR #319 guide article spacing maintenance: complete, inserted work
Active: PR #320 non-UI release material
Next: PR #321 100-asset monitoring baseline synchronization
```

Approved remaining sequence:

```text
PR #320       non-UI release material
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

## Release-integrity rules

- `docs/migration/registry-release-integrity-baseline.json` remains binding for source-state count, manifest, version, route, and provenance semantics.
- `docs/migration/reproducible-build-output-baseline.json` remains binding for reproducibility-sensitive release work until deliberately replaced.
- `docs/migration/audited-100-asset-canonical-checkpoint.json` remains binding for the reviewed 100-asset release checkpoint.
- `version.json` and `data/manifest.json` derive counts and build metadata from shared machine-readable getters.
- The checked-in `data/generated/build-provenance.json` is an explicit sentinel template, not valid runtime provenance.
- Build-time provenance must replace sentinel values with real commit, branch, timestamp, non-zero hash, and positive canonical file count.
- Version and manifest build provenance must match after build.
- Generated detail routes must match canonical stablecoin, organization, and event sets.
- Candidate, monitoring, editorial-research, and private material remain outside canonical machine-readable provenance and public count surfaces.

## Reproducible-build rules

- CI, reproducibility audit, and production deployment use the reviewed `package-lock.json` through `npm ci --no-audit --no-fund`.
- Release-hardening CI, reproducibility audit, and production deployment pin Node 22.22.0.
- Reproducibility audit and production deployment provide deterministic build timestamp context.
- Production timestamp and epoch derive from the deployed commit.
- Normal site build must not overwrite the tracked historical `data/generated/registry-stats.json` quality-baseline input.
- Two fixed-context builds must produce identical audited bytes for `dist/**`, generated build provenance, and deployment-taxonomy diagnostic output.
- Protected historical baseline inputs must remain unchanged through both builds.

## Audited checkpoint rules

- The checkpoint source commit is `9a106f0938e6323de833c941d6ae863050f1f03b`.
- The checkpoint records per-group count, identity SHA-256, and content SHA-256 for canonical Registry v2 and additive Registry v3 source groups.
- Global canonical content and identity digests remain separate contracts.
- The checkpoint links exact release-integrity and reproducible-build baseline IDs.
- The checkpoint links package-lock and package.json digests.
- The accepted PR #317 reproducibility result remains part of the checkpoint contract.
- Production verification may observe a later noncanonical `main` release, but must still pass public output verification, provenance verification, exact route/output parity, checkpoint canonical-data hash parity, canonical file-count parity, and reviewed count parity.
- A later canonical content, package graph, or checkpoint baseline change requires deliberate checkpoint review rather than silent baseline drift.

## PR #320 release-material rules

- `docs/non-ui-release-material-spec.md` is binding for PR #320.
- README, release note, and reviewed update history must agree with the binding checkpoint.
- PR #320 must not create a second public count authority or manually maintained release API.
- Existing machine-readable entry points remain `/version.json`, `/data/manifest.json`, `/llms.txt`, and `/ai.txt`.
- Release material must preserve public data-safety boundaries and may not claim complete monitoring, complete market-access coverage, or unimplemented product surfaces.
- PR #320 must not change canonical asset, organization, event, evidence, reserve, deployment, relationship, or Registry v3 source records.
- `package.json` and `package-lock.json` remain unchanged because they are checkpoint inputs.

## Market-access rules

- Do not reduce access to a universal allowed/banned boolean.
- Preserve issuer identity, token regulatory path, service-provider authorization, legal entity, platform service state, geography, customer scope, function or access route, supported network, announcement date, and effective date separately.
- A platform licence is not proof of stablecoin function availability.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- The public guide is a reviewed dated snapshot and is never edited automatically from monitoring output.

## Monitoring rules

- Registered source reach is not accepted monitoring coverage.
- Issuer/protocol reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- Monitoring output is candidate material only.
- Monitoring may not write canonical data, accept its own baselines, create branches or canonical PRs automatically, edit guides automatically, publish candidates, or deploy.
- Monitoring baseline synchronization is PR #321.
- Source/schema expansion is scheduled for PR #322-#323.
- Scheduled read-only monitoring is PR #324.

## Statistics and comparison rules

- `docs/stats-spec.md` is binding for PR #325-#328.
- Statistics derive from reviewed canonical data and do not become live price, market-cap, APY, safety, transparency, or risk rankings.
- Phase F-I begins only after the reviewed 110-asset checkpoint.
- Preserve separate analytical layers for lifecycle, issuance/redemption, legal/regulatory state, and market access.
- Compare uses reviewed canonical data, preserves unknown states, and does not score or recommend assets.
- Change Timeline is a derived projection and does not replace source record families.
- Public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds.

## Growth rule

Growth beyond 100 begins only after release hardening, monitoring, statistics, and candidate-audit phases. Growth PRs contain no more than two new stable assets and preserve all applicable supporting record groups.

## Deployment rule

Normal merged changes publish from `main` under `docs/deployment-policy.md`. GitHub CI success is the development completion gate. Production parity must be established through the repository's provenance and output-parity checks.
