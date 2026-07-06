# SOG Registry v2/v3 and machine-readable parity audit — 100 assets

Audit date: 2026-07-06  
Roadmap item: PR #310  
Status: implementation audit

## Purpose

PR #310 closes the deferred Registry v3 coverage gap that remained after Growth A-D reached the 100-asset canonical checkpoint.

The audit verifies one bounded question:

```text
Does the reviewed 100-asset Registry v2 canonical set have a matching additive Registry v3 foundation,
runtime loader coverage, deployment view, income-profile coverage, and machine-readable public summary?
```

This PR does not replace the existing v2 public contract. It exposes Registry v3 as an additive reviewed layer. The next roadmap item, PR #311, remains responsible for the broader counts, manifest, version, and provenance integrity audit.

## Starting state

Before PR #310:

```text
Registry v2 canonical stable assets: 100
Registry v3 legal profile manifest minimum: 92
Registry v3 income profile manifest minimum: 92
Registry v3 deployment view minimum: 130
Registry v3 runtime legal loader: through Batch Q only
Registry v3 runtime reserve-component loader: through Batch Q only
Registry v3 runtime income loader: through Batch P only
Batch Q-T v3 full-coverage deferrals: open
```

The Q-T overlays explicitly stated that their supplemental v3 rows would join the full-coverage manifests during the 100-record parity phase.

## Parity result

PR #310 establishes the following reviewed additive boundary:

```text
canonical stable assets: 100
legal profiles: 100
stable-asset relationships: 4
reserve components: 133
income profiles: 100
deployments in v3 view source: 140
```

Coverage requirements:

```text
legal profile coverage: every canonical stable asset
income profile coverage: every canonical stable asset
reserve-component asset coverage: every canonical stable asset
```

Reserve-component coverage is structural coverage, not a claim that every asset has a conventional issuer reserve. Protocol and non-conventional designs retain evidence-backed component context without fabricated allocation percentages.

## Manifest and runtime alignment

The following manifests now include the Q-T supplemental layers:

```text
docs/migration/registry-v3-foundation.json
docs/migration/registry-v3-income-profiles.json
docs/migration/registry-v3-view-67.json
docs/migration/registry-v3-migration-audit.json
```

The runtime loaders now consume the same file boundary:

```text
src/lib/data/registryV3.ts
src/lib/data/incomeProfilesV3.ts
```

The parity validator requires every canonical manifest basename to appear in the corresponding runtime loader.

## Batch Q-T deferral closure

The following overlays no longer defer legacy v3 full coverage:

```text
docs/migration/registry-v2-baseline-batch-q.json
docs/migration/registry-v2-baseline-batch-r.json
docs/migration/registry-v2-baseline-batch-s.json
docs/migration/registry-v2-baseline-batch-t.json
```

Closing these deferrals also allows the canonical baseline loader to include the Q-T assets in the protected stable-asset set. The resulting protected set is 100 assets.

Historical Growth A-C validators were updated only where they previously required the deferral flag to remain open or expected the earlier intermediate total. Their asset identity, event, evidence, deployment, and promotion checks remain in place.

## Batch R legal-profile normalization

Full v3 validation exposed three values in `data/r-legal.json` that were not members of the canonical Registry v3 enums:

```text
protocol_collateral_release_right
protocol_and_market_right
onchain_positions
```

The parity phase does not introduce one-off enum values. The two records were normalized to existing canonical categories while preserving their evidence and explanatory notes:

```text
Kava USDX
  holder_claim_type: protocol_redemption_right
  reserve_segregation: operationally_separate

Bean
  holder_claim_type: no_direct_claim
  reserve_ownership: protocol_controlled
  reserve_segregation: not_applicable
```

The Bean note explicitly preserves that the asset has no conventional reserve ownership structure. The canonical category describes protocol-managed stabilization mechanics and must not be read as a claim of conventional reserve assets.

No lifecycle status, launch date, organization identity, event, evidence relation, deployment identity, or promotion decision is changed by this normalization.

## Machine-readable publication model

PR #310 keeps the existing public v2 contract compatible and adds an additive Registry v3 summary.

The public layer exposes:

```text
version.data.registry_v3
manifest.registry_v3
```

The additive v3 summary includes:

```text
schema_version
mode
base_schema_version
protected_stable_assets
record_counts
coverage
```

The manifest supporting-record list now also declares:

```text
legal_profile
stable_asset_relationship
reserve_component
income_profile
```

`llms.txt` and `ai.txt` expose the reviewed v3 summary counts.

This PR deliberately does not claim that the whole public contract has switched from `sog_registry_v2` to `sog_registry_v3`. That broader version/count/provenance transition remains part of PR #311.

## Safety boundary

Registry v3 public manifests contain reviewed canonical data files only.

They exclude:

```text
candidate data
private monitoring output
private review material
editorial research matrices
unpublished monitoring candidates
```

Monitoring observation records and editorial market-access research remain outside the canonical Registry v3 layer.

## Validation

PR #310 adds:

```text
scripts/validate-registry-v2-v3-machine-readable-parity.mjs
npm run validate:parity
```

CI also runs:

```text
npm run validate:v3
npm run validate:deployments-v3
npm run validate:income-v3
npm run validate:migration-v3
npm run validate:parity
```

The parity validator independently checks:

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

## Explicit non-goals reserved for PR #311

PR #310 does not close the next roadmap item.

Reserved for PR #311:

```text
full count-contract audit across generated and public surfaces
manifest/version cross-integrity review
checked-in generated-output count review
build provenance count and hash integrity review
public version schema transition decision
production provenance parity review
```

PR #310 provides the canonical v3 data and runtime boundary that PR #311 can audit.
