# Terminal Date Boundary Review — Batch 2

Status: reviewed bounded implementation — no canonical date change  
Authority PR: #511  
Implementation PR: #512  
Public output: false

## Objective

Review exactly two unresolved terminal-date records that remain eligible for present-day primary-source research after Batch 1.

## Fixed targets

```text
sog_st_bac
sog_st_dsd
```

No replacement or third target is allowed.

## Explicitly deferred record

`sog_st_gyen` is outside this batch. GMO Trust's official boundary keeps the initial redemption period open through 2026-11-11. The wind-down start, purchase disablement, and notice date are not final token termination. A later review may be considered no earlier than 2026-11-12 and only through a separate authority decision.

## Acceptance rule

A canonical terminal day may be written only when day-level primary evidence proves a final effective terminal boundary for the same canonical identity.

BAC may be resolved only through an official shutdown notice, final mint stop, governance disablement, contract-level terminal end state, or an equivalent explicit final end.

DSD may be resolved only through an executed migration, formal shutdown, final mint stop, governance revocation, contract-level terminal end state, or an equivalent explicit final end.

The following are insufficient by themselves:

- depeg or price-low dates;
- negligible liquidity or market inactivity;
- last repository commit or last website capture;
- design or proposal publication;
- migration planning or successor discussion;
- retrospective source publication dates.

## Allowed outcomes

- `exact_terminal_day_resolved`
- `reviewed_null_preserved`

Every target must receive a reviewed range, reason code, review date, reviewed primary-source list, and explicit rejected-shortcut record.

## Preserved boundaries

PR #511 changes authority only. PR #512 must preserve 117 assets, 108 organizations, 129 relationships, 192 events, 579 Evidence identities, 579 Evidence Relations, 184 deployments, 8 Market Access records, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122 unless a separate reviewed Evidence change is authorized.

No asset, organization, relationship, deployment, Market Access, route family, material UI, ranking, score, recommendation, or legacy redirect change is allowed.

## Reviewed implementation result

PR #512 reviewed both fixed targets using first-party project publications and repositories.

```text
exact terminal days resolved: 0
reviewed null preserved: 2
new Evidence identities: 0
new Evidence Relations: 0
canonical and public count changes: 0
legacy redirect changes: 0
```

BAC V2 launch, migration work, and the 2021-06-01 roadmap update establish continuation rather than final cessation. DSD V2 execution and Sushiswap migration establish continued protocol operation rather than shutdown. Neither target has day-level primary evidence of an official final end.

GYEN remained excluded and unchanged because its initial redemption period is open through 2026-11-11.

## Exit

After PR #512 merge and production verification, return to `REVIEW GATE`. No third terminal-date batch is authorized automatically.
