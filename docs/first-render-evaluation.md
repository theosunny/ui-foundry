# First-render composition probe

## Change and rationale

The prior four-arm pilot did not favor the combination. Review identified repeated oversize headings, tall mobile comparison sections and mismatched density. UI Foundry now makes the composition decision explicit before the main layout is written: visual focal point, actual content and viewport, coherent typography/surface roles, and action placement. The instructions preserve existing brands and allow different forms of expression; no universal palette, font or above-the-fold packing requirement was introduced.

## Matched new-task probe

Four fresh contexts received a full frozen Skill snapshot, either before or after the change, and exactly one of two new contracts: community-art workshop booking and maker-studio energy analysis. Each produced one raw first implementation, without rendered iteration. The root checked all unchanged artifacts with the same business checks and provided anonymous screenshot pairs to two independent AI reviewers in opposite display orders.

| Observation | Before | After |
| --- | --- | --- |
| Workshop behavior | 4/4 | 4/4 |
| Energy behavior | 3/4, 390px overflow to 468px | 4/4 |
| Reviewer 1 preference | — | Both tasks |
| Reviewer 2, reversed order | — | Both tasks |

These are named observations, not a design-quality percentage. Initial outputs, task/Skill hashes, reviews and harness correction are in the [evidence folder](../benchmarks/runs/2026-10-30/first-render/). No best-of selection or repair was used for the table. The tasks now count as regression examples, not future held-out tests.

## Defects and limits

The after workshop has weak unlabelled circular selection affordances on desktop. Both reviewers require selected-state inspection beyond the initial screenshot. The second reviewer also identified unsupported copy: “beginner-friendly” and “shared making room,” plus invented secondary room labels in energy. These were not caught by the named numerical/behavior tests. Task facts and business copy must therefore still be reviewed; passing the table does not make these raw samples finished products or approved few-shot designs.

This small probe supports retaining the composition preflight as a promising improvement for these two task families. It does not establish stable superiority, eliminate model variance, or isolate causality from stochastic generation. Each task has one output per condition, one inherited model/tool environment, no real users, no native or Chinese typography checks. Host defaults and exposure to available tools cannot be guaranteed absent. Exact resolved model ID and cost were not exposed. The first screenshots were captured in contexts created at their actual viewport sizes, avoiding the earlier resize artifact.

## Replay

From the repository root with benchmark dependencies and Chrome:

```sh
node benchmarks/check_first_render.mjs benchmarks/runs/2026-10-30/first-render output/first-render-replay-new
```

The expected nonzero exit preserves the old energy overflow. New tasks require their own domain checks; this checker rejects unrelated contracts. First raw generation and first user-delivered product are different stages: production delivery still includes actual rendering, fact review and repair, recorded honestly.

The public archived sources were replayed with the formatted runner. All 16 check statuses reproduced, including the old energy failure. The selected fee/terms check now inspects the actual confirmation panel, and selected-state screenshots are retained under `verification/`; initial visual preferences above remain based on the unchanged first-render images.
