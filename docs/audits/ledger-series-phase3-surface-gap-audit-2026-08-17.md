# Ledger Series Phase 3 — SOG Surface Gap Audit

Status: reviewed implementation audit  
Date: 2026-08-17  
Authority: `config/ledger-series-phase3-authority.json`  
Audited main: `49e79014c91eaa498784dd1885772844d58ddde1`

## 1. Purpose

Determine what Stable or Gone already implements for Ledger Series Phase 3 and identify only the real deterministic public-surface gaps. This audit does not authorize canonical or schema mutation.

Target lifecycle:

```text
launch
-> stress / depeg / regulatory action
-> issuer or protocol intervention
-> redemption / recovery / compensation
-> migration / discontinuation
-> current / final state
```

Classification used below:

- `implemented` — current reviewed implementation already satisfies the Phase 3 requirement;
- `partial` — current implementation has the underlying semantics and part of the public surface, but the Phase 3 question is not directly queryable/comparable/analyzable enough;
- `missing` — no current public surface exists for the requirement;
- `not_required` — no additional implementation is justified.

## 2. Canonical model decision gate

### Result: no schema or canonical mutation required for the public-surface stages

The current schema already represents the Phase 3 lifecycle semantics needed for deterministic public projections.

`src/lib/schema/registry-v2.ts` already defines:

- lifecycle states including `restricted`, `suspended`, `winding_down`, `terminated`, `collapsed`, `migrated`, `rebranded` and `unknown`;
- redemption states including `restricted`, `suspended`, `terminated`, `not_applicable` and `unknown`;
- typed event kinds including `depeg`, `regulatory`, `reserve_change`, `redemption_change`, `migration`, `insolvency`, `termination` and `launch`;
- depeg recovery states `recovered`, `partially_recovered`, `not_recovered`, `collapsed`, `unknown`;
- structured `depeg_detail`, `regulatory_detail`, `redemption_change_detail` and `migration_detail` fields.

The legacy event projection also already carries `recovered`, `recovery_date`, `event_status_effect` and `failure_mechanism`.

Therefore the current public-surface work can proceed with `canonical delta = 0` and `schema/taxonomy change = 0`. If a later bounded implementation needs a semantic that is not present above, that work must stop for a separate reviewed authority.

## 3. Representative lifecycle audit

The required lifecycle is not hypothetical; reviewed canonical records already exercise it.

### USDC — recovered depeg

Canonical event `sog_ev_usdc_2023_03_depeg` records:

- `event_type: major_depeg`;
- `recovered: true`;
- `recovery_date: 2023-03-13`;
- `failure_mechanism: reserve_asset_exposure`.

Its typed event detail is `event_detail_kind: depeg` with `recovery_status: recovered`. A separate `redemption_change` event records operational reopening/recovery context.

### UST — collapse and intervention context

Canonical event `sog_ev_ust_2022_05_collapse` records:

- collapse;
- `recovered: false`;
- `failure_mechanism: algorithmic_death_spiral`.

Typed detail records `recovery_status: collapsed`. Additional typed records preserve reserve-intervention, chain-halt/migration and later regulatory context without converting them into a restored-peg conclusion.

### BUSD — regulatory wind-down / migration context

Canonical event `sog_ev_busd_2023_02_wind_down` records issuer wind-down and minting halt while preserving redemption-support context. Typed migration records also preserve exchange phase-out separately from issuer redemption.

### USDT — regulatory actions

Typed events include CFTC order and NYAG settlement records with jurisdiction, authority, action type and effective date.

### DAI — protocol lifecycle migrations

Typed migration records include Multi-Collateral Dai and MakerDAO / Sky lifecycle transition context; these remain separate from reserve-stress event history.

### Representative-record conclusion

The canonical model already distinguishes depeg, recovery, regulatory action, redemption change, intervention/reserve change, migration, collapse and lifecycle state. Phase 3 therefore needs public retrieval and analysis improvements, not a new lifecycle schema.

## 4. Public surface audit

| Capability | Status | Existing implementation | Phase 3 gap |
|---|---|---|---|
| Stablecoin detail pages | implemented | `/stablecoin/[slug]/` already composes canonical record, organizations, lifecycle/context and evidence-oriented data | no parallel detail page required |
| Aggregate machine-readable layer | implemented | `/data/` exposes aggregate entities/events/evidence/relationships/stable-assets/stats/history and related canonical projections | retain |
| Per-asset machine-readable JSON | **missing** | no `/data/stablecoin/[slug].json` or equivalent per-stablecoin JSON route exists in `src/pages/data/` | add deterministic canonical-only dossier route and validation |
| Search | implemented | register search covers name, symbol, slug, aliases, official domain and connected organization names | retain |
| Structured filters | **partial** | six facets exist: Lifecycle, Issuance, Asset class, Reference, Backing, Stabilization | add only event/lifecycle facets supported by canonical event data; do not duplicate existing six |
| Compare | **partial** | mature 19-dimension Compare covers lifecycle, issuance, backing, redemption, legal/regulatory notes, market access, evidence and known unknowns | current comparison projection does not include typed event/depeg/recovery/migration aftermath; extend existing Compare rather than create a second product |
| Stats | **partial** | substantial deterministic Stats covers lifecycle, composition, events by year/type, failure patterns, deployments, organizations, quality and growth | add explicit Phase 3 lifecycle analysis for depeg recovery, regulatory, redemption-change/migration/termination event states where canonical data supports it |
| Unknown-state protection | implemented | Compare/readiness and UI contracts explicitly preserve unknown/not-recorded values | retain; no forced inference |
| Production verification | implemented infrastructure | exact-main deploy/production verification policy already exists | every material Phase 3 public change must use it |

