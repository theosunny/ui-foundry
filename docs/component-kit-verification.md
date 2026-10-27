# Component kit verification · 0.2.0

Scope: the reusable kit and Skill routing. This is an authored integration/regression check, not a new blinded generation benchmark or a comparison with Lovable. All demonstration content is fictional.

## Failures retained from review

| Observation | Responsible layer | Repair to verify |
| --- | --- | --- |
| Native date initially serialized through UTC, then remained stored as an instant | Component data model; compilation did not catch it | Store a Gregorian civil date and bridge it to the native picker without changing the saved day across timezones |
| Native map view identity used escaped interpolation, so changing the place could retain the old camera | Component implementation | Actual location-specific identity; native rendering remains a separate check |
| Web search initially composed an Input and ListBox without complete combobox keyboard behavior | Component selection | Use a mature combobox with keyboard and composition behavior, then operate it in the browser |
| Initial Web Undo removed the saved record instead of restoring the state before an edit | Product-state implementation | Replace the misleading action with edit/cancel; cancellation restores the committed value and reload retains it |
| Initial race check changed queries before the old request began | Test premise | Start a slow request, issue a new query, and observe that the late result cannot replace the current result |
| An early native re-review missed `Calendar.date(from:)` normalizing invalid days | Review coverage | Validate Gregorian round-trip components; test February 30 and leap-day validity |
| Nested DateField root left the date popover without its anchor | Component anatomy | Use the locked library's DatePicker composition and actually open and select a date; no force-click or visibility override |
| Place suggestions stretched across the viewport | Layout integration | Size the popover from its trigger and inspect the open state on desktop and mobile |
| Committing a place reopened suggestions because its label was synchronized in a later effect | Controlled state integration | Commit the input label and selected value in the same update; require the listbox to close before saving |
| An early runner pressed Escape after selection, masking the reopened-popover defect | Test coverage | Remove the workaround and assert automatic closure; the first attempted controlled `isOpen` repair was also rejected by typecheck before release |

These failures show why using a component library and compiling successfully do not establish a finished interaction. The Skill already required data preservation; the corrections target implementation and evidence instead of adding duplicate slogans.

## Execution record

| Check | Observed scope |
| --- | --- |
| Server adapter | 7 Node test groups passed: mapping, invalid records, cancellation/timeouts, safe errors, authenticated route hooks, origin, rate limits and bounded JSON requests; all vendor responses mocked |
| Actual ZIP | 31 canonical files verified against the manifest; the extracted Web kit passed TypeScript and production build |
| Web release regression | 22 checks passed: 6 CSS foundation, 9 existing workspace flow, 7 new component groups; no browser page errors in the component run |
| Component interaction | Actual calendar selection, keyboard place selection and automatic closure, local save/reload/cancel, invalid stored data, manual fallback, in-flight stale responses, remote failure, double-save protection and synthetic IME composition |
| Viewports and motion | 390px page and open suggestions have no horizontal overflow; reduced-motion popover animation measured at `0.00001s` |
| Independent review | A separate AI reviewer read the generalized standards and four desktop/mobile screenshots; no scope or screenshot-level blocker found. It did not execute the UI or assess human preference |
| SwiftUI compilation | iOS 17 simulator target typecheck passed |
| Civil date semantics | 12 checks passed: one stored value across 3 zones × 3 display calendars with a separate timezone override, plus valid/invalid leap-day checks |

The standalone native semantic executable uses the host macOS SDK and reports MapKit `placemark` deprecation warnings. The iOS 17 reference uses APIs available at its stated deployment target. Neither compilation path executes the native interface.

Live AMap credentials, a real map service request, native device interaction and Android runtime behavior are outside this local integration run. Those paths must not be inferred from mocked service tests or iOS compilation.

Exact component observations and screenshots: [final evidence](../benchmarks/runs/2026-10-27/components/final/). The runner executes the unmodified extracted demo, then uses the same components in a separate deterministic failure probe. The probe is test infrastructure, not shipped product data. HeroUI's production build emits non-fatal `use client` module-directive warnings in this client-only Vite example; they are not suppressed.
