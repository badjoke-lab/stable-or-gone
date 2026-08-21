# Ledger Series Phase 9 Stage 5 — SOG relationship publication authority

Status: reviewed authority after merge  
Date: 2026-08-21  
Entry main: `010689ef4e5a77f415091693d71b01e3e6c3f392`

## Why this authority exists

SOG is at `REVIEW_GATE`. Its completed Phase 9 Stage 3 Series adapter is an enduring regression contract, not standing permission for typed relationship publication.

The cross-registry Stage 5 audit in `badjoke-lab/historical-exchange-index#780` reviewed SOG's native relationship material and accepted exactly one lossless Series v1 mapping:

```text
stable-or-gone:stablecoin:sog_st_sai
  predecessor_of
stable-or-gone:stablecoin:sog_st_dai
```

Native reviewed support is `sog_ar_sai_predecessor_dai` in the existing stable-asset relationship material. Wrapper/redeemable semantics were explicitly rejected from promotion into weaker Series v1 types.

HEI audit PR #791 merged the reviewed inventory. HEI publication-authority PR #792 then authorized bounded implementation only through local per-registry review gates. This document is SOG's local gate.

## Authorized public delta

Only this additive Series machine output may change:

```text
/data/series/relationships.json
/data/series/registry.json   # relationship route/count/capability only
```

The relationship transport contains exactly one standalone Series v1 `relationship_record`.

The existing 119 `/data/series/records/{slug}.json` record envelopes remain semantically unchanged and retain empty Stage 5 `relationships` arrays.

## Hard boundaries

```text
canonical delta: 0
schema/taxonomy delta: 0
stablecoin additions/deletions: 0
new Evidence identities/relations: 0
Market Access mutation: 0
archive mutation: 0
cross-registry relationships: 0
Search/filter changes: 0
Compare changes: 0
Stats changes: 0
HTML/UI changes: 0
DNS/Cloudflare mutation: 0
analytics identity mutation: 0
```

No other SOG relationship is authorized. In particular, native wrapper or redeemable relationships must not be weakened into `related_to`, `product_of`, or another Series type merely to increase coverage.

## Deterministic identity

The relationship ID is derived exactly as:

```text
series_rel_ + lowercase hex SHA-256(
  UTF-8(relation_type + "\n" + source_global_record_key + "\n" + target_global_record_key)
)
```

Direction is `directed`; provenance basis is `native_reviewed_relationship`.

## Required sequence

1. Merge this authority while SOG remains at `REVIEW_GATE`.
2. Re-read exact main and existing Series generator/validator.
3. Implement exactly the one allowlisted relationship record and descriptor route/count/capability.
4. Add deterministic fail-close validation proving exact allowlist equality, endpoint existence, ID correctness, and empty record-envelope relationship arrays.
5. Run existing SOG integrity, reproducible-build, Phase 3, official-origin/domain migration, and Series regression gates.
6. Merge only after exact-head checks are green.
7. Verify exact merged main on `https://www.stableorgone.com`.
8. Record production evidence in Issue #479 and cross-registry acceptance in HEI Issue #780.
9. Close this authority and restore SOG to `REVIEW_GATE`.

Automatic continuation into another feature or later Phase 9 stage is forbidden.
