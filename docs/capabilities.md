# Capability and evidence map / 能力与验证范围

Use this map to distinguish a runnable reference from an interaction standard. The agent chooses and integrates the right mechanism for the target product; a reference never certifies the product that copies it.

| Task | Shipped starting point | Evidence in this repository | Still required in the target product |
| --- | --- | --- | --- |
| Schedule/edit an existing object | [Web workspace](../skills/ui-foundry/assets/workspace-reference.html) | Browser edits, save, reload, known empty state and narrow viewport | Connect real storage, permissions, validation and product-specific states |
| Pick a date and place | [Web kit](../skills/ui-foundry/assets/web-patterns/), [server adapter](../skills/ui-foundry/assets/place-service/) | Browser interactions and mocked provider failures; local date semantics | Real service/account setup, auth, billing and end-to-end vendor request; Web example does not ship a live map |
| Browse/search/favorite/create/edit/remove | [Collection reference](../skills/ui-foundry/assets/collection-reference.html) | [Six browser checks](../benchmarks/runs/2026-10-30/collection/review.md), local storage only | Appropriate product model, real persistence/sync, privacy, input and accessibility checks |
| iOS meeting editor | [SwiftUI reference](../skills/ui-foundry/assets/native-patterns/MeetingEditor.swift) | iOS target typecheck, date semantics and [simulator initial frame](../benchmarks/runs/2026-10-30/ios-reference/README.md) | User interaction, system keyboard, real MapKit search, state persistence and device review |
| Upload/media, charts, tables, boards, authentication, AI review, checkout | [Interaction contracts and routing](../skills/ui-foundry/references/component-patterns.md) | Design guidance only; no complete implementations claimed | Choose platform/project implementation and test data, error and recovery states |
| Android native application | Android routing in [visual recipes](../skills/ui-foundry/references/visual-recipes.md) | Guidance only | Implement with the project's Android stack; run an emulator/device and verify system behaviors |

## Choosing a solution beyond the examples

1. Identify the user intent, existing context, business value and actual result; preserve accepted brand and working features.
2. Prefer an existing project component; otherwise use the platform control or a mature library compatible with its stack. Reuse bundled code only if its semantics and license fit.
3. Compose a custom interaction when it materially improves the task, with keyboard or system-accessible alternatives, explicit save/cancel/failure behavior and a real data contract.
4. Inspect the rendered result and exercise success, one failure or interruption, and the relevant narrow-screen or native path. Compare actual user effort, not a count of input fields.
5. Record exactly what ran and repair observed mismatches. A blocked external service, missing device, mock or unreviewed aesthetic is reported as such.

## 已实现与待验证

本表是开发版的能力清单。搜索、收藏、编辑和撤销是可运行的本地示例；登录、上传、看板、支付和 Android 原生目前是选型与验收标准，不是完整的随包实现。示例与标准会按真实任务和验证结果扩展，不能穷举每个领域，也不会将统一配色或单一组件库强加给所有产品。
