# Sage Auto V2

Frontend-only, role-aware visual prototype for the Sage Auto car-hire operating system.

## Phase 3 · P3-B company reconstruction

- **11 experience surfaces**: public website, platform admin, company operations, branded rental website, renter, vehicle owner, driver, corporate customer, agent, service partner, and future marketplace.
- Premium responsive design system and task-focused operational dashboard.
- P3-B: **24 dedicated company screens** for fleet, ownership, people, inspections, pricing, availability, contracts, returns, payments, settlements, documents, branches, team management, security and growth.
- Browser-local mock workflows: vehicle registration, compliance/media references (file-name or URL), service holds, manual payment receipts, handover checklist, return charges, owner payouts and website preview.
- 12-item mandatory vehicle checklist, booking conflict warnings that name vehicles, and separate rental-return vs. finance-review states.
- Role-specific experience previews for other portals; their complete flows are **not finished** (P3-C).
- All example data, actions and payments are **simulated**; no API, authentication or real monetary activity.
- Prior Sage Auto backend and database remain untouched.

## Running locally

This version is deliberately dependency-free: open `index.html` in a browser or serve the repository directory with `python3 -m http.server 4173` and visit http://localhost:4173.

## Quality checks

Run `node --check app.js && node --check company-detail.js`, then `node tests/smoke.test.js` and `node tests/company-workflows.test.js`, `node tests/company-edge-cases.test.js` and `node tests/external-portals.test.js`.

## Hosting

A GitHub Pages workflow is provided at `.github/workflows/pages.yml`. Set GitHub Pages Source to **GitHub Actions** in the repository settings to deploy it.

## Phase 3-C · External experiences

The role-aware prototype now includes dedicated interface flows for SaaS platform administrators, renters, independent vehicle owners, chauffeurs, corporate customer approvers, brokers/agents, service partners, the Sage Auto marketing site, operator-branded storefronts and a **future-concept marketplace**. The screens use shared browser-local example records; actions such as extension requests, corporate approvals, agent referrals and service updates have meaningful cross-portal effects without pretending to confirm bookings or transfer money.

- [P3-C user flows and cross-portal contracts](docs/PHASE_3C_EXTERNAL_USER_EXPERIENCES.md)
- [P3-B company operations](docs/PHASE_3B_COMPANY_OPERATIONS.md)
- New test suite: `node tests/external-portals.test.js`

## Phase 3-D.2 · Gap-closure frontend and visual QA

