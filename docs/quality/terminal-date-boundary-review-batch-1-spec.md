# Terminal Date Boundary Review — Batch 1

Status: authorized bounded private review  
Authority PR: #508  
Implementation PR: #509  
Public output: false

## Objective

Review exactly three unresolved terminal-date records whose existing queue entries contain a strong wind-down, migration, or final-redemption boundary but not a proven final effective end day.

## Fixed targets

```text
sog_st_fei
sog_st_nearusn
sog_st_esd
```

No replacement or fourth target is allowed.

## Acceptance rule

A canonical terminal day may be written only when day-level primary evidence proves a final effective terminal boundary for the same canonical identity. Accepted terminal boundaries include executed final redemption completion, residual distribution completion, final programme settlement, V1 end block, contract disablement, final migration deadline, final claim termination, or an equivalent explicit final end state.

The following are insufficient by themselves:

- governance proposal or vote date;
- wind-down start;
- permanent mint stop while settlement continues;
- successor or migration opening;
- depeg, low liquidity, market inactivity, last repository commit, or last website capture;
- retrospective source publication date.

## Allowed outcomes

- `exact_terminal_day_resolved`
- `reviewed_null_preserved`

Every target must receive a reviewed range, reason code, review date, reviewed primary-source list, and explicit rejected-shortcut record.

## Preserved boundaries

PR #508 changes authority only. PR #509 must preserve 117 assets, 108 organizations, 129 relationships, 192 events, 579 Evidence identities, 579 Evidence Relations, 184 deployments, 8 Market Access records, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122 unless a separate reviewed Evidence change is authorized.

No asset, organization, relationship, deployment, Market Access, route family, material UI, ranking, score, or recommendation change is allowed.

## Exit

After PR #509 merge and production verification, return to `REVIEW GATE`. No second terminal-date batch is authorized automatically.
