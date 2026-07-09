# PR #333 controlled growth activation — PHPC and XIDR

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
PR #330 100 -> 102 controlled growth: complete
PR #331 Stats contrast and responsive UI remediation: complete
PR #332 102 -> 104 controlled growth: complete
PR #333 104 -> 106 controlled growth: active
PR #334 106 -> 108 controlled growth: next
```

## Promotion allocation

PR #333 may promote only:

```text
sog_cand_000105 -> sog_st_phpc    PHPC / Coins.ph
sog_cand_000106 -> sog_st_xidr    StraitsX Indonesian Rupiah / XIDR
```

The reviewed Batch 24 allocation remains unchanged from the PR #329 next-growth plan after the explicit PR-numbering correction introduced when PR #331 was used for Stats UI remediation.

## PHPC current-state boundary

PHPC is recorded as `limited` at legacy status level and `restricted` at Registry v2 lifecycle level.

The reviewed source chain establishes:

- Coins.ph as issuer;
- BSP Regulatory Sandbox treatment;
- a target of 1 PHPC to 1 PHP;
- a published 100% reserve model using cash, time deposits, and short-term money-market instruments;
- sandbox-era holder buy, sell, convert, and final reimbursement terms;
- Polygon and Ronin network issuance descriptions;
- a dated Ronin network launch on 2024-07-08;
- the exact Ronin token identifier published by the Ronin ecosystem.

Historical sandbox terms and network launch evidence are not treated as proof that current general-access minting and redemption are fully open. Current public scope remains explicitly restricted pending stronger current primary evidence.

## XIDR current-state boundary

XIDR is recorded as `active`.

The reviewed StraitsX source chain establishes:

- official launch on 2021-11-18;
- issuer identity through the StraitsX Indonesia operating structure;
- 1:1 Indonesian Rupiah backing;
- cash-only reserve description and one-for-one convertibility;
- verified-user platform access and redemption/conversion context;
- current StraitsX product availability;
- current exact Ethereum, Polygon, and Zilliqa identifiers;
- group-level safeguarding, segregation, banking, and assurance controls.

The 2021 launch record is preserved separately from later Polygon availability. Current exact deployment identifiers are taken from the current StraitsX product page.

## Canonical count transition

```text
stable assets: 104 -> 106
organizations: 97 -> 99
relationships: 114 -> 116
classifications: 104 -> 106
profiles: 104 -> 106
events: 180 -> 183
event details: 180 -> 183
evidence: 516 -> 525
reserve reports: 112 -> 114
known unknowns: 301 -> 307
deployments: 154 -> 159
legal profiles: 104 -> 106
reserve components: 137 -> 139
income profiles: 104 -> 106
```

## Event boundary

PR #333 adds three canonical events:

```text
2024-05-13  PHPC BSP sandbox testing context
2024-07-08  PHPC Ronin network launch
2021-11-18  XIDR official launch
```

The PHPC Ronin event is a network deployment launch and is not coerced into PHPC's original asset launch date.

## Deployment boundary

PR #333 adds five deployment rows:

```text
PHPC: Ronin exact identifier; Polygon source-linked without asserted identifier
XIDR: Ethereum exact identifier; Polygon exact identifier; Zilliqa exact identifier
```

Exact identifiers are promoted only where the reviewed primary product or ecosystem source publishes them.

## Statistics checkpoint boundary

The audited 100-asset checkpoint and reviewed 102/104 checkpoints remain immutable historical evidence.

PR #333 introduces:

```text
sog_controlled_growth_106_checkpoint_pr333_2026_07_09
```

The reviewed 106-asset statistics snapshot may only be appended after the exact 100/102/104 snapshot prefix.

## Completion condition

PR #333 completes when:

- exactly candidates 105 and 106 are promoted;
- canonical stable asset count is exactly 106;
- PHPC remains limited/restricted unless stronger current primary evidence establishes open general-access issuance and redemption;
- XIDR remains active with open issuance classification and reviewed eligible-customer redemption access;
- three canonical events and three typed details preserve the reviewed sandbox, network-launch, and XIDR launch boundaries;
- nine reviewed evidence records support identity, issuer, regulatory, reserve, redemption, deployment, and launch claims;
- five deployment rows are added, with four exact identifiers verified and the PHPC Polygon row explicitly source-linked without an asserted identifier;
- six explicit known-unknown records preserve unresolved PHPC launch/current-scope and XIDR current reporting/service boundaries;
- current Registry v2/v3, public counts, routes, statistics, and provenance baselines bind the 106-asset checkpoint;
- the 106-asset statistics snapshot is appended without rewriting the 100/102/104 history prefix;
- full CI and independent audit workflows are green.
