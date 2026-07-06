# Registry v2/v3 and machine-readable parity specification

Status: canonical implementation plan — active  
Updated: 2026-07-06  
Roadmap item: PR #310

## Purpose

PR #310 audits and repairs parity between the current 100-asset Registry v2 compatibility layer, additive Registry v3 layers, runtime composed loaders, protected baseline manifests, generated count/audit artifacts, and public machine-readable metadata.

The goal is not to remove Registry v2 compatibility. Registry v3 remains additive and backward-compatible. The goal is to prevent stale historical artifacts from validating each other while the runtime registry has moved to a later canonical checkpoint.

## Required parity surfaces

The audit must compare:

```text
current composed Registry v2 baseline
Registry v3 foundation manifests
Registry v3 runtime loaders
Registry v3 coverage by canonical asset ID
Registry v3 deployment view
protected Registry v3 baseline metadata
registry stats artifact
registry integrity audit artifact
/version.json runtime metadata source
/data/manifest.json runtime metadata source
public record count breakdown
machine-readable data model declaration
```

## Canonical checkpoint

The current canonical registry checkpoint is the 100-asset baseline composed through the current Registry v2 overlay chain.

PR #310 must derive current counts and IDs from repository loaders or composed manifests. It must not copy stale 92-record values merely because an older Registry v3 baseline and its generated artifacts agree with each other.

## Required checks

### V2 compatibility parity

Verify that the composed Registry v2 baseline and runtime Registry v2 loaders agree for all public canonical record groups used by the current site and public metadata.

At minimum:

```text
stablecoins
organizations
relationships
classifications
profiles
events
event_details
evidence
evidence_relations
reserve_reports
known_unknowns
regulatory_notes
deployments
```

### V3 additive coverage parity

Verify current canonical asset coverage for:

```text
legal_profiles
income_profiles
deployment canonicality view
```

Verify reference integrity for:

```text
stable_asset_relationships
reserve_components
```

Reserve components remain optional and time-scoped; parity does not require one component row per asset. Stable-asset relationships remain applicability-based rather than universal.

### Loader-manifest parity

Every Registry v3 file consumed by the runtime loader must be represented by the active Registry v3 foundation manifest or another explicitly referenced canonical manifest.

Every manifest-listed Registry v3 file must be consumed by the appropriate runtime loader unless it is explicitly historical and excluded from current runtime composition.

The audit must identify missing-loader, missing-manifest, duplicate-file, duplicate-ID, orphan-reference, and missing-required-asset-coverage findings.

### Baseline freshness

A protected baseline may be historical, but a validator must not present stale artifact self-consistency as current 100-record parity.

PR #310 must either:

1. advance the Registry v3 baseline and its governed artifacts to the 100-record checkpoint; or
2. explicitly classify the old baseline as historical and add a current parity baseline/audit that validates against current runtime composition.

The chosen implementation must preserve reproducibility and make the current checkpoint unambiguous.

### Machine-readable parity

`/version.json` and `/data/manifest.json` are runtime-derived public metadata surfaces. Verify that:

```text
primary record count matches current canonical stablecoin count
public events count matches runtime event count
public evidence count matches runtime evidence count
record_count_breakdown matches current runtime loaders
public data_safety remains canonical_only=true
unreviewed candidates remain excluded
internal monitoring remains excluded
private notes remain excluded
```

The machine-readable schema may remain backward-compatible with Registry v2 naming where the public contract intentionally does so. PR #310 must not rename the public schema to Registry v3 merely because additive v3 layers exist.

If reviewed Registry v3 record groups are omitted from the public data-model declaration, the audit must classify that omission as either:

```text
intentional compatibility boundary
or
machine-readable declaration gap
```

and record the decision explicitly.

## Compatibility boundary

Registry v3 remains additive and backward-compatible.

PR #310 must not:

```text
change canonical IDs
change slugs or public routes
remove legacy Registry v2 fields
merge historical identities
turn deployments or wrappers into new canonical assets without scope review
publish candidate or monitoring data
change public enum semantics without specification amendment
```

## Data safety

Machine-readable public output remains reviewed canonical data only.

```text
canonical_only: true
includes_unreviewed_candidates: false
includes_internal_monitoring: false
includes_private_notes: false
```

## Required artifacts

PR #310 must produce:

```text
data/generated/registry-v2-v3-machine-readable-parity-audit.json
docs/audits/registry-v2-v3-machine-readable-parity-2026-07-06.md
scripts/audit-registry-v2-v3-machine-readable-parity.mjs
scripts/validate-registry-v2-v3-machine-readable-parity.mjs
```

The generated JSON is audit output. The Markdown audit records the reviewed conclusion and any repaired gaps.

## Merge gate

PR #310 may merge only when:

```text
current 100-asset V2 runtime parity passes
required V3 asset coverage passes or explicit reviewed gaps are repaired
V3 loader-manifest parity passes
reference integrity passes
stale-baseline ambiguity is removed
machine-readable count parity passes
machine-readable safety boundary passes
exact-head repository CI passes
```

## Next item

After PR #310:

```text
PR #311 counts, manifest, version, and provenance integrity
```

PR #311 remains a separate hardening pass over count/provenance contracts after PR #310 establishes structural parity.