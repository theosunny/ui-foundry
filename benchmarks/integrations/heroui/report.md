# HeroUI adapter fixture

Bounded integration fixture for UI Foundry. It is not a product, comparison or endorsement.

## Scope

- Fictional member display-name edit only.
- Genuine HeroUI v3 `Button`, `TextField` + `Label` + `Input`, and compound `Modal`.
- No backend, authentication, persistence, analytics or product workflow.

## Locked setup

| Item | Version / value |
| --- | --- |
| Node | 24.15.0 |
| React / React DOM | 19.3.1 |
| HeroUI React / styles | 3.2.6 |
| Tailwind CSS | 4.3.3 |
| Tailwind Vite plugin | 4.3.3 |
| Vite | 8.3.5 |
| Playwright | 1.64.1 |
| Browser | Installed Google Chrome; exact runtime version in `result.json` |

Official setup evidence: HeroUI Quick Start (checked 2026-10-27) requires React 19+ and Tailwind CSS v4, installs `@heroui/react` and `@heroui/styles`, and imports Tailwind before HeroUI styles. Tailwind’s Vite guide requires the `@tailwindcss/vite` plugin for this setup. Component APIs were checked against HeroUI’s Button, Input and Modal documentation on the same date.

## Verification

Run `npm install`, then `npm run verify`. The check uses installed Chrome and records exact package/browser versions and results in `result.json`; screenshots go in `artifacts/`.

Expected checks:

- open modal, edit labelled name, save result and inspect visible selected-state feedback;
- press Escape, inspect closed dialog and focus return;
- inspect 390px viewport for horizontal overflow;
- capture desktop and mobile screenshots.

## Evidence boundary

Component plumbing means the installed v3 components build and complete this bounded interaction under tested Chrome. Visual quality is reviewed separately: the fixture uses a compact member-card hierarchy, clear edit affordance and visible save feedback, but it does not establish generic HeroUI quality, suitability for another product, accessibility conformance or cross-browser behavior.

The verified Vite build emitted non-fatal `MODULE_LEVEL_DIRECTIVE` warnings while bundling HeroUI’s published `@heroui/react` barrel; it still completed. This fixture records that output as a toolchain observation, not as a component failure.
