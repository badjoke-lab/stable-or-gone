# Stable or Gone Roadmap

Updated: 2026-06-28  
Status: canonical execution schedule

## Authority

The active visual and page contract is `docs/architecture/approved-modern-data-product-ui-v2.md`. The binding implementation order is `docs/ui-redesign/implementation-plan.md`. Repository specifications outrank chat handoffs and unmerged drafts.

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
Current phase: Phase V2-5 — full audit and release candidate
Next work: PR #216 — 92-record and all-route UI v2 audit
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

PR #216 is the formal visual and structural audit. It must:

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

After PR #215, the implementation is ready for owner visual review. That review is a checkpoint before or at the start of PR #216; it is not production publication and does not replace the formal all-route audit.

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
