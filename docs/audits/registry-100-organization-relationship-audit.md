# SOG 100-Record Organization and Relationship Integrity Audit

- Audit ID: `sog_registry_100_organization_relationship_pr298`
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t`
- Stable assets: **100**
- Organizations: **94**
- Relationships: **110**
- Critical findings: **0**
- Review warnings: **5**

## Scope

The audit covers:

- organization ID, slug, and normalized-name uniqueness;
- official URL validity and reuse visibility;
- orphan organizations;
- relationship ID and semantic-edge uniqueness;
- stablecoin and organization reference integrity;
- role and status enums;
- active/end-date and start/end consistency;
- legacy `issuer_id` compatibility coverage;
- multiple active legal-issuer cases;
- deterministic primary-display selection;
- unresolved historical end-date boundaries.

## Primary Display Integrity

```text
invalid selections: 0
ambiguous selections: 0
selected legal_issuer: 37
selected protocol_operator: 60
selected brand_owner: 2
selected reserve_manager: 1
selected active relationships: 84
selected ended relationships: 14
selected unknown relationships: 2
```

Every canonical stable asset has a valid deterministic primary-display relationship. No explicit override is required by the current policy.

## Organization Source Boundaries

One historical organization has no current official URL:

```text
sog_issuer_stable_universal
```

This remains explicit. The HUSD / Stable Universal organization record is historical and its current organization-source boundary is not being guessed from secondary or unrelated surviving pages.

One exact official product URL is intentionally shared:

```text
https://circle.com/usyc
```

It is referenced by:

- `sog_issuer_circle_bermuda` — Circle International Bermuda Limited, the USYC issuer/administrator entity;
- `sog_org_hashnote_sdyf` — Hashnote International Short Duration Yield Fund Ltd., the Cayman underlying fund entity.

The shared product page does not mean these organizations are duplicates. Their legal and fund roles remain distinct.

## Relationship Boundaries

Four ended relationships retain unresolved exact end dates:

```text
sog_rel_husd_stable_universal
sog_rel_esd_empty_set_operator
sog_rel_bac_basis_cash_operator
sog_rel_dsd_protocol_operator
```

These remain explicit unresolved boundaries. The audit does not infer an end date from last activity, depeg, website disappearance, or repository inactivity.

The final relationship checks are:

```text
active relationships with end date: 0
start-after-end boundaries: 0
legacy issuer compatibility gaps: 0
multiple active legal issuer assets: 0
duplicate active organization-role edges: 0
orphan organizations: 0
```

## Result

PASS. Organization identity, relationship references, role/status enums, temporal consistency, legacy issuer compatibility coverage, and primary-display selection are structurally valid.

PR #298 closes with bounded review queues rather than guessed corrections:

```text
organizations without official URL: 1
intentional shared USYC product URL: 1
ended relationships with unresolved end date: 4
critical findings: 0
```

The next registry-wide audit item is PR #299: evidence and source-identity integrity across all 501 canonical evidence records and their relations.
