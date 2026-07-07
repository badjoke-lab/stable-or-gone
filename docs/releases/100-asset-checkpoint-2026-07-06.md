# Stable or Gone — audited 100-asset checkpoint

Status: reviewed release material  
Checkpoint date: 2026-07-06  
Checkpoint ID: `sog_audited_100_asset_checkpoint_pr318_2026_07_06`

## What this checkpoint means

Stable or Gone has reached a reviewed canonical checkpoint of 100 stable assets.

This is not a live-market milestone and not a safety ranking. It is a repository and public-output checkpoint covering canonical stable-asset records together with organizations, relationships, classifications, reserve/redemption context, lifecycle events, evidence, known unknowns, regulatory notes, deployments, and additive Registry v3 record families.

The checkpoint is protected by source-state count checks, machine-readable count parity, build provenance, a locked dependency graph, fixed-context reproducibility checks, deterministic canonical digests, route parity, and production verification.

## Reviewed record counts

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
reserve reports / reserve context: 108
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

## Canonical checkpoint identity

The audited source checkpoint is:

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

The checkpoint contains:

```text
canonical files: 334
canonical content SHA-256:
8fa08219d1e587a0628576cdfcf0e64722348282897558016651a04ebea5a881

canonical identity SHA-256:
cec075cd1fbe71d65370328ee2a43adca8534eacfe4922584b4392cf249265cd
```

The content and identity digests serve different purposes. The content digest binds exact canonical source bytes within the approved provenance boundary. The identity digest binds the reviewed record-identity sets by record group.

## Baseline linkage

```text
release integrity baseline:
sog_release_integrity_pr316_2026_07_06

reproducible build baseline:
sog_reproducible_build_pr317_2026_07_06
```

A later baseline replacement does not inherit this checkpoint automatically. A deliberate reviewed update is required.

## Reproducibility result

Accepted PR #317 result:

```text
audited PR head:
41ae5cdc07f8e5bae74642cd6f8ada3c7ebba96f

output tree SHA-256:
21fd8cbf5db373e1f0483dc5d74203b825c0203d08ba1ff7f34b8235495981a4

output files: 414
total bytes: 15178769
failures: 0
reproducible: true
```

The reproducibility claim is scoped to the pinned GitHub Actions Linux runtime class, Node 22.22.0, the reviewed package lock, and a fixed build context.

## Checkpoint source vs current production source

The checkpoint source commit remains the reviewed PR #317 main checkpoint:

```text
9a106f0938e6323de833c941d6ae863050f1f03b
```

Production may later publish a newer `main` commit that changes noncanonical material such as guide presentation or documentation.

A later production source is acceptable only while production verification continues to confirm:

- public output consistency;
- build provenance validity;
- exact stablecoin, organization, and event route parity;
- canonical data hash parity with this checkpoint;
- canonical file-count parity;
- reviewed canonical count parity;
- reviewed route-count parity.

This keeps release history honest without treating every noncanonical maintenance commit as a new canonical data checkpoint.

## Public machine-readable entry points

The current public machine-readable layer is exposed through existing routes:

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
```

`version.json` exposes project identity, build provenance, reviewed count surfaces, additive Registry v3 summary data, and public routes.

`data/manifest.json` describes the public data model, counts, and safety boundary.

`llms.txt` and `ai.txt` provide machine-oriented usage and discovery guidance.

This release does not create a parallel count authority or a separate manually maintained release API.

## Public data-safety boundary

The public machine-readable layer remains restricted to reviewed canonical material.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

The following remain outside public canonical release claims:

- unreviewed candidates;
- pending monitoring baselines;
- raw monitoring observations;
- private review material;
- editorial research matrices that have not become canonical records;
- unsupported inferred values.

## What this release does not claim

The checkpoint does not claim:

- complete stablecoin coverage;
- complete reserve, redemption, regulatory, or market-access coverage;
- accepted monitoring coverage for all 100 assets;
- live price, market-cap, APY, depeg, or redemption monitoring;
- a safety or risk score;
- automatic canonical writes from monitoring;
- complete platform-policy coverage;
- universal country availability;
- a current Compare product;
- a current Access & Regulation Explorer;
- a current Change Timeline product.

## Next approved work

The roadmap continues in this order:

```text
PR #321  100-asset monitoring baseline synchronization
PR #322  reserve and redemption source expansion
PR #323  lifecycle, regulatory, and EU market-access source/schema expansion
PR #324  bounded scheduled read-only monitoring

PR #325-#328  statistics implementation
PR #329       next candidate audit
PR #330-#334  controlled growth from 100 to 110
```

After a reviewed 110-asset checkpoint, the approved later product sequence begins with Comparison Foundation, then Compare, Access & Regulation Explorer, Change Timeline, and reviewed public update surfaces.

## Verification references

Binding checkpoint:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
```

Checkpoint specification:

```text
docs/audited-100-asset-canonical-checkpoint-spec.md
```

Checkpoint audit:

```text
docs/audits/audited-100-asset-canonical-checkpoint-2026-07-06.md
```

Release integrity baseline:

```text
docs/migration/registry-release-integrity-baseline.json
```

Reproducible build baseline:

```text
docs/migration/reproducible-build-output-baseline.json
```

## Boundary

This release material documents a reviewed checkpoint. It does not replace canonical records, evidence relations, repository diffs, methodology, or the machine-readable manifest.
