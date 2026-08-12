# Compare / Stablecoin Logo Fallback Re-audit — Phase B Review Result

Updated: 2026-08-12  
Status: reviewed result; Phase B complete after merge

## Authority

This review result is subordinate to and must be read with:

- `config/compare-logo-maintenance-authority.json`
- `docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md`
- `docs/quality/compare-logo-maintenance-spec.md`
- `docs/quality/stablecoin-logo-disposition-operating-spec.md`
- `docs/ui-v3-remediation-authority.md`

Machine-readable review record:

- `data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json`

## Reviewed population

The Phase B population is exactly the 21 neutral fallbacks frozen by the parent authority. No other Stablecoin logo disposition is reopened by this review.

```text
baseline canonical Stablecoins: 119
baseline direct Stablecoin/product logos: 98
baseline neutral fallbacks: 21
reviewed: 21 / 21
```

## Accepted Phase B result

```text
direct_logo: 3
neutral_fallback: 18
approved direct-logo slugs:
  mnee
  usdgo
  usr
```

This is a **review result only**. Public logo mappings, local logo assets, display policy counts, README counts, Compare UI code, and canonical data do not change in Phase B.

If all three approved assets are successfully vendored and validated in Phase D, the expected display partition becomes:

```text
direct Stablecoin/product logos: 101
neutral fallbacks: 18
```

That expected partition is not current public state until Phase D lands successfully.

## Direct-logo findings

### MNEE

The dedicated MNEE homepage directly exposes `https://www.mnee.io/mnee.svg` and labels it as the MNEE logo. This resolves the product-mark gap that remained after PR #498.

Accepted disposition: `direct_logo` / `official_product_mark`.

### USDGO

Anchorage Digital's dedicated USDGO reserve-attestation page identifies the product and separately links an image with alt text `USDGO`; the same page separately labels the OSL corporate logo. The resolved USDGO image is therefore product-specific rather than issuer branding.

Accepted disposition: `direct_logo` / `official_product_mark`.

### USR

Resolv's official Brand Kit exposes separate entries for RLP, USR, stUSR, wstUSR, RESOLV, and stRESOLV. The image directly attached to the USR label is therefore an asset-specific token mark, distinct from the generic Resolv project icon previously retained in research.

Accepted disposition: `direct_logo` / `token_logo`.

## Important non-promotions

### aSEED / Acala

The first-party aSEED documentation says `Find aSEED brand assets here`, but the linked media-kit target resolves to the generic **Acala Brand Assets** package and generic Acala brand guideline. That does not satisfy the asset-specific display rule by itself.

Result: `neutral_fallback`.

### Bison EUB / USB

The current first-party product pages clearly identify both assets, but this review did not recover separately attributable EUB or USB token marks. The Bison Bank issuer identity must not be substituted.

Result: both remain `neutral_fallback`.

### BRZ

Current Transfero material clearly distinguishes BRZ and includes BRZ-labelled imagery, but the review did not pin a stable first-party source asset file under the local provenance contract. The prior Transfero project icon therefore cannot be promoted.

Result: `neutral_fallback`.

### poundtoken

Historical first-party material explicitly labels an image `1GBP logo black`, confirming that product-specific branding existed. However, this review did not pin a stable first-party source asset file, and the live domain now contains later unrelated material. The existing directory-derived local image is not promoted merely because first-party branding existed historically.

Result: `neutral_fallback`.

### USDH

First-party Native Markets/USDH material demonstrates that USDH has its own brand assets. However, the site is now sunset, the review did not pin a stable reusable source file, and the first-party terms restrict reproduction/use of logos and images without permission.

Result: `neutral_fallback` under the current local provenance/use contract.

## Remaining neutral fallbacks

The remaining reviewed neutral fallbacks also fail the asset-specific/pinned-source requirement and must not be promoted in Phase D:

```text
acala-ausd
avalon-usda
bison-bank-eub
bison-bank-usb
brz
chfau
coins-phpc
dynamic-set-dollar
eurau
gbpq
plnq
poundtoken
sekau
sofiusd
usdh
usdy
usk
vchf
```

The exact evidence/rationale for each record is stored in the machine-readable review file.

## Phase gate

After this review-result package merges:

```text
Phase A: complete
Phase B: complete
Phase C: authorized next under the existing parent authority
Phase D: not yet permitted before Phase C is implemented/reviewed
Phase E: not yet permitted
```

Phase C must implement only:

1. understandable matching-row feedback / no-op feedback in Compare;
2. Compare record marks using the existing audited resolver/fallback semantics;
3. the blocking Compare tests and responsive acceptance required by the parent spec.

Phase C must **not** import MNEE, USDGO, or USR logo files. Those three imports remain Phase D work.

## Canonical boundary

```text
Stable assets: 119 -> 119
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Market Access Records: 12 -> 12
Archive recorded / not recorded: 471 / 114 -> 471 / 114
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798 unchanged
Canonical file count: 466
Canonical delta: 0
```

No archive, Market Access, schema/taxonomy, route, ranking, scoring, recommendation, or canonical Stablecoin mutation is authorized by this review result.
