# Batch J validation note

Batch J promotes EURA, EURCV, EURI, EURQ, and VCHF from the controlled Candidate Master.

Safety decisions:
- agEUR is retained as an alias of EURA rather than promoted as a separate asset.
- Quantoz Payments is reused for EURQ instead of creating a duplicate organization.
- VCHF reserve composition remains an explicit known unknown.
- All five assets remain active; no failure or termination status is asserted.
- Public `/stats/` remains deferred until the 70-record checkpoint.
