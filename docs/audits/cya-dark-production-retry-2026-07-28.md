# CYA Dark Production Retry — 2026-07-28

This bounded operations change creates a normal merged `main` push so the existing production deployment workflow publishes the CYA-derived dark registry UI.

- Canonical data changes: 0
- Public UI changes: 0 beyond merged PR #474
- Intended source UI: `f9ec182ae739f2a8663bec4188810baf1effd2cc`
- Deployment logging: Issue #475
- Required result: Cloudflare upload and production smoke verification pass
