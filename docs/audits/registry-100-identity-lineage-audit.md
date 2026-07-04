# SOG 100-Record Identity and Lineage Audit

- Audit ID: `sog_registry_100_identity_lineage_pr297`
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t`
- Stable assets: **100**
- Organizations: **94**
- Promoted candidate mappings: **100**
- Explicit asset-lineage relationships: **4**
- Critical findings: **0**
- Review warnings: **12**

## Scope

- canonical ID and slug uniqueness;
- normalized canonical-name collisions;
- symbol and alias collision visibility;
- candidate-to-canonical one-to-one mapping;
- candidate alias preservation;
- organization official-domain reachability;
- explicit stable-asset relationship reference integrity;
- duplicate lineage edges and directed lineage cycles.

## Shared Symbol Groups

- `usdn`: sog_st_nobleusdn, sog_st_usdn
- `usdm`: sog_st_mountainusdm, sog_st_usdm
- `usx`: sog_st_solsticeusx, sog_st_usx
- `usdx`: sog_st_kavausdx, sog_st_stablesusdx

These symbol collisions represent separately scoped canonical assets and remain review-visible. Symbol reuse alone is not treated as duplicate canonical identity.

## Explicit Lineage Relationships

- `sog_ar_susde_yield_wrapper_usde`: sog_st_susde -> sog_st_usde (`yield_wrapper_of`, active)
- `sog_ar_sdai_yield_wrapper_dai`: sog_st_sdai -> sog_st_dai (`yield_wrapper_of`, active)
- `sog_ar_susds_yield_wrapper_usds`: sog_st_susds -> sog_st_usds (`yield_wrapper_of`, active)
- `sog_ar_sai_predecessor_dai`: sog_st_sai -> sog_st_dai (`predecessor_of`, active)

No invalid reference, duplicate lineage edge, self-reference, or directed lineage cycle was detected.

## Correction Applied

The first audit run found one reviewed candidate alias missing from the canonical Acala record:

```text
Acala USD
```

PR #297 preserves that reviewed alias on `sog_st_acalaausd`. The final audit result has zero candidate alias coverage gaps.

## Review Warnings

The final generated audit keeps the following review-visible classes:

- four reused canonical symbols: USDN, USDM, USX, and USDX;
- one additional normalized identity-token collision: Agora AUSD versus Acala historical `aUSD` alias;
- shared organization-domain hosts that require role and organization-scope review;
- HUSD / Stable Universal has no official domain reachable through the current organization relationship record.

The organization-domain and HUSD items are carried into PR #298, where organization identity, issuer roles, relationship integrity, and organization-source boundaries are audited directly.

## Result

PASS. No duplicate canonical ID, duplicate slug, canonical-name collision, broken candidate mapping, invalid lineage reference, duplicate lineage edge, or lineage cycle was detected across the 100-record registry.

PR #297 closes with:

```text
stable assets: 100
promoted candidate mappings: 100
critical identity findings: 0
candidate alias gaps: 0
lineage cycles: 0
```
