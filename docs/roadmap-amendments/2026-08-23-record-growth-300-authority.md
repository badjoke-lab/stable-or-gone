# SOG Record Growth to 300 — Reviewed Authority

Status: active after merge  
Date: 2026-08-23  
Entry main: `d26d50eba858b3528fdd5713814068ab55956913`

## Objective

Raise the reviewed canonical Stable Asset count from 119 to exactly 300 by adding 181 net-new in-scope stable assets. Count growth is not an acceptance criterion by itself: every promoted asset must retain the existing SOG evidence, lifecycle, provenance, explicit-unknown, identity/lineage, logo, machine-readable, validation, and production-verification standards.

## Entry checkpoint

```text
Stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Deployments: 186
Legal profiles: 119
Income profiles: 119
Target stable assets: 300
Required net-new assets: 181
```

## Work order

1. Merge this authority before any canonical-growth implementation.
2. Inventory existing canonical identities, aliases, deployments, migrations, successors, historical drafts, and candidate/research material to prevent duplicate promotion.
3. Research candidates using primary sources by claim scope wherever available.
4. Promote in independently reviewable batches, normally about 20 assets each.
5. For every promoted asset, add the canonical dossier layers required by the existing schema, including evidence/evidence relations and lifecycle events rather than name-only records.
6. Keep unsupported values explicitly unknown. Do not infer launch dates, issuers, reserves, redemption terms, legal status, or lifecycle outcomes.
7. Review rebrands, aliases, wrapped forms, chain deployments, migrations, and successor relationships before deciding that a candidate is a distinct canonical asset.
8. Give every new canonical stable asset a reviewed logo disposition; neutral fallback is valid under the existing logo policy.
9. Extend deterministic native dossier and Ledger Series outputs from the reviewed canonical data.
10. Run all existing data, build, Compare, Stats, Phase 3, Series, domain-migration, logo, and production gates.
11. Final closeout requires exactly 300 canonical stable assets and exact-main production verification.

## Minimum per-asset acceptance

A new canonical Stable Asset is promotable only when review supports its unique identity and scope, issuer/operator or an explicit unknown, stabilization/backing model at the supported level, reviewed lifecycle state, at least one canonical Evidence identity plus Evidence Relation supporting inclusion, and a launch/initial-availability event when a source supports a date or bounded date. Material later depeg, regulatory, redemption, recovery, migration, discontinuation, or failure events found during review must also be represented rather than omitted to keep the record thin.

## Evidence quality

Official issuer/protocol, regulator, exchange/provider, reserve/audit, governance, and other primary sources are preferred according to the fact being asserted. Secondary sources may be used for discovery or context, but a directory or market-listing presence alone is not enough to create a canonical asset when stronger claim-specific evidence is available or required.

## Forbidden shortcuts

No placeholders, ticker-only records, market-directory-only promotion, invented dates or backing facts, duplicate chain deployments presented as separate assets without lineage review, silent conversion of unknowns into facts, evidence deletion to offset growth, automatic candidate promotion, ranking/scoring/recommendation, or unrelated schema/UI/infrastructure changes.

## Acceptance and closeout

The final growth lane is accepted only when canonical Stable Assets equal exactly 300, all 181 net-new assets satisfy the per-asset gate, event/evidence layers remain substantive, all existing validators/regressions pass, native dossier and Series outputs cover 300/300, exact-main production verification passes, and governance/roadmap/AGENTS documents are synchronized before return to `REVIEW_GATE`.

Machine authority: `config/record-growth-300-authority.json`.
