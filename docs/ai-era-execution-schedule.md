# SOG AI-era Execution Schedule

Status: roadmap addendum  
Updated: 2026-08-19

## Current checkpoint

Ledger Series Phase 3 completed the deterministic public-surface strengthening for schedule items 2–7 and returned the repository to `REVIEW_GATE`.

```text
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/ledger-series-phase3-closeout.json
Verified Phase 3 main: 6cac1ef858d35e2a8c015142f29011e4aff33fdc
Production verification: success
Canonical delta: 0
Automatic continuation: false
```

Items 8 and 9 remain future roadmap candidates only. They are not authorized by the completed Phase 3 authority and require a fresh reviewed authority before implementation.

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

## Gate
Spec -> PR -> CI/validation green -> merge -> production verification where applicable -> documentation/status synchronization.

Phase 3 satisfied this gate through exact-main production verification and closeout synchronization. Completion does not create authority for the next roadmap item.

## Mandatory continuation rule
Future SOG work must read `ai-era-registry-spec.md`, this schedule, `AGENTS.md`, `docs/spec-governance.md`, `docs/roadmap.md`, `docs/deployment-policy.md`, and the relevant current classification/comparison/provenance specifications before selecting the next task.

From `REVIEW_GATE`, substantive work additionally requires a fresh reviewed authority defining scope, canonical/public boundaries, acceptance evidence, and closeout behavior.
