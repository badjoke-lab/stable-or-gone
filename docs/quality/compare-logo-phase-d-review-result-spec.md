# Compare / Stablecoin Logo Maintenance — Phase D Reviewed Result

Status: binding after merge  
Date: 2026-08-12  
Parent authority: `config/compare-logo-maintenance-authority.json`  
Preceding reviewed result: `config/compare-phase-c-implementation-result.json`

## Result

Phase D consumes the exact logo-import and permanent-growth-gate authority opened by the reviewed Phase C result.

Accepted public display state after merge:

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119
Direct Stablecoin/product logos: 101
Neutral monogram fallbacks: 18
Canonical delta: 0
```

Exactly three previously neutral records are promoted:

```text
mnee
usdgo
usr
```

No other Phase B fallback is promoted. The remaining 18 reviewed fallbacks stay neutral.

## Imported marks

### MNEE

- mark type: `official_product_mark`
- local path: `/stablecoin-logos/mnee.svg`
- first-party page: `https://www.mnee.io/`
- first-party asset: `https://www.mnee.io/mnee.svg`
- SHA-256: `ddee8994d9b3ac38835ed5f99d01a6f029cc8a997c9096d2b9ee4f9e49808911`
- transformation: none; vendored without artwork changes

The official product page explicitly labels the linked asset as `MNEE Logo`.

### USDGO

- mark type: `official_product_mark`
- local path: `/stablecoin-logos/usdgo.svg`
- first-party page: `https://www.usdgo.com/`
- first-party asset form: compact inline SVG used as the site header logo
- SHA-256: `e75fc78d2b70dd3da4725aed2b1ed3e4f6201c7299a22f737154557b92ce4a84`
- transformation: extracted inline SVG without artwork changes

Phase D direct inspection rejected the Phase B Anchorage image as an explanatory product illustration rather than a compact mark. That image is not imported. The corrected asset remains within the already-approved `usdgo` slug: the current first-party USDGO homepage header mark, corroborated by the same visual identity in OSL official USDGO listing artwork. This correction does not expand the Phase B allow-list.

### USR

- mark type: `token_logo`
- local path: `/stablecoin-logos/usr.png`
- first-party page: `https://resolv.xyz/brand-kit`
- first-party asset: dedicated USR image in the official Brand Kit
- SHA-256: `56279ebd60697a49d0c8fa62179a40eb7ba07b26d756729645d331de2addbf16`
- transformation: none; vendored without artwork changes

The Resolv Brand Kit exposes USR separately from RLP, stUSR, wstUSR, RESOLV, and stRESOLV.

## Rights / provenance rule

The three first-party marks are vendored for identification without artwork modification. Review did not establish a separate open redistribution license for these three assets. Do not relabel them as CC0/MIT/open-source artwork; underlying rights remain with their owners.

## Superseded research artwork

The old issuer/project-level files are removed once the product/token-specific replacements are accepted:

```text
/stablecoin-logos/usdgo.png
/stablecoin-logos/usr.svg
```

They must not remain as orphan public logo assets or be restored as display mappings.

## Permanent canonical-growth gate

Phase D closes the workflow hole identified by the parent authority. Core `.github/workflows/ci.yml` must run:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request, without data-path exclusions.

The blocking audit must require:

```text
reviewed logo decision count == canonical Stablecoin count
every canonical Stablecoin slug has exactly one reviewed disposition
direct-logo records resolve to local assets
neutral fallbacks are explicit in display policy
direct resolver set matches reviewed direct-logo set
orphan logo assets are rejected
```

A neutral fallback is a valid future growth outcome. Missing review is not. A data-only stablecoin growth PR cannot bypass this gate.

## Preserved boundaries

Phase D changes public logo presentation and merge validation only. It does not authorize:

- canonical Stablecoin additions or mutation;
- Evidence / Evidence Relation changes;
- Market Access changes;
- archive changes;
- additional logo promotions;
- remote runtime image fetching;
- generated substitute brand artwork;
- Compare-only logo mappings;
- unrelated UI work.

Canonical invariants remain:

```text
Stable assets: 119
Evidence: 585
Evidence Relations: 585
Market Access: 12
Archive recorded: 471
Archive not recorded: 114
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta: 0
```

## Next gate

After this reviewed result merges, **Phase E is next**. Phase E owns changed-state desktop/mobile artifact review, all-record mark validation, exact-main production verification, and closeout restoring a fresh repository `REVIEW_GATE`.

Phase D authorizes no automatic continuation beyond that closeout.
