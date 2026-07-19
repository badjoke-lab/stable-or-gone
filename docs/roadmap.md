# Stable or Gone Roadmap

Updated: 2026-07-18  
Status: UI v3 complete; reviewed data growth resumed

## Current position

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 430
Archive not recorded: 129
Issue #281 UI v3 rebuild: complete
Accepted desktop templates: 6
Accepted mobile templates: 6
Pending desktop templates: 0
Pending mobile templates: 0
UI completion: true
```

## Active data-growth sequence

```text
PR #426 Post-UI v3 Data-Growth Reset: complete
PR #427 Record Growth Candidate Audit v2: active
REVIEW GATE after PR #427
```

PR #427 audits eleven current stable-asset leads against all 112 canonical assets. Four rows are existing canonical identities and must be suppressed as duplicates: EURAU, EURQ, USDQ, and USR.

Four distinct launched identities are ready for complete-record review: CHFAU, SEKAU, PLNQ, and GBPQ. Open USD remains deferred, FIUSD remains evidence-incomplete, and Roughrider Coin remains prelaunch or noncanonical.

A canonical Record Growth Batch 2 is not authorized yet. The review gate after PR #427 may authorize at most two complete records only when the audit shows that complete evidence-backed record families can be produced.

## Completed UI v3 sequence

```text
PR #409 design contract and failure gates
PR #410 review gate
PR #411 global shell and navigation
PR #412 review gate
PR #413 home and stablecoin register
PR #414 review gate
PR #415 stablecoin dossier
PR #416 review gate
PR #417 events and organizations
PR #418 review gate
PR #419 guides and secondary pages
PR #420 review gate
PR #421 full visual closure
PR #422 owner approval and completion record
PR #424 production checker aligned with UI v3
PR #425 active authority aligned and Issue #281 closed
```

## Final visual result

```text
Required captures: 14
Completed captures: 14
Visual failures: 0
Horizontal-overflow failures: 0
Approved template families: 6
Approved desktop states: 6
Approved mobile states: 6
```

The owner reviewed and accepted the final visual package on 2026-07-18. Approval covers home, stablecoin register, stablecoin dossier, events, organizations, and guides on desktop and mobile.

## Preserved boundaries

```text
Canonical data changed by PR #426 or PR #427: 0
Public UI changed by PR #426 or PR #427: 0
Routes changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Automatic candidate promotion: disabled
```

Future material UI work requires a new authorized workstream. PR #427 must stop at a review gate before any canonical growth.