# PR #330 controlled growth activation

Status: active roadmap amendment  
Updated: 2026-07-08

## Authoritative current workstream

```text
PR #328 statistics analysis expansion: complete
PR #329 next-growth candidate audit: complete
PR #330 100 -> 102 controlled growth: active
PR #331 102 -> 104 controlled growth: next
```

## Promotion allocation

PR #330 may promote only:

```text
sog_cand_000101 -> sog_st_eure      EURe / Monerium
sog_cand_000102 -> sog_st_1gbp      poundtoken / 1GBP
```

The second identity corrects the PR #329 audit-stage GBPT misidentification. The correction is explicit and must not leave a phantom GBPT canonical record.

## Canonical count transition

```text
stable assets: 100 -> 102
organizations: 94 -> 96
relationships: 110 -> 112
classifications: 100 -> 102
profiles: 100 -> 102
events: 172 -> 174
event details: 172 -> 174
evidence: 502 -> 508
reserve reports: 108 -> 110
known unknowns: 289 -> 295
deployments: 140 -> 147
legal profiles: 100 -> 102
reserve components: 133 -> 135
income profiles: 100 -> 102
```

## Lifecycle boundary

EURe is recorded active based on current Monerium product, reserve, redemption, contract, and regulatory evidence.

poundtoken (1GBP) is recorded unknown. The verified Ethereum token contract and historical product metadata do not prove current issuer operation, minting, redemption, reserve reporting, or onboarding availability.

## Statistics checkpoint boundary

The audited 100-asset checkpoint remains immutable historical evidence.

PR #330 introduces a separate current 102-asset growth checkpoint and appends a reviewed 102-asset statistics-history snapshot. It may not rewrite the 100-asset snapshot.

## Completion condition

PR #330 completes when:

- exactly the two allocated candidates are promoted;
- the PR #329 GBPT misidentification is explicitly corrected to 1GBP;
- canonical stable asset count is exactly 102;
- all required V2 and V3 supporting records are present;
- 1GBP unknown-state fields remain explicit;
- current statistics derive from the 102-asset checkpoint;
- the 102-asset statistics snapshot is appended after the immutable 100-asset prefix;
- full CI and independent audit workflows are green.
