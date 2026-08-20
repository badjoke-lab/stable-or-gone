# Ledger Series Phase 9 — SOG Series adapter authority

Status: reviewed authority after merge  
Date: 2026-08-20  
Entry main: `269f2ef82c5d21d71b35286f00e30ffbc552c268`

## Why this authority exists

SOG is currently at `REVIEW_GATE`. The completed SOG-local Ledger Series Phase 3 machine/search/Compare/Stats work is an enduring regression contract, not standing permission for new public machine routes.

The cross-registry Ledger Series program has now reached **global Phase 9**, coordinated in `badjoke-lab/historical-exchange-index` Issue #780. Global Phase 9 is distinct from the completed SOG-local Phase 3 lane. It standardizes a small lossless machine-readable envelope across the Ledger Series without replacing each registry's native schema.

This authority therefore permits one bounded SOG task only: expose the frozen Series v1 adapter over the existing reviewed SOG per-stablecoin dossiers.

## Current reviewed boundary

At entry:

```text
Stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Official public origin: https://www.stableorgone.com
Legacy migration origin: https://sog.badjoke-lab.com
Canonical delta authorized: 0
Schema/taxonomy delta authorized: 0
```

Open PR #577 is a separate OCC / GENIUS Act review authority. It does not authorize, implement, or overlap the Series adapter runtime.

## Existing machine contract to reuse

SOG already exposes:

- `/data/manifest.json`
- `/data/stablecoin/{slug}.json` for all 119 reviewed stablecoins
- `/data/comparison.json`
- `/data/stats.json`
- `/data/access-regulation-index.json`
- `/data/change-timeline.json`
- build provenance including exact source commit, canonical hash, canonical file count, route counts and verification markers

Each stablecoin dossier already carries the canonical stablecoin record plus related organizations, organization relationships, events, evidence, evidence relations, reserve reports, known unknowns, regulatory notes, deployments, legal profile, stable-asset relationships, reserve components and income profile.

The Series adapter must therefore be a **projection**, not a second canonical data model.

## Authorized public machine additions

Only the following new route family is authorized:

```text
/data/series/registry.json
/data/series/index.json
/data/series/records/{slug}.json
```

The adapter must expose exactly one Series record envelope for each existing reviewed stablecoin dossier: **119 envelopes at the entry boundary**.

Global keys:

```text
stable-or-gone:stablecoin:<native-id>
```

The official Series origin is only:

```text
https://www.stableorgone.com
```

The legacy `sog.badjoke-lab.com` host remains migration-only and must not appear as a Series canonical origin.

## Mapping boundary

The native SOG dossier remains authoritative.

- identity comes from the native stablecoin record;
- current state uses native lifecycle/issuance and related canonical fields without inventing a new classification;
- native dossier material may remain under a native/current-state payload to avoid information loss;
- events/evidence/provenance are reused from the native dossier;
- build commit, canonical hash, canonical file count and verification metadata are preserved when available;
- `stable_asset_relationships` and other native relationship records are preserved as native facts;
- **no typed cross-registry Series relationship is promoted during Stage 3**. Typed relationship review belongs to global Phase 9 Stage 5.

Unknown or not-recorded values stay unknown. The adapter must not infer absence, risk, recovery, replacement, successor, issuer identity, regulatory status or lifecycle outcome.

## Explicit non-scope

This authority does not permit:

- canonical JSON mutation;
- schema/taxonomy change;
- archive or Market Access mutation;
- stablecoin addition/deletion;
- new Evidence identities or Evidence Relations;
- search/filter expansion;
- Compare expansion;
- Stats expansion;
- new HTML/UI route family;
- CSS redesign;
- ranking, scoring or recommendations;
- natural-language/chatbot product changes;
- DNS/Cloudflare account mutation;
- GA4 identity creation/change;
- typed Series relationship inference during Stage 3.

## Required implementation order

1. Merge this authority while the repository is still at `REVIEW_GATE`.
2. Re-read exact main and confirm the native 119-dossier/build-provenance contract.
3. Implement the Series descriptor/index/per-stablecoin envelopes from the existing native machine layer.
4. Add deterministic fail-close validation.
5. Run the existing SOG integrity, reproducible-build and Phase 3 regression gates on the exact implementation head.
6. Merge only after those gates are green.
7. Verify exact merged main on `https://www.stableorgone.com`, including the complete Series index and all 119 envelopes.
8. Record deployment evidence in Issue #479 and cross-registry acceptance in HEI Issue #780.
9. Close this bounded authority and restore SOG to `REVIEW_GATE`; do not automatically continue into another SOG feature.

## Acceptance

The task is accepted only if:

- canonical counts/hash/file count stay unchanged;
- native SOG machine dossiers remain unchanged in semantics;
- Series output is deterministic and canonical-only;
- descriptor/index and exactly 119 record envelopes validate;
- no typed Series relationship is invented;
- existing Phase 3 machine/search/filter/Compare/Stats contracts remain green;
- official-origin and legacy migration contracts remain green;
- exact-main production Series verification succeeds.

Machine adapter completion is not permission for global Phase 9 Stage 4/5 work inside SOG. Those remain coordinated separately after all eight Stage 3 adapters are accepted.
