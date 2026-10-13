# Sage Auto V2 — P3-B Detailed Company Operations Design

**As of:** 13 October 2026  
**Status:** Interactive, frontend-only **company operations prototype**  
**Repo:** Sean-steve/Sage-Auto-v2 · main  
**Not yet:** Production feature implementation; old backend assessment; live integrations.

## 1. Scope delivered

P3-B extends the initial company workspace from mostly generic module shells into **24 dedicated detailed company pages**, plus the existing company Overview, Bookings and Rentals views. Shared components include tenant/workspace navigation, vehicle cards, status pills, editable list/table surfaces, task drawers, human-readable errors, simulated activity history and responsive data layouts.

| Detailed company area | Interactive capability in this batch | Later backend contract |
|---|---|---|
| Fleet | Vehicle cards, asset drawer, registration (unique plate), readiness signals | Vehicles, ownership, media, compliance, branch |
| Vehicle owners | Owner directory, agreement drawer, new owners and shares | Ownership agreements, signed versions, owner auth |
| Customers & drivers | Tabbed directories, create person, demo verification review | KYC, licence verification, consent, driving restrictions |
| Inspections | 12 mandatory checks, record no-defect/defect results, history | Inspection checklist/evidence/actor/immutability |
| Maintenance | Work orders, provider, estimate, service hold, completion | Schedule, evidence, suppliers, spend approvals |
| Pricing | Per-vehicle KES rate catalogue, edit daily base rate | Rates, offers, quote snapshots, taxes, dynamic pricing |
| Availability | Seven-day overview, all vehicles first, overlapping holds blocked, hold release | Canonical allocations, buffers, location, timezones |
| Contracts & handover | Confirmed rentals, contract acknowledgement, inspection gate | Signed contracts, verification, handover events |
| Returns & charges | Odometer, fuel, fees, checklist, condition, financial follow-up | Return state machine, damages, deposit/receivable ledger |
| Compliance | Document metadata and review flag | Secure file uploads + references, expiry and approval policy |
| Media & documents | Linked filename/URL metadata reference count | Signed URLs, object storage, file permissions |
| Finance & payments | Payments/invoices/deposits/expenses tabs, simulated receipts | M-Pesa/card, idempotent reconciliation, invoices, VAT |
| Owner settlements | Statement lists, agreement share, simulated reviewed payout | Reconciliation, split amounts, approval and payout rails |
| Deposits & refunds | Security deposits and refund-review states | Ledger, refund authorization, PSP execution |
| Business expenses | Classified vehicle or general costs | Expense approval and financial accounting |
| Leads & enquiries | Create lead, advance status | CRM, website lead capture, booking conversion |
| Business insights | Browser-local financial/fleet status summaries | Reporting, financial recognition, event analytics |
| Website studio | Edit brand/headline/accent, local publication toggle, public preview | Tenant websites, publishing and DNS, SEO |
| Company & branches | Branch cards, new branch | Branch scoping, capacity, timezone, location |
| Team & permissions | Staff directory, invite mock user, proposed role matrix | RBAC, branch membership, audit |
| Subscription & billing | Sample plan and capacity overview | Entitlement engine, platform subscription billing |
| Integrations & notifications | Read-only disconnected provider cards | Secure credentials, email/SMS/M-Pesa execution |
| Security & activity | Demo event feed from local actions | Immutable tenant-scoped audit events, security review |
| Settings | Navigable configuration groups | Rules, preferences, compliance policies |

The existing **Overview, Bookings and Rentals** pages remain, but booking transitions now route through the detailed P3-B interaction drawers.

## 2. Primary rental journey — tested

