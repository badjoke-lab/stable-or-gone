# Stable or Gone Roadmap

Updated: 2026-06-28  
Status: canonical execution schedule

## Authority

The active implementation plan is `docs/quality/non-ui-quality-program.md`. The UI contract remains `docs/architecture/approved-modern-data-product-ui-v2.md`; `docs/ui-redesign/implementation-plan.md` is paused after PR #216 until detailed owner visual review can resume. Repository specifications outrank chat handoffs and unmerged drafts.

## Registry checkpoint

```text
Stable assets:                 92
Organizations:                 86
Organization relationships:   101
Events:                       150
Canonical evidence records:   457
Evidence relations:            457
Known unknowns:                253
Deployments:                   130
Reserve components:            125
```

Canonical count source: `docs/migration/registry-v3-baseline.json`.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest completed work: PR #218 — launch-date Category B/D source review
Current phase: non-UI quality program
Active work: PR #219 — historical launch-boundary review
Next work: PR #220 — remaining current launch-boundary review
Detailed UI review: deferred
Gate V2-A: passed
Gate V2-B: passed
Gate V2-C: passed
Gate V2-D: passed
Gate V2-E: passed
Gate V2-F: deferred and not passed
Gate V2-G: not started
Gate V2-H: not started
Routine record growth: paused at 92 assets
Batch 18 selection: prohibited
Automatic production deployment: disabled
Production publication: deferred
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
PR #216  owner-review visual mark correction
```

The current UI is an intermediate repository state. The 92-record and all-route visual audit resumes only when detailed owner review is practical. Gate V2-F remains pending.

## Completed non-UI work

### PR #217 — workstream transition

- established `docs/quality/non-ui-quality-program.md` as the active plan;
- marked detailed UI review as deferred rather than passed;
- aligned agent instructions, governance, deployment policy, and build validation;
- preserved all canonical records and public output.

### PR #218 — Category B/D launch-date source review

- reviewed BRZ, HONEY, USDz, HUSD, TRYB, USYC, and AE Coin;
- preserved all seven canonical dates as `null`;
- replaced the source-missing category with source-backed boundary classifications;
- changed the launch queue from `B 3 / C 13 / D 4` to `B 3 / C 17 / D 0`.

## Immediate work — PR #219

Review the historical boundary group:

```text
Agora AUSD
Dynamic Set Dollar
Empty Set Dollar
Euro Tether
GYEN
Magic Internet Money
mStable USD
```

PR #219 resolves GYEN to `2021-03-01` using two official GMO sources that state issuance, redemption, and service began on that day. Agora AUSD, DSD, ESD, EURT, MIM, and mUSD remain unresolved because deployment, protocol start, first mint, public announcement, and public availability do not yet collapse into one evidenced day.

Expected PR #219 queue state:

```text
Missing canonical launch dates: 19
Category B: 3
Category C: 16
Category D: 0
```

## Next work — PR #220

Review the remaining current-product and lineage group:

```text
HONEY
HUSD
MainStreetUSD
Stables Labs USDX
Staked USDe
USD1
Mento Dollar
USYC
Hyperliquid USDH
AE Coin
```

PR #220 may resolve values or preserve `null`. Network launch, regulatory approval, fund inception, migration, rebrand, or contract deployment must not be substituted for the asset launch without matching evidence.

## Remaining non-UI quality sequence

```text
PR #220      remaining launch-date boundary review
PR #221      terminal-date and relationship-end review
PR #222      reserve applicability review
PR #223–225  evidence quality review
PR #226–229  deployment quality review
PR #230–232  review-only monitoring pipeline
```

A quality PR may resolve a value or preserve an unknown. Completion means that the evidence trail and machine-readable state are correct, not that a value was forced.

## Preserved quality queues

```text
Missing canonical launch dates:           19 after PR #219
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

No workstream may clear these queues through defaults, guesses, hiding, relabeling, or unsupported date coercion.

## Growth policy

Routine growth remains paused at 92 assets. Important new developments may be stored as review candidates, but Batch 18 and direct canonical promotion remain prohibited. A later roadmap amendment must choose the next growth and release path.

## Publication policy

```text
Automatic production deployment: disabled
Preview branch deployments: disabled
Normal implementation PR deployment: none
Emergency publication: deployment policy only
Planned publication: requires a later explicit roadmap checkpoint
Publication path: manual GitHub Actions workflow only
Production branch: main
```

Production success may be stated only after deliberate deployment, deployed-commit confirmation, and public parity verification.