- **215 planned screen contracts** have at least a mock or partial design route: **129 interactive mocks, 86 partials, 0 without an interface**.
- Added guided operator signup, branded rental checkout review, booking amendment requests, dispatch, availability policy, offers, refund approvals, invoice detail, tenant provisioning/governance and subscription lapse/recovery previews.
- **No production API, identity verification, real account provisioning, payment provider, tenant isolation or event worker is connected.**
- [Gap-closure and visual QA report](docs/PHASE3D2_GAP_CLOSURE_REPORT.md)
- [GitHub Actions visual evidence](https://github.com/Sean-steve/Sage-Auto-v2/actions/workflows/visual-qa.yml) · Chromium screenshots at five viewport widths plus axe WCAG scan. The workflow must finish and its screenshots/defects be reviewed before declaring visual signoff.
- Run npm run test:mock for the simulation suite, or npm run test:visual and npm run test:accessibility after installing Playwright and starting the local static server.

## Reference-informed operational UI/UX upgrade

Following the five-source SaaS UI/UX study, **seven core operational screens** now use workflow-specific visuals rather than generic dashboard tables: **Availability board, Bookings pipeline, Inspection condition studio, Finance reconciliation, Pricing quote lab, Returns work queue and Owner Settlements**. Actions remain connected to the existing browser-local mock workflows.

- [Implementation guide and limitations](docs/SAAS_REFERENCE_UI_IMPLEMENTATION.md)
- [Design principles and external references](docs/DESIGN_REFERENCES_SAAS_2026.md)
- Validation: `node tests/reference-experience.test.js`
- Responsive browser screenshots: GitHub Actions → **Premium UI · Browser Visual Review**. Visual sign-off still requires review of actual rendered captures.

**No production backend, payments, signatures, real availability or RBAC were introduced.**

## Design inspiration & quality standards

Future UI/UX work must use the [Sage Auto SaaS Design Reference Study](docs/DESIGN_REFERENCES_SAAS_2026.md): learn visual polish from Dribbble, workflow simplicity from Ubrain, scalable patterns from Fuse, lifecycle coherence from VenueX, and admin maturity from Skote. Do not copy copyrighted template assets or sacrifice functional workflows for decoration.

## Phase 3-E · Premium Automotive Visual Reconstruction

The V2 experience now has a distinctive, automotive-first visual language—not just a restyled KPI dashboard. The premium cockpit includes a dynamic company operations queue, fleet composition ring, image-forward vehicle spotlight, photo-backed public covers, redesigned fleet gallery and role-specific home presentation.

**Try it:** [Company cockpit](https://github.com/Sean-steve/Sage-Auto-v2) · open local route #company/Overview after starting the static server. Explore **Fleet** gallery/list filters and **New booking** vehicle chooser with a responsive price preview.

- [P3-E design and implementation details](docs/PHASE3E_PREMIUM_VISUAL_RECONSTRUCTION.md)
- Premium Node tests: **node tests/p3e-experience.test.js**
- On-demand visual screenshots: **GitHub Actions → Premium UI · Browser Visual Review → Run workflow** (not yet visually signed off)
- Car images are **illustrative remote editorial photographs**, not verified fleet asset photography; inline SVG vehicles act as fallback.

**No production backend integration.** Existing mock rental contracts, payments, owners, tenants and permissions remain illustrative.

## Phase 3-D.2 · Gap closure and visual validation status

[Gap closure and visual acceptance report](docs/PHASE3D2_GAP_CLOSURE.md) documents the implemented mock onboarding, checkout, company and platform flows. The updated 215-screen ledger now maps **129 interactive mock contracts, 86 partial contracts, and 0 wholly unmapped contracts**. This is **not** design-complete sign-off: browser-rendered screenshot inspection and manual WCAG review remain pending, and the 86 partial contracts need deeper finishing.

Run the P3-D.2 route/interaction suite with `node tests/p3d2-gap-closure.test.js`.

## Phase 3-D · UI/UX reconciliation and audit

The original **215-screen Phase 2 inventory**, **22 cross-user journeys**, and **45-screen previous company workspace** have been reconciled in:

- [P3-D UI/UX audit and acceptance gates](docs/PHASE3D_UIUX_AUDIT.md)
- [215-screen coverage matrix](docs/PHASE3D_SCREEN_COVERAGE.csv)
- [22-journey reconciliation](docs/PHASE3D_JOURNEY_RECONCILIATION.csv)
- [Previous 45-screen crosswalk](docs/PHASE3D_LEGACY45_CROSSWALK.csv)

**Historical P3-D baseline:** 113 interactive mock contracts, 82 visual/partial, 20 not implemented (superseded by the P3-D.2 report). **Not signed off**: critical onboarding/checkout/platform screens and real-browser visual & accessibility checks remain outstanding.

P3-D added renter and driver incident reports → company incident triage, an accessible skip link, public page main landmarks, dialog focus management and motion/keyboard improvements. Run `node tests/p3d-quality.test.js` for the audit regression checks.

## Status

See [the detailed P3-B architecture and limits](docs/PHASE_3B_COMPANY_OPERATIONS.md).

**Not production-ready.** Mock localStorage data only. No real booking, identity verification, compliance approval, payment, payout or authorization is performed. Do not enter personal data.

## Source of truth

Phase 1: user experience architecture. Phase 2: 11 portals, 215 screen contracts and 22 journeys. Phase 3: progressive UI reconstruction; currently a **working foundation**, not a claim that every Phase 2 screen is fully implemented.

See `docs/PHASE_3_BUILD_STATUS.md` for implemented interactions and remaining screens.
