# Primary display relationship audit

Date: 2026-06-27  
Scope: Phase 2 / PR 14

## Baseline

```text
Stable assets:                92
Organizations:                86
Relationships:               101
Assets without relationships:  0
```

## Policy

One relationship is selected for compact summaries and navigation. Selection uses:

1. relationship status;
2. functional role;
3. current or historical boundary;
4. reviewed start and end dates.

JSON order is not a selection rule. A semantic tie requires an explicit reviewed override.

Status priority:

```text
active
planned
unknown
ended
```

Role priority:

```text
legal_issuer
protocol_operator
brand_owner
governance_body
reserve_manager
redemption_agent
custodian
technology_provider
other
```

## Result

```text
Selections:                         92
Deterministic selections:           92
Explicit overrides required:         0
Ambiguous selections:                0
Invalid selections:                  0
Assets with multiple relationships:  8
Assets with multiple organizations:  8
```

Selected roles:

```text
protocol_operator 52
legal_issuer      37
brand_owner        2
reserve_manager    1
```

Selected relationship states:

```text
active  77
ended   13
unknown  2
```

The eight multi-relationship assets are World Liberty Financial USD, Hashnote US Yield Coin, JPYSC, USDGO, USAT, EURAU, Noble Dollar, and USDH. Every relationship remains visible and searchable.

## Historical boundaries

Seven ended relationships have no supported end date. They remain ended with the end date shown as `not_recorded`; no date is inferred.

```text
sog_rel_busd_paxos
sog_rel_usdn_neutrino
sog_rel_husd_stable_universal
sog_rel_mountainusdm_mountain_issuer
sog_rel_esd_empty_set_operator
sog_rel_bac_basis_cash_operator
sog_rel_dsd_protocol_operator
```

## Array-order validation

Every asset is resolved against canonical, reversed, and rotated relationship arrays. All orders must select the same relationship ID.

## Public behavior

- the registry shows one primary display organization and role;
- search and organization filtering include all connected organizations;
- detail pages show all roles, dates, states, and display priority;
- organization pages mark primary and additional relationships;
- display priority is a summary rule and does not replace canonical relationship meaning.

## Machine-readable output

The manifest and Registry statistics include selected counts, role and status distributions, multiple-relationship counts, selection modes, override counts, and ambiguity counts.

## Preserved boundaries

No canonical record was added, deleted, merged, or renumbered. Evidence deduplication, record-copy migration, Batch 18, and production deployment remain outside this PR.

## Next

```text
PR 15 evidence-source deduplication with claim preservation
PR 16 record-specific copy migration and complete 92-record audit
```
