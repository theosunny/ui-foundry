# Validation still needed / 后续验收

These are open acceptance items, not results. The development examples and current tests establish individual behaviors; they do not establish reliable visual superiority, production readiness or native parity.

| Gap | Acceptance evidence | Current state |
| --- | --- | --- |
| Transfer across product types | New, pre-frozen tasks covering a consumer product, a content creation flow, an existing branded app and a data-heavy workflow; save exact request, artifacts, environment and failures | [Four-arm Web pilot](factorial-evaluation.md) ran comparison/commit and branded editing tasks; no stable superiority demonstrated; tasks now regression evidence |
| Design quality | Same task/content/viewport, anonymized outputs, independent human evaluation of hierarchy, typography, composition, density and interaction; report disagreement and failures | Screenshot inspection and limited AI review; no panel or general quality claim |
| User effort | Observe participants attempting the same representative tasks; record task completion, re-entry of known information, recoveries and points of confusion without equating fewer clicks with quality | No real-user trial |
| iOS behavior | In simulator/device exercise dates, place selection, keyboard, cancel, save/restart, dynamic type and reduced motion; record OS and device | Static simulator frame and date semantics only |
| Android behavior | Implement a representative native flow in a compatible Android project; exercise system back, keyboard, configuration changes and persistence on emulator/device | Routing guidance only |
| Integrations | Test the project's actual authentication, permissions, failure paths and vendor API using an authorized test environment | Bundled place service tested with mocked responses only |
| Distribution | Verify the exact version anonymously through each public registry and compare files with its manifest | GitHub 0.2.0 verified; ClawHub 0.2.0 was not public at its last recorded check |

When a task uncovers an issue, retain the original artifact, distinguish a test-harness defect from a product defect, fix the responsible layer and rerun the original and a relevant counterexample. Do not use an authored reference, a simulated service or a previous task used to tune the skill as an independent benchmark win.
