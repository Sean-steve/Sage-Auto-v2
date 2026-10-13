# Sage Auto V2 — Wave 3 implementation: CH-003 through CH-010

**Source branch:** `feat/audit-led-experience-wave1` | **Review:** https://github.com/Sean-steve/Sage-Auto-v2/pull/1

The Sage Auto V2 repository is an **interactive browser-local prototype**, not the real car hire backend. Wave 3 adds shared state rules and task-oriented views to the pre-existing pages; it does not represent live billing, authentication, reserved stock, bank transfers, or legally executed rental documents.

## Reconciliation and scope

| Contract | Screen family | Preserved functionality | New implementation | Explicit boundary |
|---|---|---|---|---|
| CH-003 | S03-12/13/38/46 — Availability | Existing seven-day grid, hold drawer, holds & booking records | Fleet-wide eligibility board; date/vehicle controls; clickable decision; alternatives when blocked; explicit overlap rules | Sample-local only, not real-time allocation |
| CH-004 | S03-14..17 — Booking/changes | Booking register, booking progression, amendment requests and decisions | Cross-stage handoffs, original/requested terms drawer; original contract unchanged | No amendment automatically reprices a contract |
| CH-005 | S04-05..09 — Branded checkout | Four-step demo request, company lead/enquiry creation, consent requirement | Checkout conflict guard; verification/payment/operator-decision stages explained | Non-binding enquiry, not paid/confirmed booking |
| CH-007 | S03-18..22 — Contract/handover | Twelve checklist acknowledgements, agreement checkbox, defect block, renter possession transition | Status-contextual handover queue and readiness decision linking to existing checklist | Handover not performed automatically |
| CH-008 | S03-27..30 — Return | Odometer/fuel/charge capture; deposit flagged for review | Physical possession separate from charge review and invoice review; disputed/approved review lifecycle | No refund or final finance close on physical return |
| CH-009 | S03-52..58 — Finance | Receipt entry and partial-balance checks, invoice and deposit lists | Per-booking assessed/recorded/remaining; reversal exclusion; duplicate reference guard; separate invoice review | Demo ledger, no payments/reversals reconciled with provider |
| CH-010 | S03-61..65 — Owners | Original owner/payout entries and agreement share | Illustrative owner waterfall; state machine Pending → Approved → Sent for simulation → confirmed (demo) or Failed (demo) | No real transfer; original payout remains Pending |

**34 affected screen contracts** are flagged as source-integrated but not fully browser/a11y-verified in `docs/AUDIT_2026_SCREEN_RECONCILIATION.csv`.

## Files and component architecture

- `rental-core.js` — pure shared domain functions; overlap/eligibility, terms comparison, receipt assessment, return/invoice review, deposits and owner payout state machine. **No network requests.**
- `rental-journey.js` — additive contextual workbench (navigation rail, task list, record drilldowns, state badges, empty/conflict states); customer/owner state summaries; checkout review gates. Delegates handover, hold, payment and return actions to the **existing** company-detail handlers.
- `rental-journey.css` — scoped reusable styles and mobile/desktop composition.
- `app.js` — composes new workbench around existing pages rather than replacing older components; preserves route resolution and existing dialogs.
- `company-detail.js` — guards duplicate payment references and routes old one-step payout through the new **simulated review** transition when Wave 3 is active. Older fallback behavior is left for the isolated legacy tests.
- `gap-closure.js` — fails a checkout eligibility check against existing sample holds or bookings before allowing the enquiry flow to progress.
- `index.html` — loads new modules before app bootstrap.

## Cross-workflow invariants

1. Active holds and open booking date ranges block a conflicting example vehicle/date selection. Unavailable/compliance-blocked assets remain blocked.
2. Booking amendment review never modifies canonical booked dates, renter terms, or rental price.
3. A checkout enquiry can never be displayed as a confirmed reservation, charged card, or received MPESA payment.
4. The existing complete 12-area checklist, contract acknowledgement and defect checks remain required to hand over a vehicle; no-defect inspection can pass after all sections are acknowledged.
5. Possession is derived from `Active` or `Completed` booking status. Marking the physical return does not mark the finance ledger closed.
6. Return charges must be reviewed before a completed-booking invoice assessment can be approved.
7. Duplicate manual receipt references are rejected; negative/reversed/voided payment rows never count toward received amounts.
8. Owner payouts must advance through permitted states, with explicit acknowledgement for the final *simulation*. The original payout status is not changed to actual Paid.
9. Renter and owner views reuse the same shared demo records, scoped to their example personas.
10. Company-only actions return a denial message outside the operator workspace; **real RBAC still requires backend enforcement**.

## Tests and evidence

**Executed outside CI:** JavaScript syntax checks on new core/router/company/gap modules, synthetic overlap/receipt/return/payout guards, and structure checks. All passed at the time of the report.

**Added CI automation:** `tests/rental-core.test.js`, `tests/rental-journey.test.js`, and `tests/rental-journey-browser.mjs` (3 viewports × 9 company screens + 3 external persona screens = 36 routes) including screenshots and negative paths. Existing six mock suites and additional operational regression suites are still in the same PR workflow.

**Gate:** Do **not** merge without executed GitHub Actions evidence. The preceding Wave 1 CI reported 10 responsive revenue/company routes PASS, 30 responsive onboarding routes PASS, yet the **global axe suite failed with 32 serious/critical violations across 32 inspected routes**. That remains a baseline quality blocker requiring independent remediation and screen-reader/keyboard assessment. The browser outcome for new Wave 3 views must be checked separately.

## Remaining work

- Execute and inspect the latest Wave 3 CI; fix any failed source or browser assertions and review screenshot artifacts.
- Resolve pre-existing and newly discovered accessibility violations without suppressing the global axe gate.
- Continue functional refinement on the 34 screen contracts until workflow negative paths, responsive behavior, error and empty states have demonstrable browser evidence.
- Real implementation against the Sage Auto backend: authoritative allocation locking, payment callbacks, signature/KYC, invoice ledger, owner settlement transfer receipts, role enforcement and durable server audit trail. This is a **separate production integration phase**.

**No merge to `main` is authorized by an unverified or failed QA result.**


## Executed QA evidence — latest completed browser and Axe scans

- **Source-level legacy + Wave 1/2/3:** `Source and existing workflow contract tests` — PASS, including existing booking, inspection, payment, return, owner and visual integration mocks.
- **Browser (Chromium; executed GitHub Actions):** 10 Revenue/company route checks + 30 onboarding route checks + **36 rental/checkout/renter/owner checks**, all passed after fixing the availability drawer and mobile overflow. Screenshots and JSON findings are uploaded in the Actions artifact.
- **Accessibility:** Axe audit originally failed to execute because the runner used `browser.newPage()`; now it uses an explicit `browser.newContext()`. The first authentic scan identified 34 serious contrast/focus findings across 32 inspections. Remediation addressed keyboard scroll focus and multiple common text styles. The most recently reviewed completed scan reported **20 screens with serious color-contrast issues; zero execution errors**. More remediation commits have been made, but the last run must be checked separately. **Do not mark accessibility PASS until verified.**
- **No production backend claims:** All UI/ledger results are browser-local examples; a green mocked financial state is not bank, MPESA, insurance, or ownership authorization evidence.

Release remains **DRAFT / DO NOT MERGE** if the latest Axe gate is red or manual screenshot/a11y review remains incomplete.

