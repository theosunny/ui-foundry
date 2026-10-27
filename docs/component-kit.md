# Component kit · 场景组件

The delivery goal is a usable product flow: the agent selects controls, connects data and handles state changes. Users provide their goal and material constraints; they do not need to specify a component library, map SDK or animation recipe.

“Ready to use” describes the delivered product, not just a folder of samples: the main action creates a real result, returning or reloading preserves it, cancellation keeps committed data, and failure offers recovery. The agent owns the integration and verification. A prototype explicitly requested by the user may use labeled fixtures; a product must connect its actual data and permissions before it is reported as complete.

## What travels with the Skill

| Resource | Use | Boundary |
| --- | --- | --- |
| [Scenario routing](../skills/ui-foundry/references/component-patterns.md) | Choose controls for dates, places, search, selection, uploads, editing, navigation and feedback across Web/iOS/Android | A routing guide, not a claim that every listed component was tested here |
| [Web interaction kit](../skills/ui-foundry/assets/web-patterns/) | Real HeroUI controls with calendar, searchable place selection and saved state | Fictional local demo by default; the agent connects the target app's data and permissions |
| [Place service](../skills/ui-foundry/assets/place-service/) | Server-side AMap POI v5 search, typed result shape, abort/timeout handling and same-origin route adapter | Needs the application's server key and real auth/rate-limit policies; live vendor search is not verified by a mocked test |
| [SwiftUI reference](../skills/ui-foundry/assets/native-patterns/MeetingEditor.swift) | iOS 17+ system date selection, search, resolved MapKit preview and manual fallback | Component reference, not a full app or backend; compilation does not establish native UX quality |

This is an extensible interaction standard, not a fixed catalog or visual theme. The included web kit is one verified example; unfamiliar tasks use the same contract: name the user intent and semantic result, reuse known context, select a compatible platform/library behavior, expose necessary loading/empty/error/cancel/recovery states, and verify an observable result. The agent may compose or create constrained custom interaction when a task needs it, but must retain familiar behavior, an accessible alternative and a reason the standard control is insufficient.

The routing covers more than the shipped examples: data exploration and tables, bulk actions, boards and drag/drop, rich text/media, authentication and permissions, offline uploads and undo, AI streaming/review/approval, and consequential commerce flows. It does not claim every task family has an implementation in this package. Platform-native controls, an established project library and narrow task-specific composition remain the default order of choice.

The package does not install these dependencies into every project. An agent selects the relevant code, checks the existing stack and makes the necessary integration. Existing design systems and brands remain first-class inputs. Do not mix two overlapping primitive libraries to get a single new control.

## A place is more than a text field

A location query, a manually entered place and a resolved provider result are separate states. Store the provider identity and coordinate system with resolved results. Typing a new query must not silently preserve coordinates for the old place. Offer a map only when it helps a decision and has genuine resolved data. Permission denial or service failure should leave a usable manual path.

The included adapter uses an injected server key. It does not discover credentials, subscribe to a service or send demo queries to a vendor. AMap's GCJ-02 values must not be passed unchanged to a consumer expecting another coordinate system. Keyword search itself does not require permission to read the user's location.

## Motion is part of state behavior

Selection, expansion, cancellation and confirmation should connect cause to effect. Prefer platform motion, keep it interruptible, respect reduced-motion settings and never wait for an animation to complete before applying a successful change. Empty decoration, repeated entrance effects and fake progress do not improve task completion.

## 验证范围

组件的引入、构建、浏览器操作、原生编译、真机体验、外部服务连通分别记录。具体结果见 [公开验证记录](../benchmarks/RESULTS.md)。没有地图 Key 时验证服务适配器的协议与失败处理，不冒充已经接通高德；Android 目前提供组件路由及官方资料，没有声称交付经过运行验收的 Compose App。

这套资源支持 Agent 交付开箱可用的任务流程。目标项目仍要验证自己的数据、权限、页面与设备，不能把范例通过算成所有新产品自动合格。
