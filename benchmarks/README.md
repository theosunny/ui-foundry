# UI Foundry benchmark protocol

A benchmark tests an advertised result, not the number of rules in SKILL.md. This suite compares an agent using UI Foundry with the same platform agent without it. It is a **small public pilot**, not a claim of universal quality or a ranking against other skills.

## Frozen tasks and outcomes

- **Schedule:** improve a fictional team scheduling screen; preserve editable data and actual save behavior. `tasks/schedule/request.txt`, `CONTRACT.md` and `index.html` are the complete starting input.
- **Brief:** produce an English native-iPhone design brief for household food expiry, with known and unknown dates; no app implementation. Inputs live in `tasks/brief/`.

The following criteria are fixed before reading outputs. Implementers receive the request and contract, not this scoring sheet.

| Dimension | Observable check |
| --- | --- |
| Scope | Work only in the assigned artifact; no backend, account system, dependencies or product expansion. Brief stays a brief. |
| Task effort | Does saving an existing event require retyping its known name? Record mandatory redundant input, field edits and context switches; don't equate fewer buttons with better UX. |
| Preservation | Existing records and unknown fields survive. Save affects only selected event. Note survives another field change. Switching events preserves a draft or asks before discarding it. |
| Functional result | Change date/time/note, save, reload and inspect actual storage; repeat on another record/date. Title/location remain editable. |
| Web usability | Inspect desktop and 390px layouts. Check horizontal overflow, accessible names, keyboard access and feedback. These spot checks are not a WCAG certification. |
| Visual direction | Review anonymized screenshots at the same viewport and content. Judge hierarchy, typography, density, coherence and mobile arrangement separately from function. Prefer A, B, tie or unverified with concrete reasons. |
| Brief quality | English output; one household task; unknown dates stay unknown; camera recognition isn't invented; practical native keyboard/navigation/accessibility considerations; no claims of device testing. |
| Honest completion | Report only performed checks. A screenshot is not proof of persistence, and a planning document is not a running app. |

Critical functional loss is `rework`, even if the screenshot is attractive. Missing execution evidence is `unverified`, not a pass or automatic failure. Visual preference cannot cancel data loss.

## Comparable execution

1. Freeze input files and criteria. Record hashes, skill snapshot, environment and run identity.
2. Use fresh contexts, the same inherited model/tool environment, the same task inputs and allowed resources. One arm loads only the public skill; the other loads no design skill. Exclude private profiles and project history from both.
3. One initial run per arm/task. Fixing a defect observed during that run is allowed and must be reported. Do not generate alternatives and select the best.
4. Preserve exact outputs and stated checks. The reviewer first sees only anonymous artifacts and task facts; reveal the arm mapping after their verdict.
5. Run the same task-level checks on both. Record omissions and failures, not only successes. Report cost, time or model details only if the harness exposes them.

This environment does not expose a resolved model ID, temperature, token cost or a guarantee that all host defaults are absent. Record those limits instead of inventing reproducibility. Existing artifacts can be re-inspected; identical model regeneration is not guaranteed.

## Repair without hiding the failure

- Freeze the failed output and verdict. Attribute the defect to implementation, workflow or insufficient evidence before changing anything.
- Correct the smallest responsible layer within the user's authorization. If a skill rule already says the right thing, look at routing, conflicts and execution rather than adding another slogan.
- Rerun the original case plus a relevant counterexample. Store a **new** attempt with the exact changed version. Never replace the initial record or loosen its criteria.
- If the case helped tune the skill, mark it a regression case. Use a new held-out task for any claim of transfer. Keep failure and `unverified` counts visible.
- Do not automatically publish, alter another client's settings or upload private materials just because a benchmark failed.

## What these results can support

Package tests support packaging claims. Successful task checks support only the tested behavior. A paired pilot can show a local improvement, tie or regression. Broad claims about reliably better design need multiple tasks, independent repeated runs, more than one model/client and human usability/visual reviews. Native-app claims need real device or simulator evidence.

See [results and corrections](RESULTS.md), [the initial run manifest](runs/2026-10-27/pilot/manifest.json), and [the complete design system](../docs/design-system.md). Original README artwork is illustrative and is not included as a successful benchmark output.

## Replay existing artifacts

From the repository root, Node 24 and an installed Chrome channel are required. Only test dependencies are installed; they are not part of the Skill package.

```sh
cd benchmarks
npm ci --ignore-scripts
python3 ../tooling/package_skill.py
node check_release.mjs ../dist/ui-foundry-0.1.2.zip
node check_schedule.mjs runs/2026-10-27/pilot --output output/replay/schedule A B
node check_reading.mjs runs/2026-10-27/repair/reading --output output/replay/reading
node check_foundation.mjs --css ../skills/ui-foundry/assets/web-foundation.css --output output/replay/foundation
```

The pilot command intentionally exits nonzero because it reproduces the preserved empty-list defect. The release command verifies the **actual ZIP and manifest**, extracts a fresh copy, and tests those installed assets; use the matching archive version. Each release check creates a new ignored evidence directory. Other replays need an explicit, separate output directory. The runners reject output under `benchmarks/runs/`, or any output that overlaps its input; committed evidence is read-only. Use ignored `output/` for local replay evidence and create a new attempt only when recording a new repair.

For the optional HeroUI fixture, run `npm ci --ignore-scripts` and `npm run verify` inside `integrations/heroui/`; its locked dependencies and scope are documented there. This does not add HeroUI to the public Skill's dependencies.

## 复测与自动修复

这是公开的小样本对照，不是“用了就一定更好”的认证。固定任务、相同模型环境、独立上下文；一组加载公开 Skill，一组不加载。先匿名看产物，再揭晓分组。记录完成真实任务的负担、数据保留、视觉取舍和声明是否属实。

已确认不合格时自动在授权范围内修复，再测原失败和反例；保留旧结果，不改验收标准。用于调参的题目只能证明回归修复，不能冒充新的泛化测试。没运行设备、没做真人测试，就如实保留未验证状态。
