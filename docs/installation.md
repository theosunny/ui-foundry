# Installation

[简体中文](installation.zh-CN.md) · [Back to README](../README.md)

## 1. Recommended: one installer, multiple agents

With Node.js 22.20+ installed:

```sh
npx skills add theosunny/ui-foundry -g
```

Choose your agent when prompted. Omit `-g` for a project-only installation. To select an agent explicitly:

```sh
npx skills add theosunny/ui-foundry --skill ui-foundry -a codex -g
```

Replace `codex` with one of the identifiers below. These paths describe the [Skills CLI's current mapping](https://github.com/vercel-labs/skills/blob/main/docs/agents.md), not every client's alternative supported location.

| Client | `-a` identifier | Project skill directory | Global skill directory |
| --- | --- | --- | --- |
| Codex | `codex` | `.agents/skills/` | `~/.agents/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| OpenClaw | `openclaw` | `skills/` | `~/.openclaw/skills/` |

The installer normally links agent locations to a shared copy. Add `--copy` when symlinks are unsuitable. Avoid installing another copy under a legacy location; preserve local edits before replacing a skill.

Confirm, update or remove this global installation:

```sh
npx skills list -g
npx skills update ui-foundry -g
npx skills remove ui-foundry -g
```

For project installations, run in that project and use `npx skills list`, `npx skills update ui-foundry -p`, or `npx skills remove ui-foundry`. Reload the client as needed. See the [official command reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) for other agents and options.

## 2. ClawHub / OpenClaw

Run from the OpenClaw workspace where you want the skill:

```sh
npx clawhub@0.23.3 install @theosunny/ui-foundry
```

If the CLI is already installed, use `clawhub install @theosunny/ui-foundry`. Public installation does not require the author's login. The scoped package is installed under `skills/@theosunny/ui-foundry` relative to the configured workdir; `--workdir` and `--dir` can change the destination. This is a separate install method from Skills CLI.

[View the published skill](https://clawhub.ai/theosunny/skills/ui-foundry) · [Official ClawHub CLI reference](https://github.com/openclaw/clawhub/blob/main/docs/cli.md)

## 3. Download ZIP: no package manager

1. Open [Releases](https://github.com/theosunny/ui-foundry/releases).
2. Download the attached **`ui-foundry-<version>.zip`**, rather than GitHub's full source-code ZIP.
3. Extract and copy the entire `ui-foundry` folder into your client's skill directory. For the clients above, the global directories in the table are one documented option.
4. Keep `SKILL.md`, `references/`, `assets/`, `agents/` and `scripts/` together, then reload your client if required.

No Node.js or Python is needed to copy the folder. Copying only `SKILL.md` leaves required references behind. Updates are manual with this method.

## 4. Let your agent install it

Send this to an agent that can install skills:

> Install UI Foundry from https://github.com/theosunny/ui-foundry/tree/main/skills/ui-foundry for this client. Use its supported skill location and preserve existing local customizations.

This is an instruction for a capable agent, not a claim that every chat client can install local files. In Codex environments with the built-in skill-installer, it can use that installer directly.

## What's verified

See [installation checks](installation-validation.md) for exact versions and checks. Filesystem installation is distinct from runtime behavior in each client. The optional review checker lives **inside the installed skill's `scripts/` folder**; regular use does not require running it. [Advanced review checks](review-records.md).
