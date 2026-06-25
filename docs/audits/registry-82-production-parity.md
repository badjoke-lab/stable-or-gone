# Registry 82 Production Parity

Recorded: 2026-06-25

Result: PASS

Production commit: `835a00d5cd2db48c0a0ede3394cf265dec919813`

Verification workflow run: `27908380603`

Successful verification job: `83360065881`

Canonical records: 82

## Verified production state

- the deployed build commit matches the latest `main`
- primary stable-asset count is 82
- supporting organization, relationship, event, evidence, reserve-report, deployment, known-unknown, and regulatory-note counts are internally consistent
- the GENIUS Act guide is published at `/guides/genius-act-stablecoins/`
- the MiCA guide is published at `/guides/mica-stablecoins/`
- the JPYC versus JPYSC guide is published at `/guides/jpyc-vs-jpysc/`
- the three guides carry the first-publication date `2026-06-25`
- mapped stablecoin records expose related-guide links
- homepage, Updates, sitemap, canonical metadata, and structured data passed the production check
- `version.json`, `data/manifest.json`, `llms.txt`, and `ai.txt` passed the production consistency check
- full repository build, Cloudflare Pages upload, deployed-production verification, and deployment summary all completed successfully

## Publication repair history

The first rerun uploaded the 82-record build but exposed a mismatch between the historical workflow run SHA and the latest `main` checked out by the job. PRs #136, #137, and #138 aligned generated build metadata and final validation with the actual checked-out source commit. The final rerun completed successfully.

## Gate

The 82-record production gate is complete. The next bounded work item is the DOLA launch-boundary audit. Controlled growth may resume only through the roadmap's alternating quality-and-growth cycle and remains limited to five complete stable-asset records per batch.
