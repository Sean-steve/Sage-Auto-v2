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

Run `node --check app.js && node --check company-detail.js`, then `node tests/smoke.test.js` and `node tests/company-workflows.test.js`.

## Hosting

A GitHub Pages workflow is provided at `.github/workflows/pages.yml`. Set GitHub Pages Source to **GitHub Actions** in the repository settings to deploy it.

## Status

See [the detailed P3-B architecture and limits](docs/PHASE_3B_COMPANY_OPERATIONS.md).

**Not production-ready.** Mock localStorage data only. No real booking, identity verification, compliance approval, payment, payout or authorization is performed. Do not enter personal data.

## Source of truth

Phase 1: user experience architecture. Phase 2: 11 portals, 215 screen contracts and 22 journeys. Phase 3: progressive UI reconstruction; currently a **working foundation**, not a claim that every Phase 2 screen is fully implemented.

See `docs/PHASE_3_BUILD_STATUS.md` for implemented interactions and remaining screens.
