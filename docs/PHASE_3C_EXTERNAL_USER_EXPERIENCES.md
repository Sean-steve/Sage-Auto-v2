# Sage Auto V2 — P3-C External User Experience Reconstruction

**Date:** 2026-10-13 · **Branch:** main · **Type:** Interactive, browser-only prototype  
**Status:** First cohesive functional visual pass across all **external-role experiences**. Not all 215 Phase 2 contracts are individually implemented, and no production services are connected.

## User-side inventory

| Experience | Dedicated screens and primary interactions |
|---|---|
| SaaS Platform Control Center | Overview, Companies, Subscriptions, Approvals, Revenue, Usage insights, Support, Security & audit, Configuration; demo tenant approval, plan preview, support case |
| Renter / customer | Overview, My bookings, My rentals, Explore vehicles, Documents, Payments, Messages, Profile; scoped booking history, rental details, extension request, preferences |
| Independent vehicle owner | Overview, My vehicles, Rental activity, Earnings, Statements, Agreements, Service updates, Profile; own vehicle and settlement visibility |
| Driver / chauffeur | Overview, Assignments, Trip details, Vehicle handover, Availability, Documents, Earnings, Messages; assignment acceptance/arrival/completion, duty status, dispatch messages |
| Corporate customer | Overview, Travel requests, Reservations, Employees, Approvals, Invoices, Reports, Account settings; employee requests, internal approvals/declines, operator handoff |
| Agent / broker | Overview, New referral, Leads, Reservations, Commissions, Payouts, Partners, Profile; attributed operator lead creation, commission estimates |
| Service partner | Overview, Assigned jobs, Inspections, Work orders, Job evidence, Invoices, Messages; accept job, metadata evidence, submit progress for operator review |
| Sage Auto public marketing | Home, Why Sage Auto, Features, Pricing, Get started; subscription concept and onboarding enquiry |
| Company-branded rental storefront | Explore vehicles, Find my booking, Our services, Contact us; sample car discovery, save vehicle, submit operator enquiry, renter navigation |
| Future Sage Auto Marketplace | Discover, Browse cars, Saved vehicles, Trips, Help; differentiated future-concept discovery and enquiry |
| Company operations | P3-B workspace remains active, plus **Customer requests** and **Partner updates** inboxes for renter extension and workshop-service handoffs |

**Routing:** 70 external-role and public-route combinations tested, plus 2 newly connected company inbox pages. Pages may contain multiple UI states and drawers. This is not a statement that every architecture-design screen is finished or production-capable.

## Cross-portal experience contracts

1. **Renter ⇄ operator bookings:** renter only sees sample bookings for the example profile (Amina Wanjiku); extension requests appear in the operator **Customer requests** inbox. The company can approve *in principle* or decline, but neither action silently alters dates, charges or possession.
2. **Owner ⇄ operator fleet/finance:** owner sees only the vehicle under the sample owner agreement (Mary Wambui / Toyota Prado TX) and matching booking/statement records. Other renters' personal names are deliberately not shown in owner activity.
3. **Driver ⇄ operator trip workflow:** assignment status can progress *Assigned → Accepted → At pickup → Completed*. These updates do not alter rental contract, booking payment, vehicle possession or operator handover.
4. **Corporate ⇄ operator lead pipeline:** staff travel request starts *Awaiting approval*. An authorized **demo** approval creates an operator lead, not an allocation, charge, invoice or booking.
5. **Agent ⇄ operator pipeline:** new referral creates a company lead with attribution; illustrative commission is never treated as settled.
6. **Service partner ⇄ operator maintenance:** partner can accept a work order and attach filename/URL metadata. These updates appear in the operator **Partner updates** inbox. Evidence acknowledgement does **not** close the operator work order or restore a rental vehicle.
7. **SaaS platform ⇄ tenant accounts:** the platform admin can review and mark a tenant Active in mock state, with no actual tenant, website, payment or subscription provisioning.
8. **Operator storefront ⇄ company lead pipeline:** public rental enquiries create leads, not confirmed reservations. Branded storefront reads example fleet states and brand name/headline from P3-B Website Studio.
9. **Marketing ⇄ platform onboarding:** prospect sign-up produces an enquiry record rather than activating a plan.

## Technical architecture

- **external-portals.js:** mock collections, 10 external/public experience renderers, contextual review drawers, form validation and role-specific action handlers.
- **external-portals.css:** shared exterior patterns and responsive layouts for marketing, renters, owners, staff, agents and partners.
- **app.js:** unchanged underlying company business data structures; intercepts external portal routing, modal rendering, actions and public site views.
- **company-detail.js:** P3-B company operations remain authoritative for the **demo's** business state transitions; external experiences do not bypass its confirmed/active/returned status rules.
- **localStorage:** carries fictional shared records between role previews in a single browser only. Refresh works; resetting the demo resets all extensions as well.

## Design principles and privacy boundary

- Each user sees their own tasks, status and next actions rather than a clone of the company workspace.
- Status text explicitly distinguishes *enquiry, internal approval, reservation, payment, handover, service update and settlement*.
- Most actions open contextual drawers; no surprise navigation to old UI designs.
- Renter and owner record lists are restricted by hard-coded example persona **only as a visual mock**.
- **This is not real RBAC or tenant isolation.** A person with local browser access can inspect or change all mock state. Do not use the prototype with sensitive or production data.
- Profile, payment, invoice, verification and signed contract pages must not present simulated values as real financial or identity evidence.
- No email/SMS/WhatsApp delivery, live payment provider, bank payouts, document storage, real API, search index, background job, online marketplace or subscription transaction is connected.

## Quality gates

- 70 external/public page routes rendered without runtime errors in a simulated DOM test.
- Cross-portal tests assert: renter booking scope, owner vehicle scope, pending extension and operator review, driver dispatch independence, approved corporate lead, agent-attributed lead, partner evidence without work order closure, tenant approval mock-only, branded public enquiries, marketing signup not provisioning a tenant.
- GitHub Pages deployment workflow validates syntax and runs previous P3-A/P3-B tests plus P3-C tests.
- Smoke tests use Node with no dependencies, but actual browser visual QA, keyboard/focus trapping, accessibility review, real mobile-device tests and multi-user permission tests **still need completion**.

Run:

    node --check app.js
    node --check company-detail.js
    node --check external-portals.js
    node tests/smoke.test.js
    node tests/company-workflows.test.js
    node tests/company-edge-cases.test.js
    node tests/external-portals.test.js

Local preview:

    python3 -m http.server 4173

Then navigate to http://localhost:4173. Switch experiences with the workspace switcher.

## Next in sequence

**P3-D:** Final 215-contract coverage ledger, deep exception screens (rental disputes and amendments, refund approval, operator acceptance of service work, corporate procurement approval chains), usability walkthrough, accessibility and responsive visual QA.

**P4:** Read-only existing backend inventory: API, domain model, DB schema, workers, roles, event bus, payments and website provisioning. Do **not** change old backend during P3.

**P5:** Screen-to-API action mapping and incremental frontend/backend integration; enforce real tenant separation, identity verification, role claims, payment reconciliation, durable domain events, safe documents, idempotency, and comprehensive regressions.
