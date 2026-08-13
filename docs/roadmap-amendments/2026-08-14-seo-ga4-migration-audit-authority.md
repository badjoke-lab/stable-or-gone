# Roadmap Amendment — SEO / GA4 Custom-Domain Migration Audit

Date: 2026-08-14  
Status: active after authority merge

## Entry gate

The repository enters this bounded lane from `REVIEW_GATE` at main `3c715fa77d9e92d52d7646f6e6e944a43d7f5ea9`. The latest exact-main production deployment at entry is run `31588746719`, which succeeded.

## Goal

Finish the operational verification of the already-completed move from `sog.badjoke-lab.com` to `www.stableorgone.com`, and repair only the deployment plumbing required to preserve the existing SOG GA4 measurement in static production builds.

## Sequence

```text
Phase A — authority/specification/schedule merge
Phase B — repository + live origin/redirect/analytics audit
Phase C — bounded GA4 production-build wiring/validation if required
Phase D — exact-main production verification
Closeout — restore REVIEW_GATE; no automatic continuation
```

## Boundaries

Canonical data delta is zero. No DNS or Cloudflare-account mutation, new GA4 property/Measurement ID, new public route family, archive/Market Access change, ranking/scoring/recommendation change, or unrelated UI work is authorized.

Google Search Console account actions may be documented and verified only if direct account evidence is available. Repository state alone must not be represented as proof that GSC ownership, Change of Address, or sitemap submission is complete.

## Acceptance

The lane closes only when official-origin outputs are internally consistent, the legacy redirect contract is verified as far as current network access permits, the existing GA4 build injection path is correctly wired and checked when configured, CI passes, and exact merged main is production-verified.
