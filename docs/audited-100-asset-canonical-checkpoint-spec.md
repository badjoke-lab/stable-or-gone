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
+ current production public-output/provenance/checkpoint parity verification
= audited 100-asset checkpoint
```

PR #318 does not add records and does not create release material. PR #319 was consumed by narrow guide maintenance. PR #320 remains responsible for non-UI release material.

## 2. Binding checkpoint

The binding checkpoint is:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
```

It records:

- checkpoint source commit;
- Registry v2 group counts and digests;
- additive Registry v3 group counts and digests;
- global canonical identity digest;
- global canonical content digest;
- canonical file count;
- package-lock digest;
- package.json digest;
- release-integrity baseline ID;
- reproducible-build baseline ID;
- PR #317 audited output tree result;
- production verification contract.

## 3. Source checkpoint

The checkpoint source is the merged PR #317 main commit:

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

PR #318 may add checkpoint specifications, validators, reports, and workflows, but it must not change canonical record content or package inputs protected by the checkpoint.

A later noncanonical `main` release does not replace the checkpoint source commit. Production verification must instead prove that the later release still publishes the same audited canonical checkpoint.

## 4. Canonical data boundary

The checkpoint content boundary includes:

- every Registry v2 canonical data-group file loaded through `docs/migration/registry-v2-baseline.json`;
- additive Registry v3 legal-profile files;
- additive stable-asset relationship files;
- additive reserve-component files;
- additive income-profile files;
- approved compatibility overlay files used by current provenance generation.

The boundary excludes candidate data, private monitoring output, editorial research matrices, private review notes, artifacts, generated audit reports, and public build output.

The checkpoint content boundary must remain aligned with the canonical provenance boundary unless an explicit specification update changes both contracts.

## 5. Per-group checkpoint contract

Each source record group records:

```text
record_count
file_count
identity_sha256
content_sha256
```

The group identity digest is SHA-256 over sorted record IDs joined by newline.

The group content digest is SHA-256 over sorted file path and exact file byte pairs.

Identity and content digests remain separate so identity-set changes can be distinguished from content edits.

## 6. Global canonical digests

The global canonical content digest hashes the sorted canonical file list using:

```text
path
NUL
exact file bytes
NUL
```

for each file.

The global canonical identity digest hashes sorted group names and their group identity digests.

Observed binding values:

```text
canonical files: 334
canonical content SHA-256:
8fa08219d1e587a0628576cdfcf0e64722348282897558016651a04ebea5a881

canonical identity SHA-256:
cec075cd1fbe71d65370328ee2a43adca8534eacfe4922584b4392cf249265cd
```

## 7. Baseline linkage

The checkpoint references exact baseline IDs for:

```text
release integrity
reproducible build
```

The validator fails if current baseline IDs differ from the checkpoint.

This prevents a later baseline replacement from silently inheriting the old checkpoint approval.

## 8. Package graph linkage

The checkpoint records:

```text
package_lock_sha256
package_json_sha256
```

The lock digest must match the reproducible-build baseline.

PR #318 intentionally does not modify `package.json` or `package-lock.json`, because those files are checkpoint inputs from the PR #317 main source state.

## 9. Reproducibility result linkage

The accepted PR #317 result is:

```text
audited PR head: 41ae5cdc07f8e5bae74642cd6f8ada3c7ebba96f
output tree SHA-256: 21fd8cbf5db373e1f0483dc5d74203b825c0203d08ba1ff7f34b8235495981a4
file count: 414
total bytes: 15178769
failures: 0
reproducible: true
```

The checkpoint validator verifies this linkage exactly.

## 10. Production verification layer

The checkpoint is not complete from source state alone.

The dedicated checkpoint workflow performs two production layers.

### 10.1 Current public-output verification

```text
env -u SOG_EXPECTED_COMMIT -u GITHUB_SHA npm run check:production
```

This verifies the current production release without requiring it to use the older checkpoint source commit.

The existing production chain checks:

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

### 10.2 Audited checkpoint parity

```text
node scripts/check-production-audited-checkpoint.mjs
```

This compares current production provenance with the audited checkpoint and fails on:

- canonical data hash mismatch;
- canonical file-count mismatch;
- reviewed Registry v2 canonical count mismatch;
- reviewed route-count mismatch.

A later noncanonical release is allowed only when all current public-output checks and checkpoint parity checks pass.

## 11. Generator

The observation generator is:

```text
scripts/generate-audited-100-checkpoint.mjs
```

It deterministically derives actual group counts, group identity/content digests, global canonical digests, package digests, baseline IDs, and the accepted PR #317 reproducibility-result linkage.

## 12. Validator

The binding validator is:

```text
scripts/validate-audited-100-checkpoint.mjs
```

It regenerates the current observation and fails on:

- source checkpoint mismatch;
- release-integrity baseline ID mismatch;
- reproducible-build baseline ID mismatch;
- canonical file-count mismatch;
- global canonical content digest mismatch;
- global canonical identity digest mismatch;
- package-lock digest mismatch;
- package manifest digest mismatch;
- Registry v2 group count, identity, or content mismatch;
- additive Registry v3 group count, identity, or content mismatch;
- PR #317 reproducibility-result mismatch;
- release expected count mismatch;
- production verification contract mismatch.

## 13. CI and checkpoint workflow

General CI runs:

```text
node scripts/validate-audited-100-checkpoint.mjs
```

after release-integrity and reproducibility source-contract validation.

The dedicated checkpoint workflow runs:

```text
npm ci
-> validate active workstream
-> validate parity suite
-> validate final state
-> rebuild and validate current registry integrity
-> validate audited 100-asset checkpoint
-> verify current production public outputs and provenance
-> verify production canonical checkpoint parity
-> upload checkpoint validation result
```

## 14. Data preservation

The checkpoint protects:

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
checkpoint generator exists
checkpoint validator exists
general CI runs checkpoint validation
dedicated checkpoint workflow exists
source counts and digests match checkpoint
PR #317 reproducibility result is linked and validated
current production public outputs and provenance pass
production canonical hash/file-count/count/route parity match checkpoint
roadmap and workstream authority show PR #318 active / PR #320 next planned item
full CI and checkpoint workflow are green
```