## 5. Structured-filter gap decision

Current `/stablecoins/` filtering already covers:

```text
Lifecycle
Issuance
Asset class
Reference
Backing
Stabilization
```

The register already loads canonical events per asset, so a bounded event-derived extension is possible without canonical mutation.

Phase 3 should add only filters that answer the approved lifecycle questions and have explicit canonical support. Recommended deterministic facet set:

```text
Event lifecycle
  depeg
  regulatory
  redemption change
  migration
  termination / insolvency

Depeg recovery
  recovered
  partially recovered
  not recovered
  collapsed
  unknown
```

Implementation must derive these values only from typed canonical events. Absence of a typed event means `no canonical record`, not proof that the event never occurred.

A separate issuer facet is not required for Phase 3 because organization names are already searchable and issuer filtering is not necessary to close the approved depeg/regulation/recovery lifecycle gap.

## 6. Compare gap decision

The current Compare product is an enduring accepted surface and must not be replaced.

Existing 19 dimensions already cover current-state and structural context, including:

- lifecycle;
- issuance;
- reference target;
- backing/stabilization;
- redemption profile;
- legal classifications;
- regulatory notes;
- market access;
- evidence/known unknowns.

However `build-comparison-projection-pr343.mjs` does not currently project canonical event rows or typed event details. Therefore users cannot directly compare:

- recorded major depeg/recovery state;
- recovery date where recorded;
- failure mechanism where recorded;
- typed regulatory-event history;
- redemption-change history;
- migration/termination history.

Phase 3 should extend the existing comparison projection with one bounded event/lifecycle group. It must preserve all accepted interaction contracts and must not infer a single final score or recommendation.

## 7. Stats gap decision

Current Stats is already a major analytical surface and must not be rebuilt. It already includes:

- lifecycle groups/statuses;
- classification composition;
- events by year and type;
- failed-asset patterns;
- deployment/network context;
- organization roles;
- evidence/coverage/freshness;
- immutable growth checkpoints.

The Phase 3 gap is narrower: the page does not directly summarize typed depeg recovery and the approved post-event lifecycle categories.

A bounded Stats extension should expose deterministic counts/distributions for:

```text
Depeg recovery status
Typed lifecycle-event kind
Regulatory-event coverage
Redemption-change coverage
Migration / termination coverage
```

No new scoring or risk ranking is authorized.

## 8. Machine-readable dossier requirements

The missing per-asset route is the first runtime implementation priority after this audit.

The dossier must:

- be generated from existing reviewed canonical data only;
- use stablecoin slug as the public route identity;
- expose canonical asset identity/current state plus only existing related canonical records;
- include related organizations/relationships, events, evidence/evidence relations, reserve reports, known unknowns, regulatory notes, deployments and existing v3 profile records when available;
- preserve typed event details including depeg recovery/regulatory/redemption-change/migration semantics;
- mark `canonical_only: true` and `includes_unreviewed_candidates: false`;
- expose canonical page/self-data URLs using `https://www.stableorgone.com`;
- preserve unknown/null values rather than synthesize replacements;
- be covered by manifest/discovery/parity/production validation according to existing machine-readable conventions.

The exact envelope/schema must reuse the repository's existing machine-readable conventions; this audit does not invent a second incompatible envelope.

## 9. Implementation order after this audit

```text
Stage 2 decision gate: PASS — no schema/canonical mutation needed
Stage 3: deterministic per-asset JSON
Stage 4: bounded structured-filter extension
Stage 5: existing Compare event/lifecycle extension
Stage 6: existing Stats lifecycle-quality extension
Stage 7: exact-main production verification / representative-record checks
Stage 8: Phase 3 closeout -> REVIEW_GATE
```

Each runtime stage remains independently reviewable and must not silently absorb record-growth work.

## 10. Explicit non-goals

Do not add in this Phase 3 lane:

- canonical stablecoin/event/evidence mutations;
- new schema/taxonomy;
- a new Compare product;
- a replacement Stats page;
- issuer ranking;
- stablecoin safety/risk scores;
- generated recovery percentages;
- inferred compensation outcomes;
- LLM summaries or prompt buttons;
- unrelated UI redesign;
- DNS/Cloudflare account changes.

## 11. Audit conclusion

SOG already contains the core lifecycle semantics and mature registry surfaces. The correct Phase 3 work is **not** to add more individual stablecoin records or redesign the registry. It is to expose existing reviewed lifecycle data more directly and deterministically.

Final classification:

```text
schema/canonical model: IMPLEMENTED — no mutation required
stablecoin detail: IMPLEMENTED
aggregate machine-readable: IMPLEMENTED
per-asset JSON: MISSING
search: IMPLEMENTED
structured filters: PARTIAL
Compare: PARTIAL
Stats: PARTIAL
unknown/provenance safeguards: IMPLEMENTED
production verification infrastructure: IMPLEMENTED
```
