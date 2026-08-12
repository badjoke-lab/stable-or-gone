# 2026-08-12 — Compare / Stablecoin Logo Maintenance Phase D Reviewed Result

Status: binding after merge

## Authority lineage

```text
PR #554  Phase A — parent Compare/logo maintenance authority
PR #555  Phase B — exact 21-fallback re-audit
PR #556  Phase C — Compare matching-row feedback and mark display
current  Phase D — approved logo import and permanent future-growth gate
```

Phase D starts from main commit:

```text
c24b9ea9f98573a949c91bd512ef1413311226c6
```

and preserves the canonical registry unchanged.

## Accepted Phase D result

```text
Canonical Stablecoins: 119
Reviewed dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Canonical delta: 0
```

Exactly these three reviewed records change public disposition:

```text
mnee   neutral fallback -> official product mark
usdgo  issuer fallback -> official product mark
usr    project fallback -> dedicated token logo
```

The remaining 18 Phase B fallbacks remain neutral.

## Asset review correction

The Phase B USDGO result identified an Anchorage Digital image labelled for USDGO. Phase D inspected the actual image before import and found that it was an explanatory product illustration, not a compact Stablecoin mark. It is therefore rejected as a display logo.

The `usdgo` allow-list entry remains valid, but the imported asset is corrected to the compact inline SVG used as the header logo on the current first-party `usdgo.com` homepage. The same visual identity is visible in OSL official USDGO listing artwork.

This is a source-artifact correction within the already-approved slug. It is not a fourth promotion and does not expand Phase B authority.

## Permanent growth gate

The earlier operating weakness is closed in Phase D:

```text
.github/workflows/ci.yml
  -> node scripts/audit-stablecoin-logo-coverage.mjs
```

Core CI runs on every pull request. A future canonical stablecoin addition therefore cannot bypass logo disposition review merely because the PR is data-only.

Blocking invariants include:

- reviewed decision count equals canonical stablecoin count;
- every canonical slug has exactly one disposition;
- direct marks resolve to local assets;
- neutral fallbacks are explicitly listed;
- resolver/direct sets remain synchronized;
- orphan logo assets are rejected.

## Updated schedule

```text
2026-08-12  Phase A — authority/specification/schedule merge — complete in PR #554
2026-08-12  Phase B — exact 21-fallback reviewed result — complete in PR #555
2026-08-12  Phase C — Compare feedback + Compare Stablecoin marks — complete in PR #556
2026-08-12  Phase D — import mnee/usdgo/usr + permanent growth gate — complete after current merge
next        Phase E — direct changed-state artifact review + all-record mark validation + exact-main production verification + closeout
closeout    restore repository REVIEW_GATE; no automatic continuation
```

Phase E may not introduce a fourth logo promotion, canonical growth, archive work, Market Access work, Guide work, or unrelated UI work under this lineage.

## Phase E acceptance target

Phase E must directly verify the merged Phase D state rather than infer acceptance from PR checks alone.

Required evidence:

```text
MNEE direct mark — desktop and mobile
USDGO direct mark — desktop and mobile
USR direct mark — desktop and mobile
one or more preserved neutral fallbacks — desktop and mobile
all-record Stablecoin mark catalog — 119 / 119
public display partition — 101 direct / 18 fallback
no orphan logo files
no page-level overflow / clipping regression
exact-main production deployment and official-origin verification
canonical hash/file count unchanged
```

Only after those checks may the lane close and a fresh `REVIEW_GATE` be restored.
