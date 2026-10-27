# 安装说明

[English](installation.md) · [返回 README](../README.zh-CN.md)

## 1. 推荐：一个安装器，选择不同 Agent

已安装 Node.js 22.20+ 时，运行：

```sh
npx skills add theosunny/ui-foundry -g
```

按提示选择客户端。去掉 `-g` 只安装到当前项目。需要直接指定客户端时：

```sh
npx skills add theosunny/ui-foundry --skill ui-foundry -a codex -g
```

把 `codex` 换成下表的标识即可。这里列的是 [Skills CLI 当前使用的路径](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)，不代表各客户端只接受这一种目录。

| 客户端 | `-a` 标识 | 项目 Skill 目录 | 全局 Skill 目录 |
| --- | --- | --- | --- |
| Codex | `codex` | `.agents/skills/` | `~/.agents/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| OpenClaw | `openclaw` | `skills/` | `~/.openclaw/skills/` |

安装器通常将客户端目录链接到共享副本；不适合符号链接时可添加 `--copy`。若旧目录已有安装，先保留本地定制，避免重复装两份。

查看、更新、移除这份全局安装：

```sh
npx skills list -g
npx skills update ui-foundry -g
npx skills remove ui-foundry -g
```

项目安装则在该项目中使用 `npx skills list`、`npx skills update ui-foundry -p` 或 `npx skills remove ui-foundry`。按客户端要求重新加载。更多客户端和参数见[官方命令说明](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)。

## 2. ClawHub / OpenClaw

在需要安装的 OpenClaw 工作目录中运行：

```sh
npx clawhub@0.23.3 install @theosunny/ui-foundry
```

如果已有 CLI，可直接用 `clawhub install @theosunny/ui-foundry`。公开安装不需要作者登录态。带作者名称的包安装到配置工作目录下的 `skills/@theosunny/ui-foundry`，`--workdir` 和 `--dir` 可改变位置。这与 Skills CLI 是两个独立安装方式。

[打开已发布的 Skill](https://clawhub.ai/theosunny/skills/ui-foundry) · [ClawHub 官方 CLI 文档](https://github.com/openclaw/clawhub/blob/main/docs/cli.md)

## 3. 下载 ZIP：不使用包管理器

1. 打开 [Releases](https://github.com/theosunny/ui-foundry/releases)。
2. 下载附带的 **`ui-foundry-<版本>.zip`**，不要选 GitHub 自动生成的完整源码 ZIP。
3. 解压，把整个 `ui-foundry` 文件夹放到客户端的 Skill 目录。上表中的全局路径是对应客户端可用的文档选项。
4. 保持 `SKILL.md`、`references/`、`assets/`、`agents/` 和 `scripts/` 一起，按客户端要求重新加载。

复制文件夹不需要 Node.js 或 Python。只复制 `SKILL.md` 会丢失参考文件。这种安装方式需要手动更新。

## 4. 让 Agent 帮你安装

将这句话发给具备 Skill 安装能力的 Agent：

> 从 https://github.com/theosunny/ui-foundry/tree/main/skills/ui-foundry 为当前客户端安装 UI Foundry。使用这个客户端支持的 Skill 目录，保留已有的本地定制。

这是给具备能力的 Agent 的指令，不代表所有聊天客户端都能安装本地文件。带内置 skill-installer 的 Codex 环境可以直接使用该安装器。

## 验证范围

具体工具版本和结果见[安装验证记录](installation-validation.md)。文件安装成功与客户端内的实际行为分开验证。可选审核脚本位于**已安装 Skill 内部的 `scripts/` 目录**，普通使用不用手动运行。[进阶审核说明](review-records.md#中文)。
