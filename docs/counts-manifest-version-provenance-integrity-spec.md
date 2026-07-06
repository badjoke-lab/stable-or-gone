# Stable or Gone counts, manifest, version, and provenance integrity specification

Status: canonical implementation specification — PR #316  
Updated: 2026-07-06

## 1. Purpose

This specification closes the source-to-public integrity boundary for the reviewed 100-asset checkpoint.

The repository already validates Registry v2/v3 parity and verifies built public outputs. PR #316 adds an explicit source-state contract so that canonical counts, machine-readable count surfaces, route counts, and build provenance cannot silently drift apart between release-hardening phases.

The integrity chain is:

```text
composed canonical registry
-> reviewed release-integrity baseline
-> machine-readable count getters
-> version.json
-> data/manifest.json
-> generated build provenance
-> generated routes
-> deployed production verification
```

PR #316 does not add records, expand monitoring, implement statistics, or change the public machine-readable schema.

## 2. Governing baseline

The binding baseline is:

```text
docs/migration/registry-release-integrity-baseline.json
```

It records:

- expected Registry v2 counts;
- expected additive Registry v3 counts;
- expected public primary counts;
- expected public breakdown counts;
- expected generated detail-route counts;
- machine-readable path and compatibility contracts;
- source-template and runtime build-provenance contracts.

The Registry v3 parity baseline remains authoritative for v2/v3 parity semantics:

```text
docs/migration/registry-v3-parity-baseline.json
```

The release-integrity validator must fail if the two baselines disagree on overlapping count fields.

## 3. Canonical count rule

Canonical counts are derived from the composed registry manifests and their data files. They must not be hand-maintained independently in public endpoint code.

The reviewed 100-asset checkpoint is:

```text
stablecoins: 100
organizations: 94
relationships: 110
classifications: 100
profiles: 100
events: 172
event_details: 172
evidence: 502
evidence_relations: 502
reserve_reports: 108
known_unknowns: 289
regulatory_notes: 9
deployments: 140
```

Additive Registry v3 counts are:

```text
legal_profiles: 100
stable_asset_relationships: 4
reserve_components: 133
income_profiles: 100
deployment_view: 140
```

The validator compares actual composed file counts against both the release-integrity baseline and the Registry v3 parity baseline.

## 4. Public count surfaces

The public contract remains additive and backward-compatible.

`version.json` exposes:

```text
data.record_counts
data.record_count_breakdown
data.registry_v3
```

`data/manifest.json` exposes:

```text
record_counts
record_count_breakdown
registry_v3
```

Both endpoints must derive counts from the shared functions in:

```text
src/lib/machine-readable.ts
```

Required shared getters:

```text
getRecordCounts()
getRecordCountBreakdown()
getRegistryV3Summary()
getBuildMetadata()
```

No endpoint may define an independent hard-coded count table for the current registry checkpoint.

## 5. Version and manifest parity

The following must remain identical between version and manifest outputs after build:

```text
schema family identity
project identity
registry family
registry type
canonical origin
build provenance object
primary record counts
record count breakdown
Registry v3 additive summary semantics
```

The version and manifest endpoint source files must continue to use the same shared count and build getters.

Build-time output verification remains responsible for deep equality of rendered JSON objects. PR #316 adds source-level contract checks so drift is caught before output verification is the only line of defense.

## 6. Build provenance contract

`data/generated/build-provenance.json` has two states.

### 6.1 Source-template state

Before a build regenerates it, the checked-in file is an explicit sentinel template.

Required sentinel markers:

```text
source_commit: unknown
source_branch: main
generated_at: 1970-01-01T00:00:00.000Z
canonical_data_hash: sha256:000...000
canonical_file_count: 0
```

The template must still carry the current reviewed canonical record counts and route counts. This prevents a stale older registry checkpoint from being presented inside the source tree.

The sentinel file is not a release artifact and must not be accepted as valid runtime provenance.

### 6.2 Runtime-generated state

`npm run build:site` runs:

```text
npm run generate:deployment-taxonomy
npm run generate:provenance
astro build
```

The provenance generator must replace the sentinel fields with:

```text
real source commit
real source branch
real build timestamp
non-zero sha256 canonical-data hash
positive canonical file count
current canonical record counts
current route counts
```

Runtime verification must reject:

- unknown commit;
- zero hash;
- zero canonical file count;
- count mismatch;
- route mismatch;
- version/manifest provenance disagreement.

## 7. Route integrity

The expected 100-record route checkpoint is:

```text
stablecoin detail routes: 100
organization detail routes: 94
event detail routes: 172
total detail routes: 366
declared main routes: 13
```

The source-level validator checks the expected route arithmetic and the provenance template route counts.

Build-time verification remains responsible for confirming that the generated `dist` directories, index links, sitemap URLs, canonical tags, and JSON-LD URLs match the canonical sets.

## 8. Provenance hash boundary

The canonical data hash is generated from the sorted canonical provenance input file list assembled by the provenance generator.

The hash boundary must:

- include the composed Registry v2 canonical file groups;
- include additive Registry v3 canonical file groups;
- include income-profile files;
- include approved compatibility overlays;
- exclude private monitoring outputs;
- exclude candidate data;
- exclude editorial research matrices;
- exclude private notes.

PR #316 does not change the hash algorithm or input policy. It validates that the generator remains wired to canonical manifests and that the public endpoints expose the generated provenance object.

## 9. Validation responsibilities

### Source-state validation

```text
npm run validate:release-integrity
```

Checks:

- actual v2 counts against release baseline;
- actual v3 counts against release baseline;
- release baseline against parity baseline;
- public count-path contract;
- shared getter use in version and manifest endpoint sources;
- machine-readable schema markers;
- provenance generator wiring;
- checked-in provenance sentinel markers;
- checked-in provenance counts and route counts;
- protected data-safety contract markers.

### Build-state validation

Existing checks continue to validate:

```text
npm run verify:provenance
npm run verify:output-parity
npm run verify:public
```

PR #316 does not replace those checks.

## 10. CI placement

The release-integrity validator runs after Registry v2/v3 parity validation and before final-state validation/build.

The intended order is:

```text
Registry v2/v3 parity validation
-> release integrity validation
-> final-state validation
-> Astro check
-> build
-> deployment output verification
-> public layer verification
```

## 11. Explicit non-goals

PR #316 does not:

- add canonical stable assets;
- add organizations, events, or evidence;
- change Registry v2 public schema identity;
- remove Registry v3 additive summaries;
- implement stats outputs or `/stats/`;
- expand monitoring sources;
- accept monitoring baselines;
- schedule monitoring;
- create canonical market-access records;
- edit the EU/EEA guide;
- redesign the UI;
- deploy manually.

## 12. Completion condition

PR #316 is complete when:

```text
release-integrity baseline exists
source-state validator exists
checked-in provenance template reflects the 100-record checkpoint
version and manifest source contracts are guarded
provenance generator wiring is guarded
CI runs the new validator
roadmap and workstream markers show PR #316 active / PR #317 next
full CI is green
```