1. Open Bookings → create mock reservation. Choose a vehicle, pickup date, duration, channel, and renter name.
2. A sample availability check considers overlapping reservations and holds, existing rental/service state and the demo compliance flag.
3. Booking starts at **Awaiting payment**, with no money transferred. The mock reservation now includes a selectable pickup date and refuses overlapping demo allocations.
4. Open payment drawer, select a manual demo method, add reference, record receipt; a partial amount remains unpaid; a fully recorded balance changes to **Confirmed**.
5. Open the **Contract & handover** drawer; acknowledge the mock contract/identity review; complete all **12 required vehicle inspection sections**.
6. If a defect is flagged, record issues and block handover. If no defects, compliant and no overlapping active rental, transition **Confirmed → Active**, set vehicle **On rental**, and record inspection.
7. Open **Returns & charges**, record odometer, fuel, late/fuel/damage amounts and all required inspection checks.
8. Transition **Active → Completed** and record extra charges as a **pending balance**, rather than pretending the customer has paid.
9. Return the vehicle to **Available** if no defects or **Maintenance** if damage/issues are flagged.
10. Deposit states become **Refund review** where applicable; this is explicitly separate from a paid refund or a fully closed invoice.

## 3. Other tested journeys

- Fleet registration → provisionally Available **but not compliance-reviewed** → document metadata recorded → demo compliance flag → eligible to select in availability.
- Maintenance creation → block asset → complete work → vehicle status returns to Available (final server-side eligibility still required).
- Hold on a booked or held period → human-readable refusal naming the vehicle rather than internal IDs → change dates → create and release hold.
- Owner record → agreement terms → settlement review → mark demo paid (no financial transfer).
- Driver/person record → mock document review → verification flag, clearly labelled not real KYC.
- Base rate edit → vehicle price/booking rate uses updated reference (historical bookings remain unchanged).
- Site Studio save → branded demo site preview uses the chosen display name and headline (no actual publishing).

## 4. UX components & accessibility direction

- Branded, responsive top header and nav; dark operational sidebar with task-oriented grouping.
- Compact action cards and fleet illustrations, readable status labels beyond mere color.
- Contextual quick views and controlled form drawers with visible steps.
- Error messages use business terminology and friendly vehicle names; unnecessary system identifiers stay hidden.
- Dense workflow screens retain alignment; tables scroll on smaller viewports.
- Escape closes overlays; form fields use labels and checklists remain explicit.
- **Outstanding:** fully validated keyboard/focus management, accessible grid alternatives, screen-reader announcements, mobile-device visual QA, localization.

## 5. Truth boundary & known gaps

- Entire P3-B implementation uses hard-coded representative records and browser localStorage.
- **No backend, role authorization, identity checks, signed contract, true file upload, SMS, email, payment provider, cash transfer, tax calculation, invoice issuance, signature service or live fleet availability.**
- Preview role-switching is not a security control.
- Mock state rules are intentionally simplified; they will be audited against canonical backend business rules rather than copied directly.
- The 12-item checklist reflects grouped inspection categories; the production spec must reconcile the detailed existing inspection checklist before integration.
- Public marketing and other nine external experience categories still need full P3-C reconstruction.
- P3-B UI does not replace the legacy original implementation and should not be merged into it until later phase reconciliation.

## 6. Quality gates

GitHub Actions workflow on main:
- JavaScript syntax checks for app.js and company-detail.js.
- Legacy smoke suite for navigation and demo state.
- P3-B comprehensive mock-workflow suite covering detailed company routes and key lifecycle states.
- Static deployment includes both JS and CSS files.

Run locally:

    python3 -m http.server 4173

Then visit http://localhost:4173. No npm install or backend startup is needed.

Tests require Node:

    node --check app.js
    node --check company-detail.js
    node tests/smoke.test.js
    node tests/company-workflows.test.js
    node tests/company-edge-cases.test.js

To publish GitHub Pages: Repository Settings → Pages → Source: GitHub Actions. A workflow existing in the repo does **not** guarantee Pages is already live.

## 7. Forward plan

**P3-B.2 polish (optional before role portals):** Focus-managed drawers, explicit location/timezone handling, document previews, prototype invoice details, printable mock contract, structured exception/dispute screens, accessible table filters.

**P3-C priority:** Dedicated customer/renter, vehicle-owner, driver/chauffeur, platform-admin, corporate, agent, service-partner and public website journeys — all using the same design system but purpose-built information architecture.

**P4 backend audit:** Read-only inventory of existing DB schema, domains, API contracts, roles, policies, workers and actual data flows.

**P5 marry UI/backend:** Screen-to-API coverage matrix; adapters and additions; tenant isolation; event propagation; real settlement tests and regression gate before retiring old screens.
