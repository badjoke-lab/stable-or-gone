# Material concerns retroactive audit — pass 01

Status: in progress
Parent: #597
Spec: `docs/material-concerns-and-retroactive-audit-spec.md`

## Finding

The existing SOG data model already contains review-gap / known-unknown material that can feed the new public concern presentation. This pass confirms that the migration must reuse those canonical research gaps rather than creating JPYR-only warning metadata.

## Confirmed existing gaps sampled from canonical data

Source reviewed: `data/batch-aa-review-gaps.json`.

| asset | dimension | audit classification | existing severity | public concern implication |
|---|---|---|---|---|
| CHFAU | complete deployment inventory | derivable | medium | deployment inventory incomplete |
| CHFAU | reserve report series | derivable | high | reserve/assurance series incomplete; do not render reserve verification as complete |
| CHFAU | redemption fees/limits/settlement | derivable | medium | legal redemption entitlement is documented but operational redemption details remain unresolved |
| SEKAU | complete deployment inventory | derivable | medium | deployment/change inventory incomplete |
| SEKAU | reserve report series | derivable | high | reserve/assurance series incomplete; current allocation/banking detail requires continuing review |
| SEKAU | redemption operations/circulation | derivable | medium | legal redemption right is documented but operational terms/current circulation remain unresolved |

## Migration rule confirmed by this pass

A documented legal right or issuer claim must not collapse an unresolved operational question into a favorable badge. Example: documented par-redemption entitlement and unresolved fees/limits/settlement must be presented as separate facts.

Likewise, an issuer statement of full/segregated backing is not equivalent to a normalized, current, independently reviewable reserve/assurance series. The public summary must preserve that distinction.

## Next audit passes

1. Enumerate all existing `*-review-gaps.json` and equivalent known-unknown sources and map their topics to the new concern dimensions.
2. Inventory reserve/redemption records and identify assets with issuer claims but incomplete assurance/redemption evidence.
3. Inventory material yield-state/promotional records.
4. Produce the full canonical asset matrix (`derivable` / `research_required` / `not_applicable`).
5. Cut correction batches before declaring the new concern UI complete.

JPYR remains a first application, not an exception to this migration.
