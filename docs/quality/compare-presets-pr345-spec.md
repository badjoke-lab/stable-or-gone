# SOG Compare presets — PR #345

Status: canonical UI behavior specification  
Updated: 2026-07-10

## 1. Purpose

PR #345 adds bounded comparison presets to `/compare/`.

Presets are editorial shortcuts for choosing:

```text
asset slugs
visible facet groups
```

Presets do not change:

- canonical values;
- Comparison Readiness;
- facet freshness;
- evidence boundaries;
- Market Access governance;
- unknown-state semantics;
- scoring policy.

No preset may create a rank, score, recommendation, or synthetic risk signal.

## 2. Binding configuration

```text
config/compare-v1-presets.json
```

Every preset must contain:

```text
id
label
description
asset_slugs
visible_group_ids
```

Asset count is bounded to two through four.

All asset slugs must exist in the PR #343 deterministic comparison projection.

All visible group IDs must exist in the PR #344 Compare v1 dimension-group configuration.

## 3. Preset set

PR #345 defines five presets:

```text
USD issuer-backed
Model contrast
Lifecycle outcomes
Protocol stablecoins
Legal and access focus
```

### USD issuer-backed

```text
usdt
usdc
rlusd
fdusd
```

Purpose: compare issuer-backed USD records while keeping reserve, redemption, legal, access, and uncertainty dimensions separate.

### Model contrast

```text
usdc
dai
frax
ust
```

Purpose: compare fiat-backed, multi-collateral, hybrid, and failed algorithmic histories.

This preset shows only:

```text
Identity and current state
Mechanism, reserves, and redemption
```

### Lifecycle outcomes

```text
usdt
busd
ust
fei
```

Purpose: compare active, discontinued, failed, and wind-down histories without converting lifecycle into a score.

### Protocol stablecoins

```text
dai
usds
frax
mim
```

Purpose: compare protocol mechanisms, reserve structures, redemption paths, evidence, and explicit uncertainty.

### Legal and access focus

```text
usdc
rlusd
busd
usdp
```

Purpose: focus the matrix on legal, regulatory, canonical Market Access, evidence, and uncertainty context.

This preset does not import PR #339 editorial research into canonical Market Access output.

## 4. URL state

Preset state is represented as:

```text
preset=<preset_id>
assets=<comma-separated-slugs>
groups=<comma-separated-group-ids>
```

Example:

```text
/compare/?assets=usdc,dai,frax,ust&preset=model-contrast&groups=identity_state,mechanism_reserves
```

Rules:

- preset-only URLs are restored from the canonical preset config;
- restored URLs are normalized to include asset state and non-default group state;
- explicit asset order is preserved;
- invalid preset IDs are ignored;
- manual asset edits clear active preset identity;
- manual group edits clear active preset identity;
- group state remains shareable after leaving preset mode;
- browser back/forward restores preset and group state.

## 5. Facet-group controls

PR #345 exposes four independent presentation groups from PR #344.

Users may show or hide groups manually.

At least one group must remain visible.

Group filtering changes presentation only. Hidden groups are not deleted from the PR #343 projection and do not change any value, readiness, or freshness state.

## 6. Active preset state

Exactly one preset button may report:

```text
aria-pressed: true
```

only when both asset selection and visible group selection match that preset exactly.

Any manual divergence clears active preset identity.

The selected assets and group state remain intact after preset identity is cleared.

## 7. Public wording boundary

Preset labels may describe comparison intent, such as:

```text
model contrast
lifecycle outcomes
legal and access focus
```

Preset wording must not imply:

- best;
- safest;
- strongest;
- lowest risk;
- compliant everywhere;
- available everywhere;
- government approved;
- recommended.

## 8. Market Access boundary

PR #345 does not add canonical Market Access Records.

The Compare page continues to consume only PR #343 canonical projection values.

While canonical Market Access remains empty, presets must preserve:

```text
record_state: no_canonical_record
record_count: 0
freshness: no_canonical_record
```

Selecting a legal/access preset must not import editorial research or monitoring observations.

## 9. Responsive and accessibility contract

Preset controls must:

- remain keyboard operable;
- expose pressed state through `aria-pressed`;
- remain at least 44 px high;
- preserve visible focus indication;
- stack cleanly on mobile;
- avoid page-level horizontal overflow.

Facet-group toggles must:

- use native checkboxes;
- remain at least 44 px high as labeled controls;
- announce the one-group-minimum error through the existing Compare alert region.

## 10. Validation requirements

PR #345 must prove:

1. exactly five preset definitions exist;
2. every preset contains two to four unique canonical assets;
3. every visible group ID exists in PR #344 config;
4. preset application updates assets, groups, URL state, and pressed state;
5. Model contrast renders four assets, two groups, thirteen rows, and fifty-two cells;
6. adding Evidence and uncertainty manually clears preset identity and produces three groups, sixteen rows, and sixty-four cells;
7. manual asset change clears preset identity without changing underlying projection data;
8. preset-only URL restoration normalizes Protocol stablecoins to four assets and two groups;
9. lifecycle preset renders correctly on mobile without page-level horizontal overflow;
10. general CI, dedicated PR #345 workflow, responsive accessibility, and screenshot capture remain green.

## 11. Non-goals

PR #345 does not:

- add new canonical records;
- modify PR #343 projection data;
- modify Comparison Readiness;
- modify freshness derivation;
- create canonical Market Access records;
- create ranking or recommendation;
- create a score;
- auto-select a preset on the empty `/compare/` route;
- add natural-language query translation.

## 12. Next item

After PR #345 merges, PR #346 is authorized to build the access and regulation index generator.

That workstream must consume canonical data and preserve the PR #341 Market Access governance boundary. Compare presets do not authorize use of editorial or monitoring-only observations in the access/regulation index.
