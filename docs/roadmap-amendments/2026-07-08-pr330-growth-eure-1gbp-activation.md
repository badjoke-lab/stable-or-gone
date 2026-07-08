# PR #330 controlled growth activation

Status: active roadmap amendment  
Updated: 2026-07-09

## Authoritative current workstream

```text
PR #328 statistics analysis expansion: complete
PR #329 next-growth candidate audit: complete
PR #330 100 -> 102 controlled growth: active
PR #331 UI remediation: complete
PR #332 102 -> 104 controlled growth: next
```

## Promotion allocation

PR #330 may promote only:

```text
sog_cand_000101 -> sog_st_eure      EURe / Monerium
sog_cand_000102 -> sog_st_1gbp      poundtoken / 1GBP
```

The second identity corrects the PR #329 audit-stage GBPT misidentification. The correction is explicit and must not leave a phantom GBPT canonical record.

## Growth PR numbering correction

PR #329 originally allocated later batches to PR #331 through PR #334. PR #331 was subsequently used for the reviewed UI remediation workstream before the next growth PR opened.

Candidate identities, batch assignments, and count transitions do not change. Only the executable PR numbers move:

```text
batch_023  102 -> 104: planned #331 -> actual #332
batch_024  104 -> 106: planned #332 -> actual #333
batch_025  106 -> 108: planned #333 -> actual #334
batch_026  108 -> 110: planned #334 -> actual #335
```

The machine-readable correction source is `data/next-growth-pr-numbering-corrections-pr330.json`. The historical PR #329 allocation remains preserved as the original plan and is interpreted through this explicit overlay.

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
- the effective later growth numbering is bound to PR #332 through PR #335 without changing candidate allocation;
- full CI and independent audit workflows are green.
