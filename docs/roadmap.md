# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: REVIEW_GATE after Compare / Stablecoin logo maintenance Phase E closeout

## Current repository checkpoint

```text
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/compare-logo-phase-e-closeout.json
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Deployments: 186
Market Access Records: 12
Archive recorded: 471
Archive not recorded: 114
Official origin: https://www.stableorgone.com
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized: 0
Additional logo promotions authorized: 0
Automatic continuation: false
```

## Current Stablecoin mark checkpoint

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: no
```

The public display state is accepted. The maintenance authority that produced it is closed.

## Completed Compare / Stablecoin logo maintenance schedule

```text
2026-08-12  Phase A — authority/specification/schedule — PR #554 — complete
2026-08-12  Phase B — exact 21-fallback re-audit — PR #555 — complete
2026-08-12  Phase C — Compare feedback + Compare Stablecoin marks — PR #556 — complete
2026-08-12  Phase D — mnee/usdgo/usr import + permanent growth gate — PR #557 — complete
2026-08-12  Phase E — exact-main verification + targeted mark regression + closeout — complete after closeout merge
closeout    repository restored to REVIEW_GATE; no automatic continuation
```

Historical phases cannot be reopened by chat instruction alone.

## Phase E accepted evidence

```text
Phase D merged main: bb72108ea53d96a69db42d5c8e97df47033be44e
Production run: 31585897410 — success
Production job: 94079531335 — success
Exact-main screenshot run: 31585897478 — success
Exact-main screenshot job: 94079532861 — success
All-record mark catalog: 119 / 119
Direct / fallback partition: 101 / 18
Broken images: 0
Empty frames: 0
Canonical delta: 0
```

Phase E also extends the existing screenshot regression to pin these states on desktop and mobile:

```text
mnee       -> direct logo
usdgo      -> direct logo
usr        -> direct logo
acala-ausd -> neutral fallback
```

This is verification tooling only and does not change product rendering.

## Permanent rules retained

The following continue after closeout:

- `docs/quality/stablecoin-logo-disposition-operating-spec.md`;
- core CI Stablecoin logo coverage audit on every PR;
- one reviewed logo disposition per canonical Stablecoin;
- explicit neutral fallback when no product/token-specific mark is approved;
- no runtime remote logo fetching;
- accepted Phase C Compare interaction behavior;
- material-public-UI regression review under `docs/ui-v3-remediation-authority.md`;
- official-origin and legacy-host deployment contracts.

## REVIEW_GATE schedule rule

There is no automatic next phase.

Before new work can start, a fresh reviewed authority must state:

```text
scope
entry main / baseline
canonical versus presentation boundary
research/evidence prerequisites
implementation sequence
CI and visual acceptance requirements
production verification requirements
closeout and continuation rules
```

Until such authority merges, the current schedule is:

```text
next implementation: none
canonical work: not authorized
archive work: not authorized
Market Access work: not authorized
additional logo promotion: not authorized
new route family: not authorized
ranking/scoring/recommendation: not authorized
Automatic continuation: false
```

## Historical completed lanes

```text
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout
PR #548/#549/#550 — Russia USDT Guide authority / implementation / closeout
PR #551/#552/#553 — Evidence Archive Batch 2 implementation / closeout
PR #554/#555/#556/#557 — Compare feedback / Stablecoin logo maintenance Phases A-D
Phase E closeout — verification and REVIEW_GATE restoration
```

Historical lineage remains useful for audit and regression context, not as standing implementation authority.
