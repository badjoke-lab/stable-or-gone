# Roadmap amendment — PR #466 post-UI data-growth review gate

Date: 2026-07-25  
Status: reviewed authorization  
Authority: `docs/post-351-data-growth-operating-spec.md`

## Context

PR #429 completed Record Growth Batch 2 by promoting CHFAU and SEKAU. Its exit state required a mandatory `REVIEW GATE`. Subsequent work completed the UI V3 closure but did not change the canonical asset set, so the repository remains at 114 reviewed stable assets.

PR #427 retained PLNQ and GBPQ as review-ready candidates in one coherent Quantoz regulated non-EUR context. Each candidate has three reviewed primary-source leads and was marked complete-record feasible. They were deferred by sequencing, not rejected.

## Amendment

Authorize one bounded next work item:

```text
PR #467 — Record Growth Batch 3: PLNQ and GBPQ
REVIEW GATE
```

PR #467 may add at most the two exact selected assets. It must reuse the existing Quantoz organization and perform fresh duplicate, source, deployment-identity, reserve, and redemption checks before canonical edits.

A candidate that cannot support a complete record must be withheld. PR #467 may not substitute a third candidate or merge a thin placeholder record.

## Preserved boundaries

- PR #466 is governance-only and changes no canonical or public data.
- No Market Access, monitoring-publication, UI, route, dashboard, score, ranking, or recommendation work is authorized.
- Unknowns remain explicit.
- Automatic candidate promotion remains prohibited.
- Production publication remains governed separately by `docs/deployment-policy.md`.

## Stop point

No work after PR #467 is authorized by this amendment. The next decision is a mandatory review gate based on the actual merged result and maintenance load.
