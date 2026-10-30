# Four-arm design experiment

The experiment measures a bounded question: do compact rules, decision examples, or their combination change outcomes for the same user tasks? It is not a certificate for every industry, the full UI Foundry package, native apps or every model.

## Frozen inputs

The [manifest](../benchmarks/runs/2026-10-30/factorial/manifest.json) records input and artifact hashes. The [tasks](../benchmarks/runs/2026-10-30/factorial/tasks.json) and [rubric](../benchmarks/runs/2026-10-30/factorial/rubric.json) were saved before artifact inspection. Four fresh agent contexts received baseline, rules, examples or both; each implemented the same two contracts. They were told not to read other arms, repository Skills or private profiles. Host instructions and tool exposure cannot be guaranteed absent; two tasks share each arm's context. Exact resolved model ID, cost and time were not exposed.

This tests compact guidance derived from the Skill, not a complete ablation of the installed package. The explicit task contracts already contain strong data-preservation requirements, which may reduce differences between arms. English Web demos were used; native behavior and Chinese typography are outside this pilot.

## Actual behavior results

| Arm | Repair comparison | Exhibit editor | Total |
| --- | --- | --- | --- |
| Baseline | 5/5 | 5/5 | 10/10 |
| Rules | 4/5 | 4/5 | 8/10 |
| Examples | 5/5 | 5/5 | 10/10 |
| Combination | 5/5 | 5/5 | 10/10 |

Every arm preserved the tested saved data, unknown fields and editable drafts. The rules-only arm overflowed the 390px viewport in both tasks (391px and 410px). These are initial outputs, not selected best attempts. No arm was repaired after generation for this table. The paired sample has only two tasks with one generation per arm: it does not establish a reliable gain, effect size or general win rate.

The [corrected observations](../benchmarks/runs/2026-10-30/factorial/fresh-viewport/results.json) and all source artifacts are public. The comparison's measured behavior is a tie between baseline, examples and combination. The experiment does **not** support claiming that the combination is consistently better.

## Harness corrections

The first runner omitted a valid `data-select` quote control and falsely reported D failures; it was corrected and every unchanged artifact rerun. A resized-viewport screenshot also showed a duplicated lower header not present in a fresh 390px context; mobile screenshots were recaptured without changing the source. Both initial observations and reviews are retained. The no-overflow criterion was not relaxed.

## How to extend beyond industries

Add a task based on its user work and data contract rather than an industry label: discover/compare, choose/commit, create/edit, execute/track or collaborate/handoff. Vary frequency, density, consequence, device and existing brand. Each task needs its own observable domain checks and fresh generation inputs; unrelated contracts must not be fed through an existing task checker and silently counted as verified.

Use new held-out tasks after modifying guidance. Repeat arms, preserve all outputs and report ties/failures. Human and multi-model evidence remains necessary for broad preference/reliability claims. AI screenshot review is a limited independent observation, not human usability research.

Replay from repository root (Node 24, benchmark dependencies and Chrome):

```sh
node benchmarks/check_factorial.mjs benchmarks/runs/2026-10-30/factorial output/factorial-replay-new
```

The expected exit code is nonzero because the original rules-only viewport failures are preserved. Output must be a new directory outside the input and committed history.

## Independent static visual review

The reviewer saw anonymous desktop and initial mobile screenshots before the mapping was revealed. It preferred the examples-only repair comparison and the baseline exhibit editor. The combination did not win either comparison. Fresh-viewport recapture removed the initial duplicate-header concerns; preferences were unchanged. The [original review](../benchmarks/runs/2026-10-30/factorial/blind-review-initial.md), [fresh review](../benchmarks/runs/2026-10-30/factorial/blind-review-fresh.md) and mapping are retained. This is one AI review, not a human panel or a statistical preference estimate.

## Repair after observation

The combination outputs were then repaired in a separate round. The first edit did not materially improve the quote layout because earlier CSS was overridden; the independent reviewer also found weaker editor identity. The second edit corrected the cascade and compacted comparison without removing fees, times or warranties. Both repaired flows retained all 10 original behavioral passes. An additional mobile check confirmed the selected CNY 220 fee and confirmation button are visible before confirming, with cancellation terms present. Static review passed both repaired layouts within screenshot scope. See [both repair rounds](../benchmarks/runs/2026-10-30/factorial/REPAIR.md). This is a working observe/repair/retest loop, not evidence that the initial combination beats other arms.
