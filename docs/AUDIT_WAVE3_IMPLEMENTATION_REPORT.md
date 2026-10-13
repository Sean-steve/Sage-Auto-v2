# Sage Auto V2 — CH-003 through CH-010, Rental Journey Wave 3

Implementation branch: `feat/audit-led-experience-wave1`, [draft PR #1](https://github.com/Sean-steve/Sage-Auto-v2/pull/1).

**System boundary:** frontend-only static prototype; all business state is browser-local. There is no authoritative booking, availability, banking, payout or authentication service attached. Working original tools remain present inside collapsible "Complete existing tools and records" sections; role switching does not confer server-side authorization.

| Contract | Screens | Functional UI delivered | Legacy functionality preserved | Remaining production dependency |
|---|---|---|---|---|
| CH-003 | Company Availability | Per-vehicle date/hold/conflict checks, alternative search, native mobile workspace | Original 7-day allocation and vehicle tools | Canonical server-side interval locking and concurrency |
| CH-004 | Bookings, Booking changes | Original vs proposed terms, inline decision context, activity routing | Reservation register and mock change-review handlers | Atomic repricing, acceptance and contract amendments |
| CH-005 | Branded checkout | Explicit availability/verification/payment/confirmation decision boundary | Nonbinding enquiry and sample lead pipeline | Validated booking availability, auth, payment and confirmation |
| CH-007 | Contracts & handover, Rentals | Twelve inspection categories and no-defect path, contract prerequisite, possession markers | Original checklist and handover transitions | Signed contracts, inspection files and allocation ownership |
| CH-008 | Returns & charges | Physical return vs disputed/reviewed charges; separate financial closure | Existing return drawer and fleet status updates | Invoice assessment and return evidence persistence |
| CH-009 | Finance & payments, Deposits & refunds, Invoice detail | Assessed/recorded/remaining, duplicate reference guard, reversal/partial state, invoice and refund review | Original payment, deposit, invoice, expense registers | Payment-provider reconciliation and ledger posting |
| CH-010 | Owner settlements | Agreement share illustrations, staged approval/sent/failure/confirmed *simulated* payout; legacy Paid not used for new approvals | Owner agreement, payout queue and read-only owner portal | Bank transaction confirmation and agreement-based deductions |

## Delivered source

- `rental-core.js`: reusable, pure rental calculation/validation functions, including availability, receipt, refunds, returns and payouts.
- `rental-journey.js`: adds operationally distinct Company screens, branded checkout truth notes and cross-role renter/owner views; preserves existing renderer/handler cascade.
- `rental-journey.css`: scoped `rj-` design components; responsive/keyboard behavior.
- `app.js` and `company-detail.js`: additive integration calls and legacy owner-payout safeguard.
- `index.html`: loads rules then views before main app startup.
- `tests/rental-core.test.js`, `tests/rental-journey.test.js`: domain/interaction checks.
- `tests/rental-journey-browser.mjs`: 36 rendered routes/viewport checks.
- `.github/workflows/audit-wave1.yml`: runs source/legacy regression and Playwright/Axe checks.
- `experience-foundation.css`: WCAG-contrast corrections based on actual GitHub-hosted Axe selector distribution.

## Executed QA evidence

GitHub Actions run 38472933437:
- Original mock workflows plus the source/rental-chain test suite: **PASS**.
- Real Playwright: 10 Revenue/Work Mode + 30 onboarding + 36 rental-chain viewport/screen cases: **PASS** (76 checks).
- Axe WCAG 2 A/AA: **FAIL** due to 30/32 routes with serious color-contrast findings, including preexisting label styling. Contrast amendments followed and triggered new run 38473230166. **Do not treat this wave as release-approved until that run's results are checked.**

## Current remaining gates

1. Confirm new Axe outcome after contrast fixes. Inspect artifacts; do not merely accept screenshots existing.
2. Reinspect coverage in all 22 user journeys and all 215 screen contracts, especially keyboard/screen-reader and 200% zoom.
3. Run full backend integration separately: multitenant permissions, strong canonical source of truth, notification service, payment ledger/provider, audited owner payouts.
4. Keep PR draft/unmerged while critical or serious accessibility findings remain.

**Important:** Demonstration of an operational flow is not evidence a production backend exists.
