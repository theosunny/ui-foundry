# A design system the agent can use

UI Foundry combines **design decisions, concrete visual foundations, component adapters, rendered inspection and repair**. The user brings a product goal. The agent selects and implements a coherent direction instead of asking the user to specify fonts, colors and controls.

| Layer | Included | Evidence / boundary |
| --- | --- | --- |
| Design direction | Task and platform routing, composition, type, density, semantic colors and motion | [Visual recipes](../skills/ui-foundry/references/visual-recipes.md); defaults adapt to an accepted brand |
| Usable foundation | Original scoped CSS; runnable local scheduling reference with editing, draft retention and persistence | [CSS](../skills/ui-foundry/assets/web-foundation.css), [reference](../skills/ui-foundry/assets/workspace-reference.html); fictional demo, not a production backend |
| Interaction implementation | Object selection, direct editing, feedback, undo patterns; existing components take precedence | [Practice](../skills/ui-foundry/references/design-practice.md); do not transplant the reference's domain into another product |
| Stack adapters | HeroUI for compatible React/Tailwind projects; existing shadcn/Base UI; plain HTML; native toolkit routing | [Adapters](../skills/ui-foundry/references/tool-adapters.md); installing a library does not certify the product |
| Task components | Platform routing for dates, places, search, selection, files, navigation and feedback; reusable Web and server code plus SwiftUI example | [Component kit](component-kit.md); actual service connection and native execution remain separate checks |
| Validation | Browser task checks, same-content screenshots, contrast/focus/layout checks, independent review | [Benchmark](../benchmarks/README.md); visual and functional results remain separate |
| Improvement | Retained failure, diagnosed cause, new attempt, original regression and a new-task check | [Maintenance](../skills/ui-foundry/references/maintenance.md); authorized changes only |

## Why more than a prompt

A process-only skill can still yield a generic screen: the model has to improvise every visual decision, and a good-looking report can conceal a poor layout. This version supplies a concrete starting surface and verifies it. For example, the reference makes the object title editable in place; it does not add a second title, a summary card and an explanation before the same form. On a phone, selection stays reachable and the core fields plus Save fit in the tested viewport.

The foundation is deliberately small. It is not an independent component framework, an asset marketplace or a hosted generation service. Its agent still needs a model and suitable development/rendering tools. Existing mature controls supply their tested interaction behavior; UI Foundry decides how they serve the product and verifies that integration.

## Reference systems

[Lovable's design-system documentation](https://docs.lovable.dev/features/design-systems) describes distributing React components, design rules, dependencies and versioned setup together, then checking the connection. We adopt that separation of responsibilities, without claiming Lovable's implementation or comparative output quality.

[HeroUI v3](https://heroui.com/en/docs/react/getting-started/quick-start) provides a React 19+/Tailwind CSS 4 component foundation. [Impeccable](https://github.com/pbakaus/impeccable) provides design and review workflows. They remain optional integrations with their own licenses and requirements; neither is silently installed or bundled. Reference/inspection tools such as REA can inform observations when actually available; their absence does not remove the agent's design responsibility.

## 标准化、量化、复制

- **标准化**：同一个产品沿用已确定的视觉 token、组件组合、状态与返回方式；默认方案由 Agent 选好，不让用户填设计问卷。
- **量化**：记录任务是否完成、重复输入/额外决策、数据保留、窄屏溢出、对比度和焦点。视觉另做具体对照评审，不编一个总分冒充审美。
- **复制**：完整底稿和规则随安装包分发，环境与版本记入项目，公开任务、产物和复测脚本。
- **修复**：明确不合格就修责任层并重验；保留失败，缺证据保持未验。获奖是愿景，不作为自颁认证。

The public evidence currently covers a small web pilot and bounded integration checks. Native guidance is included; a native app was not built or tested in this release's benchmark. Broad reliability and user satisfaction need repeated tasks and real-user evaluation.
