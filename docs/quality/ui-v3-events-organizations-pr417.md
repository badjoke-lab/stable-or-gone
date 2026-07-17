# PR #417 UI v3 Events and Organizations Specification

Status: active implementation  
Implementation PR: 417  
Source review PR: 416  
Issue: 281  
Phase: PR E

## Objective

Rebuild the existing event and organization registers and detail records as bounded evidence-registry surfaces. Event pages must make impact, type, lifecycle effect, recovery, subjects, and evidence easy to interpret. Organization pages must make organization role, jurisdiction, connected stablecoins, relationship state, events, evidence, and unresolved questions easy to interpret.

No safety, incident, organization, transparency, risk, or quality score may be introduced.

## Authorized routes

```text
/events/
/event/[id]/
/issuers/
/issuer/[slug]/
```

No route addition, removal, or rename is authorized.

## Events register

- 20 records per page;
- initial server-rendered rows and mobile cards are bounded to the first page;
- visible search, sort, category, subtype, lifecycle-effect, recovery, and year controls;
- selected counts, removable active filters, clear-all, result range/count, pagination, and explicit empty state;
- URL-backed search/filter/sort/page state;
- impact and historical lifecycle effect remain separate;
- responsive desktop table and compact mobile records;
- the 390px mobile default register must remain at or below 9,000px total body height.

## Event detail

- event ID, date, category, subtype, status effect, recovery, subjects, confidence, and evidence remain separate;
- subject stablecoins and organizations link to their current records;
- structured event detail remains available when recorded;
- evidence provenance and correction paths remain visible;
- the page must not imply that historical event effect equals current lifecycle.

## Organization register

- 20 records per page;
- initial server-rendered rows and mobile cards are bounded to the first page;
- visible search, sort, taxonomy, regulatory character, jurisdiction, role, and relationship-state controls;
- selected counts, removable active filters, clear-all, result range/count, pagination, and explicit empty state;
- URL-backed search/filter/sort/page state;
- organization role/type, connected assets, relationship count/state, evidence, and confidence remain separate;
- responsive desktop table and compact mobile records;
- the 390px mobile default register must remain at or below 9,000px total body height.

## Organization detail

- public category, canonical type, legal-form state, regulatory character, jurisdiction, roles, confidence, and review state remain explicit;
- current and historical relationships remain separate;
- primary display relationship is navigation, not exclusive truth;
- connected stablecoin lifecycle and relationship state remain visible;
- organization-level events, evidence, known unknowns, and correction paths remain reachable on mobile.

## Visual system

- use evidence-registry panels, restrained borders, compact ledgers, visible filters, local table scroll, and compact mobile records;
- avoid decorative gradients and marketing-dashboard styling;
- sticky record navigation must remain keyboard operable;
- long event titles, organization names, IDs, roles, jurisdictions, and URLs must wrap or use explicit local scroll containers;
- no horizontal page overflow at 1440px or 390px;
- do not treat a 12,000px mobile register as acceptable merely because it has no horizontal overflow;
- compact mobile cards must preserve primary facts while moving secondary facts behind disclosure.

## Mandatory visual matrix

```text
Desktop /events/
Mobile  /events/
Desktop /event/sog_ev_ust_2022_05_collapse/
Mobile  /event/sog_ev_ust_2022_05_collapse/
Desktop /issuers/
Mobile  /issuers/
Desktop /issuer/circle/
Mobile  /issuer/circle/
```

The machine audit must verify route markers, visible controls, bounded initial register records, required detail sections, zero horizontal overflow, and the 9,000px mobile-register height ceiling. Missing capture, skipped audit, horizontal overflow, or mobile vertical-density failure is a hard failure. Automated rendering does not update owner approval.

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Home/stablecoin register/stablecoin dossier/guides redesigned: 0
Owner approval records changed: 0
UI completion declared: false
PR F pre-authorized: false
```

## Exit condition

PR #417 ends at `REVIEW GATE`. Guides and secondary pages remain blocked pending a separate post-PR #417 review.
