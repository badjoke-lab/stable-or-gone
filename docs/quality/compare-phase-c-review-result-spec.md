# Compare Phase C review-result specification

Status: completes after the Phase C implementation PR merges.

Parent authority: `config/compare-logo-maintenance-authority.json`

Required predecessor: `data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json`

Machine-readable Phase C result: `config/compare-phase-c-implementation-result.json`

## Scope

Phase C changes only the bounded Compare behavior on `/stablecoins/`.

It implements:

- `Hide matching rows` wording for the existing matching-row filter;
- a differing-attribute count whenever two or more records are compared;
- a matching-attribute count shown while the filter is off;
- a matching-hidden count while the filter is on;
- explicit no-op feedback when every aligned attribute already differs: `All displayed attributes already differ. Nothing to hide.`;
- Compare record-header marks by cloning the existing pre-rendered `StablecoinMark` output used by the public Stablecoin surfaces.

The mark implementation must not create a Compare-only logo map or fetch remote images at runtime.

## Browser acceptance

`Stablecoin compare matrix visual acceptance` is the Phase C browser authority. Its Phase C audit must prove all of the following on the exact reviewed head:

1. a deterministic selection containing matching rows loses exactly those rows when `Hide matching rows` is enabled;
2. the same selection restores the full aligned row set when the control is disabled;
3. a deterministic all-different selection keeps the same row count and visibly reports `Nothing to hide`;
4. Compare headers preserve both a direct-logo mark and a neutral-fallback mark on desktop;
5. the same direct/fallback semantics remain present on mobile;
6. the mobile comparison matrix remains bounded and horizontally scrollable.

The Phase C audit emits:

- `artifacts/screenshots/compare-phase-c/compare-phase-c-audit.json`
- `artifacts/screenshots/compare-phase-c/compare-desktop-direct-fallback.png`
- `artifacts/screenshots/compare-phase-c/compare-mobile-direct-fallback.png`

Existing Compare audits for 2–4 selections, zero-selection state, URL/navigation behavior, replacement, and matrix geometry remain part of the same workflow and must continue to pass.

## Logo boundary

Phase C does not import new logo assets and does not modify the current public logo display partition:

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
```

The Phase B allow-list remains exactly:

```text
mnee
usdgo
usr
```

Those assets remain blocked until Phase D. If all three later pass Phase D import/provenance validation, the expected partition becomes `101 direct / 18 fallback`.

## Canonical boundary

Phase C authorizes no canonical mutation:

```text
Stable assets: 119
Evidence: 585
Evidence Relations: 585
Market Access Records: 12
Archive recorded / not recorded: 471 / 114
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta: 0
```

## Phase gate after merge

After Phase C is merged and exact-head/browser validation succeeds:

```text
Phase D — NEXT
  import only mnee / usdgo / usr if their reviewed source/provenance requirements remain satisfied
  implement the permanent future-record logo disposition / blocking coverage gate
Phase E — BLOCKED until Phase D closes
closeout — restore REVIEW_GATE; no automatic continuation
```

Phase D must cite both this Phase C result and the Phase B reviewed result. It must not reopen the other 18 fallback decisions without a separately reviewed evidence change.
