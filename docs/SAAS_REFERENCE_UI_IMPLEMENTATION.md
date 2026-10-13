# Sage Auto V2 — Reference-Informed UI/UX Upgrade

**Date:** 13 October 2026  
**Repository:** Sean-steve/Sage-Auto-v2 · main  
**Scope:** Functional visual upgrades of seven high-use company surfaces. Frontend/browser-local demo only.

## Source principles applied

This update uses [the five-reference study](DESIGN_REFERENCES_SAAS_2026.md): Dribbble for editorial composition and tactile polish; Ubrain for user-first task flow and information hierarchy; Fuse for a consistent filtering and component grammar; VenueX for an operational lifecycle; Skote for clean dense administrative actions and mature record views.

**No third-party template code or copyrighted assets were copied.** These are original Sage Auto components, implemented with native HTML/CSS/JS and existing mock stores.

## Updated screens and what is now interactive

| Module | Rebuilt visual pattern | Connected actions / mock state |
|---|---|---|
| **Availability** | Seven-day vehicle allocation board, pinned vehicle column, semantic day/status tiles, legend, branch and vehicle filters, selected-day details and holds below the board | Navigate weeks, select car/date, inspect booking context, open reservation or hold drawer, release a hold; uses shared mock holds, readiness, and bookings |
| **Bookings** | Kanban-style reservation pipeline following enquiry → booking → payment → verification → contract → handover → rental → return | Filter stages, search customer/car/reference, inspect reservation, transition via existing guarded payment/handover/return workflow |
| **Inspections** | Top-down vehicle condition illustration with exterior/glass/wheel/cabin hotspots and grouped review categories | Select a condition zone; open the existing mandatory 12-item form; inspect logged passed/defect records |
| **Finance & payments** | Reconciliation view with recorded-receipt summary, sample balance progress, pending-payment queue, and clean Payments/Invoices/Deposits/Expenses registers | Payment review, manual receipt drawer, expense/deposit recording, refund review, invoice/booking quick view and owner settlement navigation |
| **Pricing** | Vehicle pricing gallery plus adjustable rental quote preview | Change vehicle and example rental days, see estimated subtotal, edit base rate or start reservation |
| **Returns & charges** | Physical return work queue, vehicle cards, return-stage ribbon, charges and completed returns | Open existing return checklist, record return, inspect closing summary |
| **Owner settlements** | Owner payout queue with status, share context and four-step settlement explainer | Open settlement review/statement and existing mock payout workflow |

The original P3-B/C/D.2 modules remain in the codebase. This is presentation composition through `SageReferenceV2`; it deliberately does not replace payment, availability, booking, signature, tenant or compliance backend contracts.

## Shared UX improvements

- **Domain-first visualization:** different work deserves different UI. Availability needs a calendar, bookings need a stage-based work queue, inspections need a vehicle condition map, and finance needs a reconciliation dashboard.
- **Obvious next actions:** every screen has a purpose statement, one primary CTA, contextual sub-actions and status-specific help.
- **Accessible interactions:** real buttons with labels, aria-pressed states, table column/row semantics, keyboard-scrollable grids, readable statuses with text and reduced-motion support.
- **Responsive behavior:** tablet/mobile layout changes, horizontal scroll intentionally contained inside grids, sticky vehicle labels, mobile-card friendly financial records and sized touch controls.
- **Safeguards:** all values identified as illustrative. Physical return remains separate from financial closure. No mock payout is claimed to be actual money transfer; condition illustration isn't treated as evidence.

## Quality gates

- `node --check reference-experience.js`
- `node tests/reference-experience.test.js`
- All previous Node prototype suites continue to run in GitHub Pages CI.
- `tests/p3e-browser-qa.cjs` now captures seven additional operational screens at 360/390/768/1024/1440px, via **GitHub Actions → Premium UI · Browser Visual Review**.

**Visual acceptance is not automatically certified:** browser-based screenshots have been configured but must still be generated and reviewed. No real backend, authentication, payment API, verified images or role-scoping service is connected.

## New files

- `reference-experience.js` — seven distinct experience renderers and stateful UI controls.
- `reference-experience.css` — responsive automotive SaaS workflow design patterns.
- `tests/reference-experience.test.js` — route, filtering and critical action regression checks.

Integration changes were limited to `index.html`, `premium-experience.js`, `app.js`, the Pages/visual QA workflows and supporting documentation.

## Follow-through after screen review

1. Complete visual screenshots and keyboard checks for each new screen on desktop/tablet/phone.
2. Convert remaining generic screens using the same task-specific design grammar, prioritizing maintenance, handover, document evidence, subscriptions and corporate approvals.
3. Keep Phase 4 read-only backend audit and Phase 5 mapping separate from the design reconstruction. Real roles, storage, tenancy, money movements and physical asset states must come from verified backend contracts.

## Preview

Pull main and start a static server:

```bash
git checkout main
git pull origin main
python3 -m http.server 4173
```

Open `http://localhost:4173/#company/Availability`, then try **Bookings**, **Inspections**, **Finance & payments**, **Pricing**, **Returns & charges**, and **Owner settlements**.
