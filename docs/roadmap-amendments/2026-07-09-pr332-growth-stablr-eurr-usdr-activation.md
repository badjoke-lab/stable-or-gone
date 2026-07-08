# PR #332 controlled growth activation — StablR EURR and USDR

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
PR #330 100 -> 102 controlled growth: complete
PR #331 Stats contrast and responsive UI remediation: complete
PR #332 102 -> 104 controlled growth: active
PR #333 104 -> 106 controlled growth: next
```

## Promotion allocation

PR #332 may promote only:

```text
sog_cand_000103 -> sog_st_eurr          StablR Euro / EURR
sog_cand_000104 -> sog_st_stablrusdr    StablR USD / USDR
```

The candidate identities, Batch 23 allocation, and 102 -> 104 transition are unchanged from the reviewed PR #329 growth plan as interpreted through the explicit post-UI PR numbering correction overlay.

## Current lifecycle boundary

Both assets are recorded as `restricted`.

The reviewed official source chain establishes:

- a cybersecurity incident identified on 2026-05-24;
- unauthorized external access and unauthorized issuance effects affecting EURR and USDR token operations;
- immediate suspension of minting and redemption;
- formal Recovery Plan activation on 2026-05-29;
- continuing regulatory, forensic, operational, and recovery work;
- incident containment and secured affected minting controls by the 2026-06-15 update;
- no further unauthorized issuance reported since 2026-05-24;
- continued minting and redemption suspension in the latest reviewed incident-recovery update.

Containment is not treated as full recovery. Generic service-status availability is not used as evidence that token minting or redemption resumed.

## Canonical count transition

```text
stable assets: 102 -> 104
organizations: 96 -> 97
relationships: 112 -> 114
classifications: 102 -> 104
profiles: 102 -> 104
events: 174 -> 180
event details: 174 -> 180
evidence: 508 -> 516
reserve reports: 110 -> 112
known unknowns: 295 -> 301
deployments: 147 -> 154
legal profiles: 102 -> 104
reserve components: 135 -> 137
income profiles: 102 -> 104
```

## Event-chain boundary

Each asset receives three reviewed canonical events:

```text
2026-05-24  cybersecurity incident / unauthorized issuance effects
2026-05-29  Recovery Plan activation and continued mint-redeem suspension
2026-06-15  incident containment with suspension still active
```

The 2026-06-05 official update is supporting evidence for the Recovery Plan event and continued suspension state rather than a duplicate event row.

## Deployment boundary

Only exact identifiers published in current StablR developer documentation are promoted.

```text
EURR: Ethereum, Plasma, Concordium, Solana
USDR: Ethereum, Plasma, Concordium
```

Deployment existence and token-service lifecycle are kept separate: deployment rows remain current identities while asset lifecycle status is `restricted` and issuance/redemption remain paused or suspended.

## Statistics checkpoint boundary

The audited 100-asset checkpoint and reviewed 102-asset checkpoint remain immutable historical evidence.

PR #332 introduces:

```text
sog_controlled_growth_104_checkpoint_pr332_2026_07_09
```

The reviewed 104-asset statistics snapshot may only be appended after the exact existing 100 and 102 snapshot prefix.

## Completion condition

PR #332 completes when:

- exactly candidates 103 and 104 are promoted;
- canonical stable asset count is exactly 104;
- both assets remain `restricted` unless a later reviewed primary source establishes reactivation;
- issuance status remains paused and redemption status remains suspended in current canonical profiles;
- six event rows and six typed event details preserve incident, recovery-plan, and containment chronology;
- eight reviewed official source records support product, reserve, deployment, and incident claims;
- exactly seven official StablR deployment identifiers are added and verified;
- six explicit known-unknown records preserve unresolved launch, recovery-terminal, and incident-impact boundaries;
- current Registry v2/v3, public counts, routes, statistics, and provenance baselines bind the 104-asset checkpoint;
- the 104-asset statistics snapshot is appended without rewriting the 100/102 history prefix;
- full CI and independent audit workflows are green.
