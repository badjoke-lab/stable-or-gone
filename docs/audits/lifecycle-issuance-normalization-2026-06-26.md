# SOG lifecycle and issuance normalization audit

Status: supporting audit  
Recorded: 2026-06-26  
Phase: 2 / PR 6  
Record checkpoint: 92 canonical stable assets

## 1. Purpose

This audit records the migration from the legacy single `status` field used by older public pages to two separate canonical axes:

```text
lifecycle_status
issuance_status
```

Lifecycle describes the asset's current historical state. Issuance describes whether new units can currently be created and under what conditions. Neither axis is a substitute for event history, redemption status, market price, evidence confidence, or deployment status.

## 2. Canonical coverage

```text
Stable assets:          92
Classification records: 92
Missing lifecycle:       0
Missing issuance:        0
```

Generated reports:

```text
data/generated/lifecycle-issuance-migration.json
data/generated/lifecycle-issuance-validation.json
```

Validation command:

```text
npm run validate:lifecycle-issuance
```

## 3. Canonical lifecycle counts

| Lifecycle state | Count |
|---|---:|
| Active | 69 |
| Restricted | 8 |
| Winding down | 3 |
| Inactive | 1 |
| Terminated | 2 |
| Collapsed | 6 |
| Migrated | 2 |
| Rebranded | 1 |
| **Total** | **92** |

No canonical record uses `failed`, `limited`, `impaired`, or `discontinued` as its lifecycle value.

## 4. Canonical issuance counts

| Issuance state | Count |
|---|---:|
| Open | 1 |
| Protocol-based | 29 |
| Restricted | 45 |
| Terminated | 15 |
| Unknown | 2 |
| **Total** | **92** |

## 5. Lifecycle and issuance combinations

| Lifecycle | Issuance | Count |
|---|---|---:|
| Active | Open | 1 |
| Active | Protocol-based | 29 |
| Active | Restricted | 39 |
| Restricted | Restricted | 6 |
| Restricted | Unknown | 2 |
| Winding down | Terminated | 3 |
| Inactive | Terminated | 1 |
| Terminated | Terminated | 2 |
| Collapsed | Terminated | 6 |
| Migrated | Terminated | 2 |
| Rebranded | Terminated | 1 |

These combinations are checked against `config/lifecycle-issuance-compatibility.mjs`.

## 6. Safe legacy mappings

The following mappings are uniform across the current dataset:

```text
active    -> active
failed    -> collapsed
impaired  -> restricted
limited   -> restricted
migrated  -> migrated
rebranded -> rebranded
```

The legacy value remains available only for compatibility auditing. It is no longer the public status axis.

## 7. Record-specific discontinued mappings

`discontinued` cannot be converted globally because it represented several different historical states.

| Record | Canonical lifecycle | Issuance | Reviewed interpretation |
|---|---|---|---|
| BUSD | Winding down | Terminated | New issuance ended while wind-down and redemption transition remained material. |
| EURT | Terminated | Terminated | The reviewed record identifies a completed terminal state. |
| FEI | Terminated | Terminated | The protocol-backed asset reached a reviewed terminal state. |
| GYEN | Winding down | Terminated | Issuance ended while the final public terminal boundary remains unresolved. |
| HUSD | Inactive | Terminated | The asset no longer operates, but the record does not assert collapse or a stronger completed termination state. |
| Mountain USDM | Winding down | Terminated | The reviewed record remains in an orderly wind-down and redemption phase. |

Every current legacy `discontinued` record must have exactly one explicit mapping. The validator rejects new unmapped uses.

## 8. Public presentation changes

The following public surfaces now use canonical lifecycle and separate issuance:

```text
home selected-record table
stablecoin index rows
stablecoin index filters and sorting
stablecoin detail hero
stablecoin detail overview
organization relationship tables
version.json record-count breakdown
data/manifest.json record-count breakdown
registry statistics
```

The public stablecoin index exposes separate `Lifecycle` and `Issuance` controls. A past event does not automatically determine either value.

## 9. Statistics and compatibility

Canonical lifecycle counts remain under:

```text
lifecycle.by_status
```

Canonical issuance counts remain under:

```text
composition.issuance_statuses
```

The old distribution is retained only as:

```text
composition.legacy_status_compatibility
```

It must not be presented as the normal public status taxonomy.

## 10. Visual-state rules

Public chips now use canonical lifecycle selectors:

```text
active
restricted
suspended
winding_down
inactive
terminated
collapsed
migrated
rebranded
announced
unknown
```

Legacy selectors for `limited`, `impaired`, `discontinued`, and `failed` are prohibited by validation.

## 11. Validation guarantees

The lifecycle and issuance validator rejects:

- missing classification coverage;
- unsupported canonical values;
- unsafe global conversion of `discontinued`;
- unreviewed lifecycle/issuance combinations;
- unused or missing record-specific overrides;
- public reads from `coin.status`;
- fallback from canonical lifecycle to legacy status;
- missing Lifecycle or Issuance filters and columns;
- legacy status in the public machine-readable breakdown;
- legacy status as a normal statistics axis;
- legacy public chip selectors.

## 12. Non-scope

This work does not change:

- peg or reference-target semantics;
- backing-model categories;
- event categories;
- evidence reliability;
- deployment status;
- redemption status;
- event history;
- canonical record counts;
- production deployment state.
