# Sage Auto V2 — SaaS UI/UX Reference Study & Application Rules

**Research date:** 13 October 2026  
**Purpose:** Persistent inspiration-to-implementation guidance for every future Sage Auto visual design and backend-integration screen.  
**Status:** Design research and decision record; not a code/template acquisition or proof of visual QA.

## Five reference sources

| Source | Evidence observed | What Sage Auto should adopt | What to avoid |
|---|---|---|---|
| [Dribbble / saas-ui-ux](https://dribbble.com/tags/saas-ui-ux) | Contemporary concept art, editorial hero layouts, premium typography, clean dashboard hierarchy, restrained elevation, polished data visualization | Distinctive first impressions, considered proportions, thoughtful illustrations, sophisticated card/visual composition, beautiful transitions | Treating a nonfunctional design shot as evidence of usability; copied artwork/branding, charts without real meaning, gratuitous glassmorphism |
| [Ubrain Studios — SaaS UI/UX guide](https://ubrainstudios.com/blog/saas-ui-ux-design-guide-for-modern-products/) | User-centered journeys, simplicity, scalable components, onboarding, consistency, accessibility, clarity and retention | Progressive disclosure, task-oriented flows, guided first-use experience, clean navigation, real empty/error/loading states, measurable task success | Sacrificing workflow efficiency for decoration |
| [Fuse React / withinpixels](https://themeforest.net/item/fuse-react-react-redux-material-design-admin-template/21769397) | Multiple layouts, folded/vertical/horizontal nav, dashboards, calendars, messaging, contacts, authentication, support/help, reusable admin components, dark/light and RTL examples | A reliable operational design system with reusable patterns, contextual drawers, complete form states, breadcrumbed navigation and adaptable workspace density | Copying Fuse's visual identity or templates, assuming template examples provide real authentication, rewriting Sage Auto architecture around a purchased template |
| [VenueX / pixelaxis](https://themeforest.net/item/venuex-event-ticketing-management-saas-dashboard-html-template/61427808) | Industry-oriented operational lifecycle spanning events → inventory → orders → check-in → promotions → earnings/payouts; domain-focused pages and analytics | Build **car-hire-domain** pages as connected workflows: Availability → Booking → Verification → Contract → Handover → Rental → Return → Finance → Owner settlements; structured status progression and action states | Mistaking VenueX's static HTML mock data for a backend, applying event-ticketing terminology directly to cars |
| [Skote / Themesbrand](https://themeforest.net/item/skote-react-admin-dashboard-template/26318700) | Responsive dashboard variants, useful data tables, wizard validation, invoices, authentication, task/kanban views, loading and toast patterns, layout variations, theme/i18n/RTL options | Mature staff-facing data patterns: filtering, sorting, batch action safety, clear tables, accurate finance documents, dense/comfortable modes and keyboard/mobile support | Filling every page with interchangeable KPI cards or generic admin-layout clutter |

**Source-access note:** Some ThemeForest iframe previews and the Ubrain live page did not load directly; their publicly indexed source/product descriptions were reviewed. Visual examples were additionally checked through public design gallery imagery. Do not claim pixel-for-pixel validation of inaccessible preview frames.

**IP/licensing:** These are design references. Do not copy proprietary templates, brand assets, illustrations, source code, paid components, photographs or design files without permission and the correct license. Sage Auto must have its own design system.

## Product direction: "Premium Automotive + Operational Precision"

Build **one coherent Sage Auto language** across all 11 experience surfaces, with variant compositions:
- Marketing/site and renters: image-led, emotional, premium, conversion-conscious.
- Operators/branch teams: action-first, efficient, data-rich only where necessary.
- Owners: portfolio, utilization, contracts, payouts and trust.
- Drivers: mobile-first, glanceable trip states and safety.
- Corporate: approval and reporting clarity.
- Agents: referrals and commissions attribution.
- Service partners: work queue and evidence.
- Super admin: tenant management, entitlements, usage and support governance.

Avoid the **two failures** of a dashboard redesign: (1) visually blunt white KPI-card repetition; (2) beautiful but operationally unusable luxury decoration. Each page must make its primary next action obvious.

## Non-negotiable page grammar

1. **Context header:** current workspace and branch, short purpose, primary permitted action. Show exact object (vehicle/booking/owner) and business-relevant status.
2. **State summary:** one clear current state; only contextual KPIs. Never confuse an enquiry with a confirmed booking, a returned car with reconciled finance, or an estimated payout with transferred funds.
3. **Primary work surface:** vehicle gallery, availability allocation timeline, booking lifecycle stepper, invoice workspace, maintenance board etc. Avoid generic same-look tables when a domain visualization is more useful.
4. **Action zone:** one primary CTA with descriptive verb; progressive disclosure for secondary actions; no dead-end controls.
5. **History / supporting context:** audit and media evidence where they reduce mistakes.
6. **Feedback:** meaningful loading, empty, success, conflict, error, denied, offline and reconciliation states with human-readable descriptions. Never expose raw internal IDs without a user-facing reason.
7. **Responsive layout:** meaningful mobile card or condensed list alternative for wide tables and calendars. Driver/renter mobile experiences must be task-first.
8. **Keyboard / accessibility:** landmarks, semantics, focus visibility & return, no color-only encoding, reduced-motion compliance, touch targets, captions and readable contrast.

## High-priority component patterns to implement consistently

| Domain | Needed premium components | Interaction contract |
|---|---|---|
| Fleet | Editorial photography with verified asset sources; cards/list toggle; readiness chips; asset timeline | Filter by location, type, compliance, ownership and status; quick edit/inspect with permission check |
| Availability | Vehicle-by-time allocation board; hold stripes; date picker; capacity legend | Default show whole fleet, filter to one car; conflict preview names vehicle + dates and offers alternatives |
| Bookings | Customer/vehicle split view; staged booking composer; price/availability summary; status stepper | Select dates → availability → quote → customer → payment request → confirmation; preserve form state |
| Handover/return | Interactive condition map, item checklist, evidence timeline, odometer and fuel, signature blocks | Group mandatory checks, allow no-defect completion, block unsafe handover, never auto-mark finance settled |
| Finance | Clear payment receipt allocation, invoice detail, deposit/refund review, reconciled vs pending states | State changes require correct approvals and show next steps; printable export later |
| Owner settlement | Revenue splits, deductions, statement, payout approval and history | Distinguish estimated/payable/approved/paid, keep actor audit |
| Website Studio | Live responsive viewport, themes, inventory preview and publishing workflow | Save draft ≠ publish; show DNS/entitlement blockers |
| SaaS platform | Tenant portfolio, support queue, entitlement change impact, worker status, permissions | Separate platform financials from tenant rental income; governed support access |
| All role portals | Relevant hero + action-first task pane, lightweight alerts and recent objects | Persona-specific paths, no legacy-module bounce or permissions assumptions |

## Recommended design system

Continue the bespoke P3-E automotive palette (forest/eucalyptus, warm off-white, restrained lime accents) while evolving the utilitarian component layers. Use editorial typography only for genuine hero sections; operational tables and legal/finance views prioritize legibility. Standardize:
- Semantic tokens for surfaces, text, borders, focus, status/success/warning/error, illustration.
- Spacing based on 4px/8px modular steps, intentional density variants.
- At least three chart types used only when insightful: fleet utilization, upcoming pickup/return volume, financial reconciliation.
- Shared primitives: AppShell, WorkspaceSwitch, Header, ActionBanner, StatusPill, FormField, Wizard, FilterBar, DataGrid, Timeline, Drawer, Confirmation, Notification, EmptyState, ErrorState, MediaViewer, CalendarBoard.
- Animations as event feedback, not idle spectacle. Respect prefers-reduced-motion.
- Design assets and real cars require explicit provenance/license and meaningful alt text.

## Prioritized Sage Auto improvements after P3-E

**P0:** Actual screenshot review on 360/390/768/1024/1440 widths; restore all broken/clipped interactions; test onboarding and booking flows from first click to completion.

**P1:** Full availability calendar and booking detail (complete lifecycles), interactive inspection & return, finance reconciliation and owner settlement visualizations. These are the product's signature domain interfaces and deserve more than generic cards.

**P2:** Company workflows (fleet, vehicles, branch/team), Website Studio publishing, renter mobile garage and driver shift/assignment flows.

**P3:** Platform admin enterprise-style governance, corporate approval UX, agent commissions, workshop evidence/QA, responsive customer pages.

## Definition of acceptance per screen

A screen is **not accepted** merely because it exists in navigation or looks attractive.

It is accepted only after:
- [ ] Appropriate actor can reach it in 1–3 logical navigation actions.
- [ ] Screen has one clear primary task and accurate state language.
- [ ] User can finish or meaningfully continue a major journey, including cancellation/error recovery.
- [ ] Desktop and mobile screenshots were reviewed for hierarchy, contrast, overflow and touch usability.
- [ ] Keyboard and reduced-motion behavior inspected; focus follows navigation/dialog state.
- [ ] Loading, empty, denied, success, error and conflict conditions reviewed.
- [ ] All data respects sample/real boundaries; no false availability/payment claims.
- [ ] Feature traceability is linked to the 215 contract matrix and existing backend before production integration.
- [ ] When integrating later: audited server-side roles and tenant/branch scoping, full persistence, tested domain events and existing feature regression.

## How future implementation prompts should use this document

1. Read this reference and the P3-D.2 215-screen contract matrix.
2. Choose source inspiration by **the nature of the work**, not by what looks attractive: Dribbble for polish, Ubrain for usability, Fuse for scalable admin architecture, VenueX for domain workflow lifecycle, Skote for operational maturity.
3. Sketch the primary object, state, user action and next cross-role handoff before writing CSS.
4. Build coherent production-oriented patterns rather than copying screenshots.
5. Render and QA major pages at several viewports. Record actual visual defects; never claim real screenshot validation from mock-DOM checks.
6. Preserve all prior functional capabilities and the original backend until contractual reconciliation is explicitly authorized.
