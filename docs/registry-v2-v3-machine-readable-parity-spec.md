# SOG Registry v2/v3 machine-readable parity specification

Status: canonical specification  
Updated: 2026-07-06  
Roadmap item: Phase B — PR #310

## 1. Purpose

This specification governs the 100-asset Registry v2/v3 parity phase and the additive exposure of reviewed Registry v3 coverage through SOG's machine-readable public layer.

PR #310 must preserve the existing Registry v2 public contract while closing the deferred Registry v3 manifest and runtime-loader coverage gap at the reviewed 100-asset checkpoint.

The broader count, version, manifest, provenance, and public-schema transition audit remains PR #311 work.

## 2. Canonical parity boundary

At the PR #310 checkpoint, the approved Registry v3 additive boundary is:

```text
protected stable assets: 100
legal profiles: 100
stable-asset relationships: 4
reserve components: 133
income profiles: 100
deployment view rows: 140
```

Required coverage:

```text
legal profile coverage: every protected stable asset
income profile coverage: every protected stable asset
reserve-component asset coverage: every protected stable asset
```

Structural reserve-component coverage does not imply that every asset has a conventional issuer-owned reserve or a disclosed percentage allocation.

## 3. Manifest and loader parity

The canonical Registry v3 manifests are:

```text
docs/migration/registry-v3-foundation.json
docs/migration/registry-v3-income-profiles.json
docs/migration/registry-v3-view-67.json
docs/migration/registry-v3-migration-audit.json
```

The canonical runtime loaders are:

```text
src/lib/data/registryV3.ts
src/lib/data/incomeProfilesV3.ts
```

Every file declared by the Registry v3 foundation or income-profile manifests must be consumed by the corresponding runtime loader.

The Q-T growth-layer deferrals may be closed only when their reviewed supplemental v3 files are represented in both the canonical manifests and runtime loaders and the parity validator confirms full 100-asset coverage.

## 4. Machine-readable publication contract

PR #310 uses an additive compatibility model.

The existing base public data schema remains:

```text
sog_registry_v2
```

The reviewed Registry v3 layer is exposed as an additive summary at:

```text
version.data.registry_v3
manifest.registry_v3
```

The Registry v3 summary shape is:

```text
schema_version
mode
base_schema_version
protected_stable_assets
record_counts
coverage
```

The v3 summary must identify:

```text
schema_version: sog_registry_v3
mode: additive
base_schema_version: sog_registry_v2
```

The public manifest supporting-record list must declare:

```text
legal_profile
stable_asset_relationship
reserve_component
income_profile
```

`llms.txt` and `ai.txt` may expose the reviewed v3 summary counts, but they must not imply live market state, complete real-time monitoring, legal conclusions, safety rankings, or investment recommendations.

## 5. Compatibility rule

PR #310 must not silently replace or rename the existing v2 machine-readable contract.

The following are explicitly reserved for PR #311:

```text
full count-contract audit across generated and public surfaces
manifest/version cross-integrity review
checked-in generated-output count review
build-provenance count and hash integrity review
public data-schema transition decision
production provenance parity review
```

An additive v3 summary is allowed before PR #311 because it preserves the existing v2 fields and exposes reviewed v3 coverage without claiming a completed public-contract migration.

## 6. Data safety

Registry v3 machine-readable publication contains reviewed canonical data only.

It must exclude:

```text
unreviewed candidates
internal monitoring output
private review material
editorial research matrices
unpublished monitoring candidates
private notes
```

Monitoring observations and editorial market-access research are not canonical Registry v3 records merely because they are structured JSON.

## 7. Unknown and unresolved values

The parity phase must preserve protected unresolved semantics.

At minimum:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

Parity work must not invent values or collapse unresolved states merely to make Registry v3 coverage appear complete.

Schema normalization is allowed only when an existing record uses a value outside the approved canonical enum and the normalized value preserves the supported meaning. Such normalization must be documented in the PR audit.

## 8. Validation contract

PR #310 must provide a dedicated parity validator that checks at minimum:

```text
100 canonical stable assets
100 unique legal profiles
4 stable-asset relationships
133 reserve components
100 unique income profiles
140 deployment rows
full legal-profile coverage
full income-profile coverage
full reserve-component asset coverage
manifest-to-loader file parity
machine-readable Registry v3 summary presence
manifest supporting-record declaration
exclusion of candidate, monitoring, private, and editorial-research paths
```

The CI sequence must run:

```text
validate:v3
validate:deployments-v3
validate:income-v3
validate:migration-v3
validate:parity
```

A passing build or public-layer check without the dedicated parity validation is not sufficient to complete PR #310.

## 9. Non-goals

PR #310 does not authorize:

```text
canonical asset growth beyond 100
UI redesign
monitoring source expansion
scheduled monitoring changes
canonical market-access records
automatic canonical writes
risk or safety scoring
full public schema replacement
provenance closure reserved for PR #311
```

## 10. Required references

Implementation work under PR #310 must read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/quality/non-ui-quality-program.md
docs/data-model-v3-spec.md
docs/registry-v2-v3-machine-readable-parity-spec.md
docs/migration/registry-v3-foundation.json
docs/migration/registry-v3-income-profiles.json
docs/migration/registry-v3-view-67.json
docs/migration/registry-v3-migration-audit.json
docs/audits/registry-v2-v3-machine-readable-parity-100-assets.md
```
