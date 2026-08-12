# Compare Feedback and Stablecoin Logo Maintenance Authority

Updated: 2026-08-12  
Status: authority and schedule contract; implementation begins only after this authority is merged

## Why this lane exists

Direct product review found four connected maintenance defects that should be corrected under one bounded authority rather than as ad-hoc edits:

1. `Differences only` can be technically active while producing no visible row change and no explanation to the user.
2. Compare record headers do not show the same audited Stablecoin mark system already used in the public register and dossiers.
3. The current 119-record logo display baseline is 98 direct Stablecoin/product logos and 21 neutral fallbacks, and the fallback set now requires a fresh review rather than being treated as permanently exhausted.
4. New canonical stablecoin growth does not permanently require a reviewed logo disposition before merge. The Bison EUB/USB growth sequence demonstrated that this can leave logo review as a later repair instead of part of record-entry completeness.

This lane is maintenance only. It does not authorize canonical stablecoin, Evidence, Evidence Relation, Market Access, archive, schema, taxonomy, or route changes.

## Entry state

The repository entered this lane only after Evidence Archive Payload Verification Batch 2 was implemented by PR #552, production-verified, and closed by PR #553. The entry state is therefore the restored repository `REVIEW_GATE`, not the older pre-archive checkpoint.

```text
Entry main: e28e60beeea07a0a6dfd7af217d2c3b9ac616bbd
Canonical stable assets: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
Evidence: 585
Evidence Relations: 585
Market Access Records: 12
Archive recorded / not recorded: 471 / 114
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized: 0
```

The 21 baseline fallback slugs are frozen in `config/compare-logo-maintenance-authority.json` so the re-audit cannot silently expand or shrink its research population.

## Required sequence

### Phase A — authority and schedule

Current work.

Required outputs:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
scripts/validate-compare-logo-maintenance-authority.mjs
```

Repository entry/governance/schedule documents must point to this authority before implementation begins.

### Phase B — 21-fallback re-audit result

Review all 21 current neutral fallbacks against current attributable sources.

Required result for every record:

```text
direct_logo
or
neutral_fallback
```

Each decision must record the source, mark type, identity basis, and explicit rationale. `mnee`, `bison-bank-eub`, and `bison-bank-usb` are priority rechecks because they were added after the original 116-record logo closure and are all current fallbacks.

This phase is a reviewed research result. It must not promote a logo merely because an image exists. Stablecoin/product-specific attribution remains required.

### Phase C — Compare feedback and mark display implementation

Implement the bounded Compare changes on `/stablecoins/`:

- replace or clarify `Differences only` with wording that communicates that matching rows are being hidden;
- report differing-row count and matching-hidden count;
- when no rows can be hidden, state that all displayed attributes already differ;
- render the existing audited Stablecoin mark in each selected Compare column;
- preserve 2–4 records, URL ordering/restoration, explicit unknown/not-recorded semantics, fifth-selection rejection, dock/footer behavior, and mobile bounded matrix scrolling.

The Compare mark must reuse the existing mark/resolver semantics. No Compare-only logo table and no remote runtime image fetching.

### Phase D — eligible logo imports and permanent growth gate

Using only the reviewed Phase B dispositions:

- vendor newly accepted Stablecoin/product-specific marks locally;
- update source/provenance/license documentation;
- update display policy and resolver mappings;
- synchronize the public logo README counts with the actual 119-record policy;
- keep records without sufficient token/product attribution on the neutral fallback;
- make logo disposition a permanent blocking requirement for every future new canonical stablecoin;
- make canonical stablecoin additions trigger the logo-coverage validator;
- require logo decision count to equal canonical stablecoin count.

No fabricated substitute brand artwork is permitted.

### Phase E — visual acceptance and closeout

Before closure:

- run deterministic Compare interaction validation;
- exercise both a pair with matching rows and a pair where all displayed rows differ;
- inspect desktop/mobile Compare states with a direct logo and with a neutral fallback;
- verify no new page-level overflow or overlap;
- run all-record Stablecoin mark coverage/catalog validation;
- directly inspect changed visual artifacts rather than relying on workflow success alone;
- production-verify the accepted implementation main commit.

After closeout the repository returns to a fresh `REVIEW_GATE`. No additional canonical or UI work is automatically authorized.

## Schedule

```text
2026-08-12  Phase A — authority/specification/schedule only
next        Phase B — 21-fallback re-audit result
then        Phase C — Compare feedback + Compare mark implementation
then        Phase D — reviewed eligible logo imports + permanent growth gate
then        Phase E — desktop/mobile direct artifact review, production verification, closeout
closeout    restore repository REVIEW_GATE; no automatic continuation
```

These entries are sequencing constraints, not permission to skip a required reviewed boundary.

## Mandatory reference rule for this lane

Every subsequent branch or PR in this lane must re-read and cite at least:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
this roadmap amendment
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
config/compare-logo-maintenance-authority.json
docs/ui-v3-remediation-authority.md
```

A later phase must also cite the immediately preceding reviewed result. Chat memory, the pre-PR #553 checkpoint, or an earlier Compare PR is not sufficient authority.
