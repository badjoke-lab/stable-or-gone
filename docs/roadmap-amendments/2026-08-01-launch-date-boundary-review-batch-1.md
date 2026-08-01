# Launch Date Boundary Review — Batch 1

Status: reviewed authorization  
Authority PR: #502  
Authorized implementation PR: #503  
Date: 2026-08-01

## Decision

The post-PR #500 review gate is closed only for one bounded launch-date evidence review. The selected records are the six current unresolved launch-date rows that still lack both a formal review date and a reviewed primary-source list.

```text
sog_st_msusd
sog_st_stablesusdx
sog_st_susde
sog_st_usd1
sog_st_usdm
sog_st_usdh
```

This authorization is not a record-growth program and does not authorize any new asset, organization, relationship, event, deployment, Market Access record, route family, ranking, score, recommendation, or material UI work.

## Why this item

The latest candidate audit was completed one day ago and did not support another complete-record promotion. The terminal-date queue contains final-cessation boundaries that still depend on future or unrecovered evidence. The Evidence archive queue was reviewed recently and its last selected batch produced ten reviewed no-safe-change outcomes.

The six selected launch-date rows are different: their queue entries remain materially under-documented compared with the other 23 unresolved launch-date records. A bounded primary-source review can either resolve a day-level boundary or replace weak placeholder prose with a reviewed range and explicit reason for retaining null.

## Binding rules

1. PR #502 changes authority only and must not change canonical data.
2. PR #503 must review all six named records and no substitutes.
3. A canonical launch date requires day-level primary evidence that matches the launch boundary being claimed.
4. Announcement, contract deployment, first mint, exchange listing, network launch, rebrand, migration, and broad availability are separate boundaries unless the source explicitly establishes equivalence.
5. A record remains null when exact-day evidence is absent.
6. New Evidence IDs are allowed only when they directly support a named launch-boundary claim and pass ordinary Evidence integrity rules.
7. No event may be added merely to manufacture a launch date.
8. Every target must receive one explicit disposition: resolved exact day, bounded range with null preserved, or separate identity/lineage scope required.
9. PR #503 exits to REVIEW GATE. No later batch is authorized automatically.

## Preserved baseline

```text
stable assets: 117
organizations: 108
relationships: 129
events: 192
Evidence: 579
Evidence Relations: 579
deployments: 184
detail routes: 417
metadata-checked detail routes: 417
```
