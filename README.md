# UI Foundry

**Describe the product. Let your agent lead the design.**

English · [简体中文](README.zh-CN.md)

[Install](#install) · [ClawHub](https://clawhub.ai/theosunny/skills/ui-foundry) · [Download ZIP](https://github.com/theosunny/ui-foundry/releases) · [Validation](docs/validation.md)

A design-lead skill for websites, product workspaces and native apps. Turn “too much text”, “too many fields” or “this feels like a website” into specific design decisions—and check the result through real screens and real tasks.

## Install

Run one command, then choose your coding agent:

```sh
npx skills add theosunny/ui-foundry -g
```

Requires **Node.js 22.20+** for this installer. `-g` makes the skill available across projects; omit it to install in the current project. The design workflow itself needs no Node.js, API key or Python setup.

Targets include **Codex, Claude Code, Cursor, OpenCode and OpenClaw** through the [Skills CLI](https://github.com/vercel-labs/skills). For a specific agent, ClawHub, or installation without a terminal, see [all installation options](docs/installation.md).

## Then ask normally

> Use UI Foundry to improve this product. Decide the visual and interaction details, preserve what already works, and verify the result. Ask me only about decisions that materially change the product.

Or choose a smaller task:

| You need | Say |
| --- | --- |
| A new app | “Use UI Foundry to design and build this iPhone app. You choose the direction.” |
| A less demanding workflow | “This screen makes me read and type too much. Make the task easier.” |
| A brief for another agent | “Give me a complete design brief for this idea. Don't change code yet.” |
| A better design process | “Find why this design failed, improve the skill and test the correction.” |

In Codex, you can explicitly invoke **`$ui-foundry`**. Other clients use their own skill picker or invocation format. Reload the client if it requires that after installation.

## What changes

| Instead of | UI Foundry asks the agent to |
| --- | --- |
| Making you specify every component | Decide the audience, task and coherent design direction |
| Covering weak interactions with instructions | Reuse context, sensible defaults and direct actions |
| Replacing one generic theme with another | Design composition, typography, density, states and motion together |
| Shrinking a desktop page into a phone | Respect native navigation, touch, keyboard and safe areas |
| Calling a successful build “good design” | Review visual quality and task usability separately |
| Adding more rules after every failure | Fix the cause and recheck a relevant counterexample |

It preserves useful writing, efficient expert forms and consequential information. It does not require a particular framework, palette or component library.

## A skill, not another app to configure

Install it, describe your goal, and let the agent work. The package includes its own references, review template and optional helper:

```text
ui-foundry/                 # installed skill root
├── SKILL.md
├── agents/openai.yaml
├── references/
├── assets/review-record.json
└── scripts/check_design_gate.py
```

**You don't need to run Python to use UI Foundry.** The optional script checks a review record's structure; it cannot certify beauty or validate the evidence. When needed, the agent resolves it from the installed skill directory—not from your project's `scripts/` folder. [Advanced review checks →](docs/review-records.md)

## Scope and trust

The READMEs are available in English and Chinese. The skill instructions are currently written in Chinese; you can request output in your preferred language.

Installation checks do not establish identical behavior in every client. Browser checks cannot certify native-app behavior. See [what has actually been verified](docs/validation.md).

UI Foundry guides and reviews design; it cannot guarantee a perfect result on every task. Private profiles, chat history, credentials and personal product data are not bundled. It does not automatically upload project data or publish its own updates.

## Contribute

Found a failure? [Open an issue](https://github.com/theosunny/ui-foundry/issues) with a fictional or redacted example: the request, expected behavior, observed result and client used. Keep private data out of screenshots and logs.

[MIT-0 license](LICENSE) · [Changelog](CHANGELOG.md) · [Acknowledgments](ACKNOWLEDGMENTS.md)
