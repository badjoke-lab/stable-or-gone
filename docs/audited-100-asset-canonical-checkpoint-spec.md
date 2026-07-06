# Stable or Gone audited 100-asset canonical checkpoint specification

Status: canonical implementation specification — PR #318  
Updated: 2026-07-06

## 1. Purpose

This specification defines the audited canonical checkpoint that closes the reviewed 100-asset registry state before non-UI release material is prepared.

PR #316 established source-state count, manifest, version, route, and provenance integrity. PR #317 established dependency-lock, runtime, timestamp, generated-output, protected-input, and two-pass byte-reproducibility contracts.

PR #318 binds those layers into one compact checkpoint contract:

```text
reviewed canonical source state
+ release-integrity baseline
+ reproducible-build baseline
+ canonical identity digests
+ canonical content digests
+ package graph digests
+ PR #317 reproducibility result
+ production commit/provenance/output-parity verification
= audited 100-asset checkpoint
```

PR #318 does not add records and does not create release marketing material. PR #319 remains responsible for non-UI release material.

## 2. Binding checkpoint file

The binding checkpoint is:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
```

It records:

- checkpoint source commit;
- reviewed Registry v2 counts;
- additive Registry v3 counts;
- per-group identity digests;
- per-group content digests;
- global canonical identity digest;
- global canonical content digest;
- canonical file count;
- package-lock digest;
- package.json digest;
- release-integrity baseline ID;
- reproducible-build baseline ID;
- PR #317 audited output tree digest, file count, total bytes, and result;
- required production verification contract.

## 3. Source checkpoint

The source checkpoint for PR #318 is the merged PR #317 main commit.

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

PR #318 itself may add checkpoint specifications, validators, reports, and workflows, but it must not change canonical record content. The checkpoint generator therefore computes canonical digests from the same canonical data boundary used by release provenance while recording the merged PR #317 source checkpoint separately.

## 4. Canonical data boundary

The checkpoint canonical content boundary includes:

- every Registry v2 canonical data-group file loaded through `docs/migration/registry-v2-baseline.json`;
- additive Registry v3 legal-profile files;
- additive stable-asset relationship files;
- additive reserve-component files;
- additive income-profile files;
- approved compatibility overlay files used by current provenance generation.

The boundary excludes:

- candidate data;
- private monitoring output;
- editorial research matrices;
- private review notes;
- artifacts;
- generated audit reports;
- public build output.

The checkpoint content boundary must remain aligned with the canonical provenance boundary unless an explicit specification update changes both contracts.

## 5. Per-group checkpoint contract

Each canonical record group records:

```text
record_count
file_count
identity_sha256
content_sha256
```

### 5.1 Identity digest

For a group, the identity digest is SHA-256 over sorted record IDs joined by newline.

Purpose:

- detect added or removed identities;
- detect replacement of record IDs;
- allow content edits to be distinguished from identity-set edits.

### 5.2 Content digest

For a group, the content digest is SHA-256 over sorted file path and exact file byte pairs.

Purpose:

- detect any canonical content change within the group;
- preserve exact source checkpoint identity without duplicating all rows into the checkpoint file.

## 6. Global canonical digests

### 6.1 Canonical content digest

The global canonical content digest hashes the sorted canonical file list using:

```text
path
NUL
exact file bytes
NUL
```

for each file.

### 6.2 Canonical identity digest

The global canonical identity digest hashes sorted group names and their group identity digests.

These digests serve different purposes and must not be collapsed into one field.

## 7. Baseline linkage

The checkpoint must reference the exact baseline IDs for:

```text
release integrity
reproducible build
```

The validator must fail if the current baseline IDs differ from the checkpoint.

This prevents a later baseline replacement from silently inheriting the old checkpoint approval.

## 8. Package graph linkage

The checkpoint records:

```text
package_lock_sha256
package_json_sha256
```

The lock digest must match the reproducible-build baseline.

A package manifest or lockfile change after PR #318 requires a new reviewed checkpoint or a deliberate release-hardening update, depending on roadmap phase.

## 9. Reproducibility result linkage

The checkpoint records the accepted PR #317 two-pass result:

```text
audited PR head
output tree SHA-256
file count
total bytes
failure count
reproducible boolean
```

The accepted PR #317 result is:

```text
audited PR head: 41ae5cdc07f8e5bae74642cd6f8ada3c7ebba96f
file count: 414
total bytes: 15178769
failures: 0
reproducible: true
```

The exact tree SHA-256 is stored in the checkpoint file.

## 10. Production verification layer

The checkpoint is not complete from source state alone.

The checkpoint workflow must verify production against the merged PR #317 source commit using the existing production checks:

```text
npm run check:production
```

with:

```text
SOG_EXPECTED_COMMIT=9a106f0938e6323de833c941d6ae863050f1f03b
```

The production verification chain checks:

- intended deployed commit;
- homepage and public route availability;
- version and manifest contract;
- public record counts;
- public breakdown counts;
- detail-link counts;
- sitemap detail URL counts;
- machine-readable safety flags;
- production build provenance;
- canonical data hash shape;
- canonical file count positivity;
- provenance count/route arithmetic;
- exact stablecoin, organization, and event route sets;
- detail-page canonical URLs;
- detail-page JSON-LD URLs.

Production verification remains a workflow result, not a field copied into canonical data.

## 11. Generator

The observation generator is:

```text
scripts/generate-audited-100-checkpoint.mjs
```

It deterministically derives:

- actual group counts;
- group identity digests;
- group content digests;
- global canonical content digest;
- global canonical identity digest;
- package digests;
- baseline IDs;
- accepted PR #317 reproducibility result linkage.

The final validator recomputes the observation and compares it with the binding checkpoint.

## 12. Validator

The binding validator is:

```text
scripts/validate-audited-100-checkpoint.mjs
```

It must fail on:

- source checkpoint mismatch;
- release-integrity baseline ID mismatch;
- reproducible-build baseline ID mismatch;
- canonical file-count mismatch;
- global canonical content digest mismatch;
- global canonical identity digest mismatch;
- package-lock digest mismatch;
- package manifest digest mismatch;
- any Registry v2 group count mismatch;
- any Registry v2 group identity mismatch;
- any Registry v2 group content mismatch;
- any additive Registry v3 group count mismatch;
- any additive Registry v3 group identity mismatch;
- any additive Registry v3 group content mismatch;
- PR #317 reproducibility-result mismatch;
- release expected count mismatch.

## 13. CI and checkpoint workflow

General CI runs:

```text
npm run validate:checkpoint-100
```

after release-integrity and reproducibility source-contract validation.

The dedicated checkpoint workflow runs:

```text
npm ci
-> validate active workstream
-> validate parity suite
-> validate final state
-> validate registry integrity
-> validate 100-asset checkpoint
-> verify production at the PR #317 merge commit
-> upload checkpoint validation result
```

## 14. Data preservation

The checkpoint protects the reviewed state:

```text
stable assets: 100
organizations: 94
relationships: 110
classifications: 100
profiles: 100
events: 172
event details: 172
evidence: 502
evidence relations: 502
reserve reports: 108
known unknowns: 289
regulatory notes: 9
deployments: 140
legal profiles: 100
stable-asset relationships: 4
reserve components: 133
income profiles: 100
deployment view rows: 140
detail routes: 366
```

## 15. Explicit non-goals

PR #318 does not:

- add or remove canonical stable assets;
- edit canonical events or evidence;
- change Registry v2 or Registry v3 semantics;
- change machine-readable public schema identity;
- expand monitoring sources;
- accept monitoring baselines;
- schedule monitoring;
- implement public statistics;
- create canonical Market Access Records;
- edit guide content;
- redesign the UI;
- create release notes, changelogs, or promotional material.

## 16. Completion condition

PR #318 is complete when:

```text
observed canonical digests are captured from the PR #317 main checkpoint
binding checkpoint file exists
checkpoint validator exists
general CI runs checkpoint validation
dedicated checkpoint workflow exists
source counts and digests match the checkpoint
PR #317 reproducibility result is linked and validated
production verifies the PR #317 merge commit
roadmap and workstream authority show PR #318 active / PR #319 next
full CI and checkpoint workflow are green
```
