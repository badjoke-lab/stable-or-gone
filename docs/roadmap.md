# Stable or Gone Roadmap

Updated: 2026-06-28  
Status: canonical execution schedule

## Authority

The active visual and page contract is `docs/architecture/approved-modern-data-product-ui-v2.md`. The owner-review visual-mark correction recorded below narrows the use of circular letter marks. The binding implementation order is `docs/ui-redesign/implementation-plan.md`. Repository specifications outrank chat handoffs and unmerged drafts.

## Registry checkpoint

```text
Stable assets:                 92
Organizations:                 86
Organization relationships:   101
Events:                       150
Canonical evidence records:   455
Public source identities:      410
Evidence relations:            455
Known unknowns:                253
Deployments:                   130
Reserve components:            125
```

Canonical count source: `docs/migration/registry-v3-baseline.json`.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest completed UI-program work: PR #215
Current phase: owner visual-review correction before full audit
Active work: PR #216 — visual mark correction
Next work: PR #217 — 92-record and all-route UI v2 audit
Gate V2-A: passed
Gate V2-B: passed
Gate V2-C: passed
Gate V2-D: passed
Gate V2-E: passed
Gate V2-F: not started
Routine record growth: paused at 92 assets
Batch 18 selection: prohibited
Automatic production deployment: disabled
Production publication: prohibited until Gate V2-G owner approval
```

## Completed UI v2 sequence

```text
PR #207  approved v2 contract, references, schedule, and governance
PR #208  shared visual foundation and S/G brand system
PR #209  Home
PR #210  Stablecoins index
PR #211  Stablecoin detail
PR #212  Organizations index and detail
PR #213  Events index and detail
PR #214  Methodology and editorial/project family
PR #215  mobile, accessibility, interaction, and compact-layout hardening
```

PRs #209–#215 preserved canonical record counts and did not publish production.

## Gates

```text
V2-A  design contract, reference assets, and schedule merged             passed
V2-B  shared visual foundation complete                                  passed
V2-C  approved registry page families complete                           passed
V2-D  editorial and project pages aligned                                passed
V2-E  mobile and accessibility hardening complete                        passed
V2-F  92-record and all-route audit complete                             pending
V2-G  one immutable candidate explicitly approved by the owner           pending
V2-H  deliberate production publication verified                        pending
```

## Immediate work — PR #216

PR #216 is the visual-mark correction identified during owner review. It must:

1. preserve stablecoin ticker marks as the fallback when no reviewed local official logo exists;
2. preserve the local-source and review requirements for any official stablecoin logo;
3. remove visible letter marks from metric cards;
4. remove visible letter marks from Home destination cards;
5. stop rendering organization initials and ORG hero marks;
6. stop rendering event EVT and year hero marks;
7. stop rendering the Stablecoins-index hero letter group;
8. collapse the unused hero visual column after those marks are removed;
9. change functional filter-count markers from circles to restrained rounded rectangles;
10. include the correction in the existing mobile/accessibility validator;
11. preserve all canonical data, routes, counts, filters, sorts, evidence, known unknowns, deployments, and production state.

Completion of PR #216 does not pass Gate V2-F and does not authorize publication.

## Formal audit — PR #217

PR #217 is the formal visual and structural audit. It must:

1. audit all 92 stablecoin routes;
2. audit all 86 organization routes;
3. audit all 150 event routes;
4. verify every public route and machine-readable endpoint;
5. compare the eight approved desktop reference families;
6. verify representative 320px, tablet, desktop, 200% zoom, keyboard, reduced-motion, and forced-colors states;
7. verify that protected desktop fields remain reachable in compact representations;
8. verify canonical counts, evidence relations, known unknowns, deployments, and route/output parity;
9. produce a before/after and exception report;
10. identify one immutable release candidate without publishing it.

Gate V2-F passes only after the audit is complete. Gate V2-G requires explicit owner approval of the exact candidate.

## Visual review checkpoint

Owner visual review after PR #215 identified excessive circular letter marks. PR #216 corrects that finding before the formal all-route audit. The review and correction are not production publication.

## Preserved quality queues

```text
Missing canonical launch dates:           20
Historical terminal dates unresolved:      4
Historical relationship end dates:         7
Reserve applicability queue:               12
Public duplicate evidence URL groups:       0
Evidence reliability values unknown:       36
Direct workflow placeholders retained:    112
Deployment canonicality not recorded:      67
Deployment verification not recorded:     130
Deployment source review needed:           15
```

UI work must not clear these queues through defaults, guesses, hiding, or relabeling.

## Growth policy

Routine growth remains paused at 92 assets until Gate V2-F. The final-eight path to 100 requires a deliberate roadmap amendment after the repaired 92-record audit.

## Publication policy

```text
Automatic production deployment: disabled
Normal implementation PR deployment: none
Emergency publication: deployment policy only
UI v2 publication: one deliberate checkpoint after Gate V2-G
Publication path: manual production workflow
Production branch: main
```

Production success may be stated only after the deployed commit and public parity are verified.
