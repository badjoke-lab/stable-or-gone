# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: REVIEW_GATE
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/compare-logo-phase-e-closeout.json
Current closeout spec: docs/quality/compare-logo-phase-e-closeout-spec.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-phase-e-closeout.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Additional logo promotions authorized: no
New public route family authorized: no
Ranking / scoring / recommendation authorized: no
Automatic continuation: false
Official public origin: https://www.stableorgone.com
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

No new implementation begins from this gate without a fresh reviewed authority.

## Current canonical counts

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Canonical Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 471
Archive not recorded: 114
Detail routes: 422
Metadata-checked routes: 422
```

## Historical non-UI acceptance checkpoints

These are retained baseline lineage, not standing implementation authority:

```text
PR #493 — migrated SOG to https://www.stableorgone.com as the single official production origin
PR #500 — deepened the bounded MNEE Evidence/archive/control review without forcing unsupported unknowns closed
PR #517 — added complete canonical Bison Bank EUB/USB records and established the 119-asset / 186-deployment checkpoint lineage
```

They remain referenced by workstream-independent release validation. Their presence does not authorize reopening those scopes.

## Current Stablecoin mark contract

The completed Compare/logo maintenance lane leaves this accepted public state:

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral monogram fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: no
Canonical delta: 0
```

The maintenance authority itself is closed. The display result and permanent regression/record-growth rules remain binding.

## Phase E closeout evidence

```text
Phase D merged main: bb72108ea53d96a69db42d5c8e97df47033be44e
Production workflow run: 31585897410 — success
Production job: 94079531335 — success
Exact-main screenshot run: 31585897478 — success
Exact-main screenshot job: 94079532861 — success
All-record mark catalog: 119 cards / 101 direct / 18 fallback
Broken images: 0
Empty frames: 0
```

Phase E also strengthens `scripts/capture-stablecoin-mark-mix.mjs` so desktop and mobile explicitly pin:

```text
mnee       -> logo
usdgo      -> logo
usr        -> logo
acala-ausd -> fallback
```

The closeout PR must pass that targeted browser regression and the existing Compare visual acceptance workflow. The post-merge exact-main screenshot workflow must also remain green.

## Permanent future record-growth logo gate

Core `.github/workflows/ci.yml` runs:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request without data-path exclusions.

Every future canonical Stablecoin addition must satisfy:

```text
docs/quality/stablecoin-logo-disposition-operating-spec.md
```

Blocking invariants include:

```text
reviewed logo decision count == canonical Stablecoin count
every canonical Stablecoin slug has exactly one reviewed disposition
direct-logo assets exist locally and resolve consistently
neutral fallbacks are explicit in display policy
resolver direct set equals reviewed direct-logo set
orphan logo assets are rejected
```

A neutral fallback is valid. Missing disposition is not. Data-only record growth cannot bypass this gate.

## Enduring Compare behavior

The accepted Phase C behavior remains a regression contract:

```text
control: Hide matching rows
differing attribute count: visible
matching shown/hidden count: visible
no-op copy: All displayed attributes already differ. Nothing to hide.
Compare marks: same pre-rendered StablecoinMark result used elsewhere
Compare-only logo map: none
remote runtime fetch: none
```

Do not regress 2–4 selection, fifth-selection rejection, URL order/history restoration, explicit `Unknown` / `Not recorded`, bounded mobile matrix scrolling, or accepted Compare dock/footer behavior.

## Completed Compare/logo maintenance lineage

```text
PR #554 — Phase A authority/specification/schedule
PR #555 — Phase B exact 21-fallback reviewed result
PR #556 — Phase C Compare feedback / mark implementation
PR #557 — Phase D mnee/usdgo/usr import + permanent future-growth gate
Phase E closeout — exact-main verification + targeted mark regression + REVIEW_GATE restoration
```

These PRs are historical authority lineage, not an open work permit.

## Required work-start protocol from REVIEW_GATE

Before any substantive new work:

1. Read `AGENTS.md`, `docs/spec-governance.md`, `docs/roadmap.md`, and `docs/deployment-policy.md`.
2. Read `config/compare-logo-phase-e-closeout.json` and its quality/roadmap closeout documents when work touches Compare or Stablecoin marks.
3. Read the relevant permanent operating specification and enduring regression authority.
4. Confirm current `main`, canonical counts/hash, open PRs, and current production state.
5. Create a fresh reviewed authority that states scope, canonical/public boundary, acceptance artifacts, and closeout behavior.
6. Do not infer authority from chat instructions or historical PRs.

## Preserved exclusions at this gate

No current authority exists for:

```text
canonical archive mutation
canonical Market Access mutation
new Evidence identities or Evidence Relations
stable-asset additions/deletions
schema/taxonomy change
additional logo promotion
new public route family
ranking / scoring / recommendation
unrelated sitewide redesign
infrastructure/DNS migration
automatic continuation
```

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
