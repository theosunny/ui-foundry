<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/wordmark-dark.svg" />
    <img src="docs/assets/wordmark-light.svg" width="300" height="70" alt="UI Foundry" />
  </picture>
</p>

<h3 align="center">Your coding agent. Your design lead.</h3>

<p align="center">For independent developers and small teams building without a designer.</p>

<p align="center">
  <a href="#start"><strong>Get started</strong></a> &nbsp;&nbsp;
  <a href="docs/installation.md">Choose your agent</a> &nbsp;&nbsp;
  <a href="benchmarks/README.md">Public benchmark</a> &nbsp;&nbsp;
  <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <picture>
    <source media="(max-width: 600px)" srcset="docs/assets/interface-study-mobile.svg" />
    <img src="docs/assets/interface-study.svg" width="1200" alt="Interface study: a focused publishing workspace and a mobile sheet for directly choosing a date." />
  </picture>
  <br/>
  <sub>Original interface study · Fictional content · An illustration of the design approach, not a shipped app.</sub>
</p>

**You shouldn't have to become a designer to get a well-designed product.**

UI Foundry gives your coding agent a practical design system: **concrete visual foundations, a runnable interface reference, interaction patterns, component adapters and a repair loop**. Bring an idea or an existing screen. Your agent chooses and builds the design; you decide the product goal and important constraints.

<p align="center">
  <strong>Web · Product workspaces · Native apps</strong><br/>
  <sub>Public beta · MIT · No extra service or API key required by the skill</sub>
</p>

<a id="start"></a>

## Install once. Start with your idea.

```sh
npx skills add theosunny/ui-foundry -g
```

Choose **Codex, Claude Code, Cursor, OpenCode or OpenClaw** in the installer. Then ask:

> Use UI Foundry to make this product look and feel good. Decide the design details, make the main task easier, and check the actual result. Keep what already works.

That's enough to start. You can bring an idea, an existing screen, a repository or a rough sketch.

<details>
<summary>Installation details, other methods and invocation</summary>

The [Skills CLI](https://github.com/vercel-labs/skills) requires **Node.js 22.20+**. `-g` installs across projects; omit it for the current project. The skill itself needs no Node.js or Python setup.

In Codex, invoke **`$ui-foundry`** explicitly if needed. Other clients use their own skill picker or invocation format; reload the client if required.

[Specific agents & manual installation](docs/installation.md) · [ClawHub](https://clawhub.ai/theosunny/skills/ui-foundry) · [Download ZIP](https://github.com/theosunny/ui-foundry/releases)

ClawHub and GitHub versions can differ; see the [installation record](docs/installation-validation.md) for the last verified status.

</details>

## The details that make a difference

| A clear visual direction | Less effort to get things done | A review of the real result |
| --- | --- | --- |
| Composition, typography and states that belong together. A mobile app that behaves like one. | Reuse what's known. Put actions next to the content. Ask for information only when it's needed. | Inspect rendered screens and try the task. Fix observed problems, then check again. |

It includes ready-to-use typography, spacing, light/dark color tokens and a working interface example. Your agent selects and adapts them to the task, preserves an accepted project identity and uses compatible components. You don't have to choose a library or invent a palette. [See the complete system](docs/design-system.md).

**Common interactions are part of the design.** Dates, search, places, selection, uploads, navigation and feedback route to suitable Web, iOS or Android controls. The package includes a runnable Web interaction kit, a server-side place-search adapter and a SwiftUI reference. The agent connects data, cancellation, errors and meaningful motion. [Component kit and verified scope](docs/component-kit.md).

The standard extends to unnamed scenarios: reuse common implementations or design for a special task within explicit data, platform, state and verification requirements. Quality requirements stay consistent; creative decisions remain open.

Runnable references currently include scheduling, place selection and [a collection flow](skills/ui-foundry/assets/collection-reference.html) with search, filters, editing, persistence and undo. Uploads, boards and payments currently have selection and verification guidance, not complete bundled implementations. [See the capability map](docs/capabilities.md).

## Start wherever you are

| What you have | What to ask |
| --- | --- |
| **An idea** | “Design and build this iPhone app. You choose the direction.” |
| **A frustrating screen** | “I have to read and type too much here. Make the task easier.” |
| **A brief for another agent** | “Turn this idea into a complete design brief. Don't change code yet.” |
| **A result that missed** | “Find why this design failed, fix the cause and check the correction.” |

The workflow is simple: **understand the task → design → build → inspect → refine**. Reviews distinguish a checked result, a known defect and missing evidence. A successful build alone doesn't settle the design.

## Show the evidence

We compare the same tasks with and without UI Foundry, preserve both outputs, test actual saved data, and review anonymized screens. Failures stay in the record; repairs get a new attempt and a counterexample check. The first pilot is small and does not establish reliable superiority.

The [four-arm experiment](docs/factorial-evaluation.md) now includes actual baseline/rules/examples/combination outputs in two different domains. Behavior results tie between baseline, examples and combination; rules-only outputs have two narrow-screen failures. This is limited pilot evidence, not a stable design-improvement claim.

[Benchmark & results](benchmarks/README.md) · [Open-source review](docs/open-source-readiness.md) · [What our claims require](docs/claims.md)

## Inside the skill

Visual recipes, CSS foundations, a runnable reference, component adapters and review tools travel together. An optional helper lives at `ui-foundry/scripts/check_design_gate.py` inside the installed skill. Your agent resolves its location; **you don't need to run Python**. It checks record structure, not beauty or evidence quality.

[Read the skill](skills/ui-foundry/SKILL.md) · [Review workflow](skills/ui-foundry/references/review.md) · [Advanced helper usage](docs/review-records.md)

<details>
<summary>Language, verification and privacy</summary>

The READMEs are in English and Chinese. Internal skill instructions currently use Chinese; ask for output in your preferred language.

Installation checks don't establish identical behavior in every client. Browser checks don't certify native-app behavior. See the [behavior checks](docs/validation.md) and [installation checks](docs/installation-validation.md) for the actual scope. The interface study above is original illustrative artwork, not a measured before/after result.

UI Foundry supplies design foundations and an implementation/review workflow; it cannot guarantee a perfect result every time. Private profiles, chat history, credentials and personal product data are not bundled. It doesn't automatically upload project data or publish its own updates.

</details>

## Make it better

Found a failure? [Open an issue](https://github.com/theosunny/ui-foundry/issues) with a fictional or redacted example: your request, expected result, actual result and client. Useful feedback helps improve the workflow.

[Contribute](CONTRIBUTING.md) · [Security](SECURITY.md) · [MIT](LICENSE) · [Changelog](CHANGELOG.md) · [Acknowledgments](ACKNOWLEDGMENTS.md)
