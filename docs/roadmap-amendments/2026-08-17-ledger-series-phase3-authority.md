# Ledger Series Phase 3 — SOG Lifecycle Strengthening Authority

Status: active after merge  
Date: 2026-08-17  
Authority: `config/ledger-series-phase3-authority.json`

## Purpose

Activate the Stable or Gone lane in the Ledger Series strengthening schedule after the previous SEO / GA4 migration lane has closed to `REVIEW_GATE`.

This lane does not reset SOG. It audits what already exists and implements only verified gaps required by the merged AI-era specification and execution schedule.

## Required outcome

SOG must support the evidence-backed lifecycle:

```text
launch
-> stress / depeg / regulatory action
-> issuer or protocol intervention
-> redemption / recovery / compensation
-> migration / discontinuation
-> current / final state
```

The public product must make those states deterministically searchable, comparable and machine-readable when the reviewed canonical data actually supports them.

## Sequence

1. Audit representative assets and current public/data surfaces.
2. Classify each required capability as implemented / partial / missing / not required.
3. Stop for a separate reviewed authority if schema or canonical mutation is necessary.
4. Add deterministic per-asset JSON if missing.
5. Close supported structured-filter gaps.
6. Close supported Compare lifecycle/outcome gaps without replacing the existing Compare product.
7. Close Stats gaps for depeg/recovery/regulation/migration and quality/coverage.
8. Run exact-main production verification for material public changes.
9. Synchronize documentation and restore `REVIEW_GATE` at Phase 3 closeout.

## Canonical boundary

This authority starts with zero canonical delta:

```text
Stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Deployments: 186
Market Access Records: 12
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized: 0
Schema/taxonomy change authorized: no
```

If the audit finds a real lifecycle representation gap that cannot be expressed through the current canonical model, implementation stops at a decision gate. A separately reviewed authority is required before schema or canonical mutation.

## Public boundary

Authorized:

- deterministic per-asset machine-readable JSON derived from reviewed canonical data;
- existing structured search/filter extension using existing semantics;
- existing Compare extension using existing canonical lifecycle/outcome fields;
- existing Stats extension using deterministic aggregates;
- validation, regression and exact-main production verification needed for those surfaces.

Not authorized:

- unrelated HTML route families;
- unrelated UI/CSS redesign;
- ranking, scoring or recommendations;
- AI-generated canonical classifications;
- chatbot/prompt-button product surfaces;
- DNS/Cloudflare account mutation;
- new GA4 identity;
- canonical/archive/Market Access mutation without separate authority.

## Enduring regression contracts

The accepted Compare behavior remains binding, including:

- 2–4 selection;
- fifth-selection rejection;
- URL order/history restoration;
- explicit `Unknown` / `Not recorded` states;
- `Hide matching rows` feedback and counts;
- StablecoinMark reuse;
- bounded mobile matrix scrolling.

The official public origin remains `https://www.stableorgone.com`. The legacy migration host remains `https://sog.badjoke-lab.com` with its existing path/query-preserving 301 contract.

## Acceptance

The lane is not complete when code merely exists. Each material stage must follow:

```text
spec / reviewed authority
-> PR
-> CI and validation green
-> merge
-> exact-main production verification where applicable
-> documentation/status synchronization
```

Phase 3 closes only after the deterministic lifecycle/search/Compare/Stats/machine-readable requirements are either implemented or explicitly recorded as already satisfied/not required, with production verification for all material public changes.
