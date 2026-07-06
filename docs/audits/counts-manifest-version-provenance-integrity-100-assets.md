# Counts, manifest, version, and provenance integrity audit — 100 assets

Status: supporting audit  
Date: 2026-07-06  
Roadmap item: PR #316

## Scope

This audit reviews the release-integrity boundary after Registry v2/v3 machine-readable parity was completed.

Reviewed surfaces:

```text
composed Registry v2 counts
additive Registry v3 counts
version.json source contract
data/manifest.json source contract
shared machine-readable count getters
checked-in build-provenance sentinel
generated provenance wiring
expected detail-route counts
CI placement
```

## Finding 1 — public build output was already dynamically verified

The existing build pipeline regenerates provenance before Astro build and existing output verification compares:

- generated provenance;
- version build metadata;
- manifest build metadata;
- public record counts;
- public count breakdowns;
- generated detail routes;
- index links;
- sitemap URLs;
- canonical URLs;
- JSON-LD URLs.

This is retained.

## Finding 2 — source-state release integrity did not have a dedicated baseline

Before PR #316 there was no single source-state contract tying together:

```text
100-asset canonical counts
100-asset additive Registry v3 counts
public primary count paths
public breakdown count paths
route counts
version/manifest shared getter requirements
build-provenance source-template semantics
```

PR #316 adds:

```text
docs/migration/registry-release-integrity-baseline.json
scripts/validate-counts-manifest-version-provenance-integrity.mjs
```

## Finding 3 — checked-in provenance sentinel was stale

The checked-in `data/generated/build-provenance.json` still contained the older 92-asset checkpoint values:

```text
stablecoins: 92
organizations: 86
events: 150
```

The current reviewed checkpoint is:

```text
stablecoins: 100
organizations: 94
relationships: 110
events: 172
evidence: 502
evidence_relations: 502
reserve_reports: 108
known_unknowns: 289
deployments: 140
```

The source file is intentionally a sentinel until build time, so these sentinel markers remain:

```text
source_commit: unknown
generated_at: 1970-01-01T00:00:00.000Z
canonical_data_hash: sha256:000...000
canonical_file_count: 0
```

However, the sentinel now carries current reviewed canonical counts and route counts instead of stale 92-asset values.

## Finding 4 — version and manifest share count getters

The source contract remains:

```text
version.json
  data.record_counts
  data.record_count_breakdown
  data.registry_v3

manifest.json
  record_counts
  record_count_breakdown
  registry_v3
```

Both endpoint implementations use shared getters from `src/lib/machine-readable.ts`:

```text
getBuildMetadata()
getRecordCounts()
getRecordCountBreakdown()
getRegistryV3Summary()
```

PR #316 adds source-level checks to prevent independent hard-coded count tables from silently replacing those getters.

## Finding 5 — reviewed route checkpoint

The 100-record route checkpoint is:

```text
stablecoin detail routes: 100
organization detail routes: 94
event detail routes: 172
total detail routes: 366
declared main routes: 13
```

The source validator checks arithmetic and provenance-template route counts. Existing build verification remains responsible for checking actual generated output.

## Reviewed count checkpoint

### Registry v2

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

### Additive Registry v3

```text
legal_profiles: 100
stable_asset_relationships: 4
reserve_components: 133
income_profiles: 100
deployment_view: 140
```

## Boundaries preserved

PR #316 does not:

- add or remove canonical assets;
- change lifecycle or redemption semantics;
- change the Registry v2 public schema identity;
- remove additive Registry v3 metadata;
- add monitoring sources;
- schedule monitoring;
- add stats outputs;
- create canonical market-access records;
- edit the EU/EEA guide;
- change the UI.

## Validation contract

Source-state validation:

```text
npm run validate:release-integrity
```

Existing build-state validation remains:

```text
npm run verify:provenance
npm run verify:output-parity
npm run verify:public
```

## Conclusion

The release-integrity boundary is now explicit at both source state and built output state.

The main defect found in PR #316 was not a public-build count mismatch. It was a stale checked-in provenance sentinel and the absence of a single source-state contract tying counts, public machine-readable paths, route counts, and provenance semantics to the reviewed 100-asset checkpoint.
