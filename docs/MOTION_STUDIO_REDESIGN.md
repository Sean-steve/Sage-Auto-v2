# Sage Auto V2 — Motion Studio Creative Reconstruction

**Design release:** 13 October 2026 · **Branch:** main · **Scope:** premium, editable frontend prototype.

## Creative thesis

A car-hire product should feel like mobility and movement, not a generic admin dashboard. Motion Studio deliberately replaces the former forest-green, repetitive card composition with a distinctive **automotive editorial + mission control** interface: warm porcelain background, midnight graphite work surfaces, electric iris for intelligence, tangerine for human moments, acid lime for important action, generously scaled typography and expressive geometry.

These choices build on the supplied SaaS reference guidelines: differentiated cards, legible typographic hierarchy, meaningful data visualization, shortcuts, role-specific visual personalities, and guided workflows. No third-party dashboard template, proprietary design artwork or source code was copied.

## Before and after

| Area | Former interface | Motion Studio experience |
|---|---|---|
| Company home | Forest-green banner and repeated white KPI cards | Asymmetric motion editorial hero, useful integrated fleet/task summary, destination-style departure board, chart, fleet-stage collection, priority desk |
| Typography | Modest uniform SaaS headline scale | Plus Jakarta Sans for strong operating headlines, DM Sans for dense UI, Instrument Serif for selective expressive moments |
| Operational analytics | Generic volume chart and donut | Sample-booking **pickup-date value** chart with Today/7/30/90-day period scopes and date-bucket drilldown; explicitly not paid revenue |
| Navigation | Sidebar and generic search | Reskinned graphitic sidebar, contextual workspace bar, Quick Find, branch context, pinned modules and night-shift toggle |
| Action hierarchy | Numerous competing buttons/cards | One primary "Start booking" action, clear 'next action' per reservation, prominent relevant navigation |
| Fleet | Vehicle list/grid on operational pages | Warm-tangerine curated asset stage and fleet status theater with vehicle-specific quick views |
| Renter | Same overall dashboard patterns as other roles | Apricot traveler gateway with prominent trip action and warmer tone |
| Vehicle owner | Same composition as renter | Lavender portfolio gateway with pending example owner settlement |
| Driver | Generic dashboard | Sky-blue driver-workspace gateway with next assignment |
| Corporate, agent, service, platform | Shared generic format | Distinct editorial themes, primary workflow entry points, original operational panels preserved |
| Public websites | Dark forest full-width vehicle banner | Editorial graphic stage, large typography, geometric steering-wheel illustration and clearer conversion actions |

## Interaction design, not merely decoration

- Company branch dropdown changes vehicles, related example booking metrics, fleet stage and departure board.
- Departure board segments switch between All / To collect / On the road / Needs payment and open the original booking detail / next action.
- Chart scopes filter the underlying **fictional bookings**, instead of fabricating a smooth revenue line; clicking a date group shows supporting example references. The sample's anchor day is 13 October 2026.
- Pinned company module shortcuts can be toggled and persist in a separate browser preference key.
- Night Shift theme can be toggled from the contextual workspace bar. It is a visual preference only; not a tenant setting.
- Click-through entry points keep existing fleet, booking, handover, finance and owner workflows intact.
- Role switching continues to use demo personas and cannot be mistaken for actual RBAC.

## Implementation

- `motion-studio.js`: Company cockpit, role visual front doors, public hero, branch/period/lane/pin/theme state and action handlers.
- `motion-studio.css`: Tokens, original responsive layouts, differentiated surfaces, semantic status labels, keyboard focus, night appearance and motion reduction.
- `app.js`, `premium-experience.js`: Composition hooks only; existing booking state machine, roles and P3-B/C/D.2 modules remain available.
- `index.html`: Loads the new UI style last and module before the underlying app initializes.
- `tests/motion-studio.test.js`: Synthetic DOM cross-persona and preserved-workflow tests.
- `tests/p3e-browser-qa.cjs`: Selectors updated for the new command centre, public covers and role variants.
- `.github/workflows/pages.yml`: New JS syntax, route regression test and asset upload requirements.

## What has and has not been redesigned

**Completed in code:** A new overall visual identity, navigation treatment, company overview, seven portal home compositions, public website hero, meaningful example analytics, fleet illustration, responsive structure and interactive presentation controls. The earlier P3-E and reference-informed screens for Booking, Availability, Inspections, Finance, Pricing, Returns and Owner Settlements remain and inherit new global shell styling.

**Not claimed:** Pixel-by-pixel redesign of all 215 original contracts, a tested accessible night theme across every obscure legacy state, production backend integration, real payments, real secure roles, actual vehicle photographs or a confirmed public Pages deployment. The P3-D.2 remaining partial contracts are still tracked separately.

## Quality acceptance / human QA

The repository's no-dependency synthetic DOM tests check transitions and cross-portal rendering. The separate on-demand Playwright screenshot workflow captures desktop/tablet/mobile renderings. **Do not mark manual visual QA complete until actual screenshots have been generated and inspected.**

Review specifically:
1. Command centre at 1440, 1024, 768, 390, 360px.
2. Sidebar, branch chooser, departure board, chart and fleet stage.
3. Night mode: contrast, text, menus, drawers, form inputs and long tables.
4. Renter and driver mobile-first roles plus marketing/storefront first impressions.
5. All money, booking, identity and owner settlement disclaimers.
6. Nonempty, empty, error and delayed-loading states as real backend integration proceeds.

## Local preview

```bash
git checkout main
git pull origin main
python3 -m http.server 4173
```

Open http://localhost:4173/#company/Overview, then switch to Fleet, Bookings, renter, driver or the public site. This remains a fictional browser-local prototype.
