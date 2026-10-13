# Sage Auto V2 — P3-D.2 Design Gap Closure & Visual QA Handoff

**Date:** 13 October 2026  
**Branch:** main · **Project:** Sean-steve/Sage-Auto-v2  
**Status:** Missing-route design closure implemented. Automated mock regressions pass. Final browser/design signoff remains conditional.

## Executive outcome

The P3-D baseline had **20 planned screen contracts without a meaningful interface**. Phase P3-D.2 added navigable mock experiences for all 20, plus five additional company/platform routes.

| 215-screen ledger status | P3-D baseline | P3-D.2 |
|---|---:|---:|
| Interactive mock | 113 | **129** |
| Visual / partial | 82 | **86** |
| Not implemented | 20 | **0** |
| **Total** | **215** | **215** |

**Interpretation:** every original contract now has a design route or a partial preview. **86 are still partial**. Interactive mocks are NOT production features. The original 45 company screens remain mapped: 20 with all mapped contracts at interactive-mock level and 25 containing incomplete mapped contracts.

## New screen contracts addressed

**SaaS acquisition (6):** S01-04 guided tour; S01-10 demo email verification; S01-11 company profile; S01-12 plan selection; S01-13 first-run guidance; S01-14 sign-in/recovery preview.

**Platform Control Center (9):** S02-04 tenant provisioning; S02-09 entitlement review; S02-10 integration health; S02-11 jobs/events; S02-12 platform incidents; S02-13 roles; S02-15 controlled support access request; S02-17 platform policies; S02-20 notifications.

**Company Operations (4):** S03-17 booking amendments and cancellations; S03-31 professional driver dispatch; S03-46 booking availability policies; S03-49 rates/offers.

**Branded rental storefront (1):** S04-07 vehicle selection, quote, customer details, review, acknowledged non-binding request.

**Additional deepened UX (5):** Company launch checklist, Invoice detail, Refund approvals, Company subscription status, Platform subscription recovery.

## Cross-user prototype contracts

1. Renter checkout reviews car, date, contact and indicative price, then creates an operator lead; no booking or payment.
2. Operator booking change produces a pending request; approve in principle/decline cannot silently alter signed dates, pricing or allocations.
3. Chauffeur assignment becomes visible to the driver's workspace, but does not affect confirmed vehicle handover.
4. Availability buffer/lead-time policies remain browser-local examples; production enforcement needs the backend.
5. Promo codes can be created/previewed but do not automatically discount payments or historical invoices.
6. Refund review/approval never initiates a transfer or marks a payment provider success.
7. Finance detail shows base rent, extras, recorded receipts and unpaid balance; it is not a legal tax invoice.
8. SaaS signup simulates account, example verification, business profile, plan and first-run checklist; it never provisions an actual company or sends an OTP.
9. Platform governance shows fictional jobs/integration status, support requests, roles, policy and notices; no real worker, permission or tenant access.
10. Subscription lifecycle shows past due, grace, restricted-service preview and restoration, with no actual plan cutoff or external billing integration.

## Visual design and responsiveness

The P3-D.2 shared frontend includes stepper navigation, contextual review drawers, governance cards, checkout summary, plan comparisons and operating checklists. It keeps the existing navy/teal Sage Auto design system, keyboard focus styling and reduced-motion support. Public, dashboard and checkout headers were refined for compact widths.

### Real-browser validation — NOT YET CERTIFIED

A new GitHub Actions workflow is configured:
https://github.com/Sean-steve/Sage-Auto-v2/actions/workflows/visual-qa.yml

- Chromium visual audit visits **11 experience home screens + 25 new gap routes**, at **360, 390, 768, 1024, 1440 px**: **180 browser checks**.
- Captures **105 screenshot images** (11 main experiences at five widths; 25 gap routes at desktop and mobile).
- Checks visible main landmark, heading, JavaScript page errors and horizontal document overflow.
- Axe-core automated WCAG A/AA checks cover 16 representative pages at desktop/mobile: **32 accessibility analyses**, with severity and affected elements recorded.
- Uploads a **sage-auto-p3d2-visual-audit** artifact, containing PNG screenshots and JSON reports.
- The accessibility step remains non-blocking while its findings are being triaged; this is NOT an assumed pass.

**The actual GitHub Actions browser-run result has not been observed and verified from this chat.** Workflow configuration and mock tests are not equivalent to desktop/mobile visual signoff. Human review of screenshots, density, hierarchy, legibility, contrast, error states and navigation remains necessary.

## Automated mock QA

All current JavaScript syntax and six simulated-DOM suites passed in the tool-based regression harness:
- tests/smoke.test.js
- tests/company-workflows.test.js
- tests/company-edge-cases.test.js
- tests/external-portals.test.js
- tests/p3d-quality.test.js
- tests/p3d2-gap-closure.test.js

GitHub Pages workflow validates and publishes the new static gap-closure JS/CSS alongside the original prototype when deployment is enabled.

For browser QA locally: install Node dependencies (npm install), install Playwright Chromium (npx playwright install chromium), launch the static server (python3 -m http.server 4173), and run npm run test:visual and npm run test:accessibility. Review artifacts/visual-audit for evidence.

## Remaining design debt

**86 partial contract screens remain.**

### Must close before UX signoff
- Realistic signup and account recovery error/resumption states.
- Rental amendments and cancellations: conflict recheck, repricing, signing, acknowledgement, refunds.
- Checkout success/failure/payment retries and booking confirmation.
- Precise platform worker, entitlement and support-grant failure states.
- Tenant and branch permissions, access-denied and privacy-sensitive paths.

### Domain deepening
- Signed contracts/PDF preview, media evidence, inspection/damage disputes.
- Owner payout calculations, chauffeur allocation conflicts, corporate approvals and service signoff.
- Availability policies and offers reflected across quotes/holds/extensions.
- Better mobile financial tables/calendars and consistent empty/loading/offline patterns.

### Visual acceptance still open
- Inspect Chromium screenshot artifact and fix layout issues.
- Resolve axe findings, manually test keyboard/screen readers/contrast/mobile touch.
- Execute all 22 journeys and 21 negative scenarios in a real browser.
- Verify GitHub Pages deployment and collect explicit design signoff.

## Next phase boundary

**Read-only Phase 4 backend discovery may start** while design issues are tracked. Do not begin Phase 5 migration as if all 215 contracts were individually finished. Preserve legacy capabilities, tenancy rules, finance controls and event audit during reconciliation.

## Evidence files

- [215-screen coverage](PHASE3D_SCREEN_COVERAGE.csv)
- [22-journey reconciliation](PHASE3D_JOURNEY_RECONCILIATION.csv)
- [45-screen crosswalk](PHASE3D_LEGACY45_CROSSWALK.csv)
- [Historical Phase 3-D baseline](PHASE3D_UIUX_AUDIT.md)

**Verdict:** Missing-route design gap closure implemented; final visual validation and feature-depth signoff remain open.
