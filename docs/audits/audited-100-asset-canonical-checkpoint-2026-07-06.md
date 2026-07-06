# Audited 100-asset canonical checkpoint

Status: supporting audit — PR #318  
Date: 2026-07-06  
Source checkpoint: `9a106f0938e6323de833c941d6ae863050f1f03b`

## Purpose

This report records the audited 100-asset canonical checkpoint after source-integrity hardening in PR #316 and reproducible-build hardening in PR #317.

The checkpoint does not add data. It binds the reviewed registry state to compact deterministic digests and verifies that source, release-integrity, reproducibility, and production layers agree before PR #319 prepares non-UI release material.

## Binding checkpoint

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
```

Checkpoint ID:

```text
sog_audited_100_asset_checkpoint_pr318_2026_07_06
```

## Source checkpoint

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

This is the merged PR #317 main checkpoint.

## Baseline linkage

```text
release integrity:
sog_release_integrity_pr316_2026_07_06

reproducible build:
sog_reproducible_build_pr317_2026_07_06
```

The checkpoint validator fails if either current baseline ID changes without a new reviewed checkpoint.

## Global canonical digests

Observed from the PR #317 main checkpoint:

```text
canonical files: 334
canonical content SHA-256:
8fa08219d1e587a0628576cdfcf0e64722348282897558016651a04ebea5a881

canonical identity SHA-256:
cec075cd1fbe71d65370328ee2a43adca8534eacfe4922584b4392cf249265cd
```

The content digest covers the canonical Registry v2 files, additive Registry v3 files, income-profile files, and approved compatibility overlays used by the current canonical provenance boundary.

The identity digest is separate from content digest so identity-set changes can be distinguished from content edits.

## Package linkage

```text
package-lock SHA-256:
e838b3ef0ca6293cc3ee707615e835ff01296c835c0fb7ec2853484dd1d2f0e1

package.json SHA-256:
7efdf178a2d1b7101eeb7b402218d89bd210a98036457d660e2970e63acbcf50
```

The package-lock digest matches the PR #317 reproducible-build baseline.

## Registry v2 checkpoint

```text
stablecoins: 100
organizations: 94
relationships: 110
classifications: 100
classification extensions: 2
profiles: 100
events: 172
event details: 172
evidence: 502
evidence relations: 502
reserve reports: 108
known unknowns: 289
regulatory notes: 9
deployments: 140
```

Each group is additionally bound by:

```text
record count
source file count
identity SHA-256
content SHA-256
```

The exact per-group digests are stored in the binding checkpoint JSON.

## Additive Registry v3 checkpoint

```text
legal profiles: 100
stable-asset relationships: 4
reserve components: 133
income profiles: 100
deployment view rows: 140
```

The first four source groups have explicit group count, identity digest, and content digest in the checkpoint. Deployment view count remains linked through the release-integrity expected counts and the 140 canonical deployment records.

## Public route checkpoint

```text
stablecoin detail routes: 100
organization detail routes: 94
event detail routes: 172
total detail routes: 366
declared main routes: 13
```

These values remain linked to the PR #316 release-integrity baseline and are rechecked by build and production parity verification.

## PR #317 reproducibility result linkage

Accepted PR #317 result:

```text
audited PR head:
41ae5cdc07f8e5bae74642cd6f8ada3c7ebba96f

output tree SHA-256:
21fd8cbf5db373e1f0483dc5d74203b825c0203d08ba1ff7f34b8235495981a4

file count: 414
total bytes: 15178769
failures: 0
reproducible: true
```

The PR #317 two-pass audit used identical dependency lock, Node runtime, source context, timestamp, and epoch. Both audited output trees matched byte-for-byte.

## Checkpoint generator

```text
scripts/generate-audited-100-checkpoint.mjs
```

The generator derives current observation values from the repository and writes an observation JSON.

It calculates:

- per-group counts;
- per-group identity digests;
- per-group content digests;
- canonical file count;
- global canonical content digest;
- global canonical identity digest;
- package digests;
- baseline linkage;
- reproducibility result linkage.

## Checkpoint validator

```text
scripts/validate-audited-100-checkpoint.mjs
```

The validator regenerates the current observation and compares it with the binding checkpoint.

It rejects drift in:

- source checkpoint linkage;
- release-integrity baseline ID;
- reproducible-build baseline ID;
- canonical file count;
- global canonical content digest;
- global canonical identity digest;
- package lock or manifest digest;
- Registry v2 group counts or digests;
- Registry v3 group counts or digests;
- release expected counts;
- PR #317 reproducibility result linkage;
- production verification contract.

## Production verification layer

The dedicated checkpoint workflow verifies production with:

```text
SOG_EXPECTED_COMMIT=9a106f0938e6323de833c941d6ae863050f1f03b
npm run check:production
```

The existing production chain verifies:

- intended deployed commit;
- public availability;
- version/manifest contract;
- canonical-only safety flags;
- public count consistency;
- build provenance;
- canonical hash shape and file count;
- route-count arithmetic;
- exact index link sets;
- exact sitemap route sets;
- detail-page canonical URLs;
- detail-page JSON-LD URL parity.

Production success is a workflow acceptance gate and does not write status back into canonical data.

## Data preservation

PR #318 changes no canonical registry content.

The checkpoint protects the reviewed 100-asset state and is not permission to normalize unknown values, add inferred facts, or bypass later review requirements.

## Explicit boundaries

PR #318 does not:

- add or remove stable assets;
- edit events or evidence;
- change lifecycle or market-access semantics;
- change the public machine-readable schema identity;
- add monitoring sources;
- accept monitoring baselines;
- activate scheduled monitoring;
- implement public stats;
- create canonical Market Access Records;
- edit public guide content;
- redesign the UI;
- create release notes or promotional material.

## Acceptance gate

PR #318 is complete only when the latest head passes:

```text
active workstream validation
Registry v2/v3 parity suite
release-integrity validation
reproducible-build contract validation
final-state validation
registry integrity validation
audited 100-asset checkpoint validation
production commit verification
production provenance verification
production exact output parity verification
general CI
relevant independent audit workflows
```

## Conclusion

The reviewed 100-asset SOG registry is now representable as a compact deterministic checkpoint rather than only as a set of mutable count statements.

The checkpoint binds identity, exact canonical content, release-integrity baseline, reproducibility baseline, dependency graph, reproducible output result, and production verification contract while preserving the existing canonical data and public schema.
