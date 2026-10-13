# Sage Auto V2

Frontend-only, role-aware visual prototype for the Sage Auto car-hire operating system.

## Phase 3 foundation

- **11 experience surfaces**: public website, platform admin, company operations, branded rental website, renter, vehicle owner, driver, corporate customer, agent, service partner, and future marketplace.
- Premium responsive design system, operational dashboard, contextual work queues, mock rental lifecycle, cross-portal demos.
- All example data, actions and payments are **simulated**; no API, authentication or real monetary activity.
- Prior Sage Auto backend and database remain untouched.

## Running locally

This version is deliberately dependency-free: open `index.html` in a browser or serve the repository directory with `python3 -m http.server 4173` and visit http://localhost:4173.

## Hosting

A GitHub Pages workflow is provided at `.github/workflows/pages.yml`. Set GitHub Pages Source to **GitHub Actions** in the repository settings to deploy it.

## Source of truth

Phase 1: user experience architecture. Phase 2: 11 portals, 215 screen contracts and 22 journeys. Phase 3: progressive UI reconstruction; currently a **working foundation**, not a claim that every Phase 2 screen is fully implemented.

See `docs/PHASE_3_BUILD_STATUS.md` for implemented interactions and remaining screens.
