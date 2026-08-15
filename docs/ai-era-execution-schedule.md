# SOG AI-era Execution Schedule

Status: roadmap addendum

## Order
1. Finish/continue already approved SOG work; this addendum does not reset the current roadmap.
2. Audit representative assets for missing post-depeg, regulatory, redemption, compensation, migration/discontinuation and last-verification history.
3. Add only necessary schema/lifecycle representation through separately reviewed changes.
4. Ship deterministic per-asset JSON with provenance and validation.
5. Strengthen structured filters/search without changing canonical enum semantics.
6. Extend existing Compare/change surfaces with lifecycle/outcome fields.
7. Implement Stats for depeg/recovery/regulation/migration plus coverage/quality.
8. Run reviewed lifecycle follow-up batches.
9. Evaluate natural-language-to-filter translation only after deterministic search/Compare are stable.

## Gate
Spec -> PR -> CI/validation green -> merge -> production verification where applicable -> documentation/status synchronization.

## Mandatory continuation rule
Future SOG work must read `ai-era-registry-spec.md`, this schedule, and the relevant current classification/comparison/provenance specifications before selecting the next task.