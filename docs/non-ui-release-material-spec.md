# Stable or Gone non-UI release material specification

Status: canonical implementation specification — PR #320  
Updated: 2026-07-06

## 1. Purpose

PR #320 converts the reviewed 100-asset checkpoint into accurate repository and public change-history material without changing canonical registry data or adding a new UI surface.

The release material must answer:

```text
What is SOG now?
What reviewed data checkpoint has been reached?
What does the checkpoint protect?
What machine-readable surfaces expose the current registry?
What quality and safety boundaries remain in force?
What comes next in the approved roadmap?
```

This is release documentation and change-history work. It is not a marketing launch, not a new dashboard, and not the later Reviewed Public Update Layer planned for Phase I.

## 2. Inputs

PR #320 derives release facts from:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/audits/audited-100-asset-canonical-checkpoint-2026-07-06.md
docs/migration/registry-release-integrity-baseline.json
docs/migration/reproducible-build-output-baseline.json
docs/roadmap.md
src/lib/machine-readable.ts
```

Release material must not invent or hand-maintain conflicting count values.

## 3. Required outputs

PR #320 must produce or update:

```text
README.md
docs/releases/100-asset-checkpoint-2026-07-06.md
data/registry-updates.json
scripts/validate-non-ui-release-material.mjs
.github/workflows/ci.yml
```

Authority files must also advance to PR #320 active / PR #321 next.

## 4. README contract

README must stop describing the registry as a 92-asset UI-repair checkpoint.

The current checkpoint section must accurately state:

```text
100 stable assets
94 organizations
110 relationships
100 classifications
100 profiles
172 events
172 event detail records
502 evidence records
502 evidence relation projections
108 reserve-report or reserve-context records
289 known unknowns
9 regulatory notes
140 deployments
100 legal profiles
4 stable-asset relationships
133 reserve components
100 income profiles
366 detail routes
```

README must also state that:

- the audited canonical source checkpoint is protected by deterministic group and global digests;
- release integrity, reproducibility, and production parity checks are in force;
- unreviewed candidates and internal monitoring remain outside the public canonical layer;
- the next roadmap phase after release material is monitoring baseline synchronization and source expansion;
- Compare and the canonical Market Access Record family remain later approved work and are not yet implemented.

## 5. Release note contract

The release note is:

```text
docs/releases/100-asset-checkpoint-2026-07-06.md
```

It must record:

- the 100-asset checkpoint counts;
- checkpoint source commit;
- canonical file count;
- canonical content SHA-256;
- canonical identity SHA-256;
- release-integrity baseline ID;
- reproducible-build baseline ID;
- accepted PR #317 reproducibility result;
- current public machine-readable entry points;
- data-safety boundaries;
- explicit non-goals;
- next approved roadmap sequence.

The release note must distinguish:

```text
checkpoint source commit
from
current production source commit
```

A later noncanonical production release does not change the audited canonical checkpoint if checkpoint parity continues to pass.

## 6. Public change-history entry

PR #320 adds one reviewed entry to `data/registry-updates.json`.

The entry describes the audited 100-asset checkpoint and links only to existing public routes, such as:

```text
/stablecoins/
/issuers/
/events/
/methodology/
/updates/
/data/manifest.json
/version.json
```

It must not claim:

- live market coverage;
- complete regulatory coverage;
- complete market-access monitoring;
- accepted monitoring baseline coverage;
- a safety or risk ranking;
- automatic canonical updates;
- Compare or Access & Regulation Explorer availability.

## 7. Machine-readable release references

Release material should point readers to the existing public machine-readable layer rather than creating a parallel release API.

Existing entry points include:

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
```

PR #320 must not create a second count authority or a manually maintained public release JSON file.

## 8. Safety boundaries

The release material must preserve the public data-safety contract:

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

Monitoring observations, pending baselines, editorial research matrices, and private review material remain outside canonical public release claims.

## 9. Validator

The validator is:

```text
scripts/validate-non-ui-release-material.mjs
```

It must fail when:

- README contains stale 92-asset checkpoint wording;
- README misses the reviewed 100-asset checkpoint counts;
- release note checkpoint ID or source commit differs from the binding checkpoint;
- canonical file count differs;
- canonical content or identity digest differs;
- baseline IDs differ;
- accepted reproducibility result differs;
- release note omits machine-readable entry points;
- release note omits safety boundaries;
- reviewed update entry is missing or duplicated;
- update entry claims an unimplemented product surface;
- roadmap authority does not show PR #320 active / PR #321 next.

General CI runs the validator directly with Node. PR #320 must not change `package.json` or `package-lock.json`, because those are checkpoint inputs protected by PR #318.

## 10. Explicit non-goals

PR #320 does not:

- add or remove canonical stable assets;
- edit canonical asset, organization, event, evidence, reserve, deployment, or relationship records;
- change Registry v2 or Registry v3 semantics;
- change the audited checkpoint digests;
- create a new public stats page;
- expand monitoring sources;
- accept monitoring baselines;
- schedule monitoring;
- create canonical Market Access Records;
- implement Compare;
- implement Access & Regulation Explorer;
- implement Change Timeline;
- create a new UI layout;
- publish raw monitoring output.

## 11. Completion condition

PR #320 is complete when:

```text
README reflects the reviewed 100-asset checkpoint
release note exists and matches binding checkpoint facts
reviewed public update entry exists
release material validator passes
general CI runs release material validation
authority docs show PR #318 complete / PR #320 active / PR #321 next
canonical checkpoint validator still passes
reproducibility contract still passes
full CI and relevant independent workflows are green
```
