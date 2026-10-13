# Sage Auto V2 — P3-E Premium Visual Experience Reconstruction

**Date:** 13 October 2026
**Repository:** [Sean-steve/Sage-Auto-v2](https://github.com/Sean-steve/Sage-Auto-v2)
**Branch:** main
**State:** Premium visual reconstruction implemented on major experiences. NOT a production release or blanket 215-screen redesign.

## Creative direction

**Automotive atelier meets an intelligent operations cockpit.** The goal is a distinctive automotive identity that improves task clarity: vehicles take visual priority, actions are visible, and each actor gets a purpose-built welcome without breaking existing workflows.

Design system: deep eucalyptus #102c28, meaningful operating green #276d57, warm canvas #f5f6f3, restrained sage-lime #d7eba9, Plus Jakarta Sans headings, DM Sans body and Instrument Serif for editorial hero emphasis. Soft layering, typography and illustrated vehicle photography replace the repetitive generic-card aesthetic. Motion respects reduced-motion preferences.

## Completed premium UX surfaces

| Experience | Visual reconstruction | Interactive enhancements |
|---|---|---|
| Company command centre | Hero cockpit, operational activity feed, fleet composition ring, vehicle spotlight, priorities and actions | All/Pickups/On rental/Payments queue; next/previous featured car; contextual booking actions |
| Fleet | Image-forward gallery, pricing, condition, ownership and location | Status filters, gallery/list views, asset quick-views and inspection; browser-persisted layout |
| Booking drawer | Three-step guide, vehicle chooser and rental estimate | Change vehicle and duration without losing entered form details; existing validation preserved |
| Renter | Premium personal garage welcome | Linked active rental, bookings, payments, assistance |
| Vehicle owner | Portfolio/earnings themed welcome | Continue to assigned vehicles, agreements and settlements |
| Driver | Blue-toned mobile-focused cockpit | Assignment and duty-state entry points |
| Corporate | Executive mobility theme | Requests and approvals |
| Agent | Growth-oriented sales identity | Referrals and commissions |
| Service partner | Workshop themed experience | Jobs, progress and evidence |
| Platform admin | Network operations identity | Companies, approvals and governance |
| Marketing, company-branded site, future marketplace | Cinematic editorial vehicle covers and decisive CTAs | Feature discovery, branded checkout request, marketplace browse |

## Visual and safety rules

1. Photographs are **illustrative editorial assets from remote Unsplash URLs**, not verified pictures of the mock registered vehicles. Always label them; production must replace them with confirmed vehicle images and correct rights records.
2. The existing inline vector vehicle illustrations provide a structural fallback when third-party images are unavailable.
3. No actual reservations, payments, identity verification, owner payouts, tenant provisioning, or emergency dispatch are performed.
4. Retain Phase 1–3 UX contracts, company backend separation and user-side journey state distinctions.
5. Primary actions must be usable on mobile; status labels cannot rely on color alone.

## Implementation source

- **premium-experience.js** — React-free UI composition layer and stateful dashboard, gallery, portal and storefront interactions.
- **premium-experience.css** — premium token palette, typography, layouts, focus states, animation limits and responsive breakpoints.
- **app.js** — minimal hooks routing the premium layer into existing workflows.
- **index.html** — loads both new source files after existing modules/styles.
- **tests/p3e-experience.test.js** — interactive no-dependency mock workflow checks.
- **tests/p3e-browser-qa.cjs** — optional Playwright browser screenshot and overflow tester.
- **.github/workflows/visual-review.yml** — manual workflow that captures real browser screenshots at desktop, tablet, 390px and 360px widths.
- **.github/workflows/pages.yml** — syntax/tests and static publishing include premium assets.

## Visual validation

Mocked-DOM and syntax checks verify navigation, booking controls and work-state continuity. Browser-rendered screenshots have **not yet been visually approved** in this session. Use GitHub Actions → Premium UI · Browser Visual Review → Run workflow to produce the screenshot artifact. Actual browser QA must review:

- 1440px command centre, fleet, booking, public showroom.
- 1024px admin controls.
- 768px fleet/calendar and owner.
- 390px and 360px booking drawer, renter, driver and storefront.
- 200% zoom, focus trapping, WCAG contrast, screen-reader label quality, image loading and slow-network fallback.

Do not declare these checks passed until screenshot artifacts have been reviewed and outstanding defects resolved.

## Production readiness

P3-E is a premium presentation layer. It does **not** complete every individual Phase 2 screen contract. The 86 partial contracts tracked in P3-D.2 still require deeper interaction/visual acceptance where applicable. Phase 4 should audit the original backend read-only, preserving every existing capability.

## Preview

From the local repository run:

    git checkout main
    git pull origin main
    python3 -m http.server 4173

Open http://localhost:4173/#company/Overview, then try Fleet, New booking, and the workspace switcher.
