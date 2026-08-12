# Roadmap Amendment — Compare / Stablecoin Logo Phase B Review Result

Updated: 2026-08-12  
Status: Phase B reviewed result; effective after merge

## Parent authority

This amendment does not create a new workstream. It advances the bounded maintenance lane authorized by:

- `config/compare-logo-maintenance-authority.json`
- `docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md`

## Phase B result

All 21 baseline neutral fallbacks were re-audited under the asset-specific mark and local-provenance rules.

```text
reviewed: 21 / 21
direct_logo: 3
neutral_fallback: 18
approved direct-logo slugs: mnee, usdgo, usr
public display changes in Phase B: 0
canonical delta: 0
```

Machine-readable result:

`data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json`

Quality result:

`docs/quality/compare-logo-fallback-reaudit-review-result-spec.md`

## Updated schedule

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  21-fallback fresh re-audit — complete after this review-result merge
Phase C  Compare matching-row feedback + Compare Stablecoin marks — next
Phase D  import only mnee/usdgo/usr + permanent future growth logo gate — waits for Phase C review
Phase E  direct desktop/mobile artifact review + all-record mark validation + production verification + closeout — waits for Phase D
closeout  restore repository REVIEW_GATE; no automatic continuation
```

## Phase C entry contract

Phase C may modify the `/stablecoins/` comparison implementation and its dedicated tests/styles only as required to satisfy the parent authority.

Required behavior remains:

```text
preferred control label: Hide matching rows
hide only rows whose normalized displayed value matches across all selected records
show differing attribute count
show matching-hidden count when enabled
explicitly report when there are no matching rows to hide
disabling restores the full comparison
```

Compare headers must use the same audited Stablecoin mark result already used by the register/dossiers: direct local product/token mark where available, otherwise the neutral monogram fallback. No independent Compare-only mapping and no remote runtime fetch are allowed.

Phase C must include deterministic blocking tests for both a row-reduction case and an all-different no-op case and must preserve shared URL restoration, Unknown / Not recorded semantics, selection limits, bounded matrix scroll, and dock/footer behavior.

## Phase D entry contract

Phase D cannot begin from this amendment alone until Phase C has its own reviewed implementation result.

When Phase D becomes eligible, the only logo promotions authorized from Phase B are:

```text
mnee
usdgo
usr
```

The other 18 baseline fallbacks must remain neutral unless a later separately reviewed evidence change reopens them.

Phase D must also make the permanent new-record logo disposition gate blocking in core validation, synchronize display-policy/README counts, and eliminate the data-path trigger gap that allowed earlier record growth to bypass logo coverage validation.

## Canonical invariants

```text
Stable assets: 119
Evidence: 585
Evidence Relations: 585
Market Access Records: 12
Archive recorded: 471
Archive not recorded: 114
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized by maintenance lane: 0
```

## No automatic continuation

Schedule order is binding. This review result allows the next bounded Phase C only; it does not authorize Phase D or Phase E to be collapsed into the same implementation PR.
