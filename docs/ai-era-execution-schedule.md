# SOG AI-era Execution Schedule

Status: roadmap addendum  
Updated: 2026-08-20

## Current checkpoint

Ledger Series Phase 3 completed the deterministic public-surface strengthening for schedule items 2–7. The later cross-registry Ledger Series Phase 9 Stage 3 adapter added and production-verified the canonical-only Series projection, then returned the repository to `REVIEW_GATE`.

```text
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/ledger-series-phase9-closeout.json
Verified Phase 9 adapter main: bd84caf11e2decd0250260bbfe2551e42b6a955f
Phase 9 production verification: success
Series records: 119
Series JSON production equality: 121 / 121
Canonical delta: 0
Schema/taxonomy delta: 0
Automatic continuation: false
```

The Phase 9 adapter is an additive cross-registry machine-readable projection; it does not alter the local SOG AI-era work order below. Items 8 and 9 remain future roadmap candidates only. They are not authorized by the completed Phase 3 or Phase 9 adapter authorities and require a fresh reviewed authority before implementation.

## Order
1. Finish/continue already approved SOG work; this addendum does not reset the current roadmap.
2. Audit representative assets for missing post-depeg, regulatory, redemption, compensation, migration/discontinuation and last-verification history. **Phase 3: complete.**
3. Add only necessary schema/lifecycle representation through separately reviewed changes. **Phase 3 decision gate: complete; no schema/canonical mutation required.**
4. Ship deterministic per-asset JSON with provenance and validation. **Phase 3: complete.**
5. Strengthen structured filters/search without changing canonical enum semantics. **Phase 3 bounded extension: complete.**
6. Extend existing Compare/change surfaces with lifecycle/outcome fields. **Phase 3 bounded extension: complete.**
7. Implement Stats for depeg/recovery/regulation/migration plus coverage/quality. **Phase 3: complete.**
8. Run reviewed lifecycle follow-up batches. **Not currently authorized; fresh authority required.**
9. Evaluate natural-language-to-filter translation only after deterministic search/Compare are stable. **Not currently authorized; fresh authority required.**

## Cross-registry Phase 9 adapter checkpoint

```text
Authority PR #578: complete
Implementation PR #579: complete
Production verifier PR #580: closed without merge after acceptance
/data/series/registry.json: complete
/data/series/index.json: complete
/data/series/records/{slug}.json: 119 / 119
Native dossier lossless parity: complete
Typed Series relationship inference: deferred / not authorized in Stage 3
Exact-main production verification: complete
Closeout / REVIEW_GATE restoration: complete after closeout merge
```

## Gate
Spec -> PR -> CI/validation green -> merge -> production verification where applicable -> documentation/status synchronization.

Phase 3 satisfied this gate through exact-main production verification and closeout synchronization. The Phase 9 adapter independently satisfied the same gate for its bounded `/data/series/` scope. Completion of either lane does not create authority for the next roadmap item.

## Mandatory continuation rule
Future SOG work must read `ai-era-registry-spec.md`, this schedule, `AGENTS.md`, `docs/spec-governance.md`, `docs/roadmap.md`, `docs/deployment-policy.md`, and the relevant current classification/comparison/provenance specifications before selecting the next task.

From `REVIEW_GATE`, substantive work additionally requires a fresh reviewed authority defining scope, canonical/public boundaries, acceptance evidence, and closeout behavior.
