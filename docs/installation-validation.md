# Installation validation · 安装验证

2026-10-27 · Documentation and package update 0.1.1.

| Check | Observed result |
| --- | --- |
| Skills CLI 1.7.4, public GitHub source | Installed the then-current public 0.1.0 package in an isolated project with `--copy`, targeting Codex, Claude Code, Cursor and OpenCode |
| Skills CLI 1.7.4, local 0.1.1 source | Installed with the default symlink method in another isolated project, targeting Codex, Claude Code, Cursor, OpenCode and OpenClaw |
| Installed files | Canonical `.agents/skills/ui-foundry`, Claude Code `.claude/skills/ui-foundry` and OpenClaw `skills/ui-foundry` resolve to the expected entrypoint and bundled script |
| Optional Python helper | Called through its full installed path from an unrelated working directory; both working directory and JSON filename contained spaces; untouched template returned UNVERIFIED / exit 3 |
| Core package | 15 existing automated checks and skill-creator structure validation passed |
| GitHub 0.1.1 release | Public bilingual files matched the committed source; downloaded release ZIP matched its SHA-256 and all 8 bundled source files |
| ClawHub 0.1.1 | After pending publication, installed anonymously into a fresh directory; all 8 published files matched the source byte for byte |

The tested installation command selected explicit agents and used `--yes` for non-interactive validation. The README's shorter interactive command and global `-g` option follow the [official CLI documentation](https://github.com/vercel-labs/skills/blob/main/docs/commands.md). Global directories were not overwritten to test these instructions.

This verifies discovery, file placement, symlink/copy installation and script resolution. It does **not** verify runtime behavior or automatic activation inside all five clients. It does not validate a newly designed product's visuals. ClawHub 0.1.0 anonymous installation was separately verified in the [initial release record](validation.md); 0.1.1 received the additional anonymous download check above.

## 中文

本轮分别在临时项目中验证 GitHub 来源的复制安装、本地 0.1.1 的默认符号链接安装。五个客户端名称是安装目标，不代表已经分别启动五个客户端验收设计能力；没有覆盖用户真实的全局安装。

Python 脚本已从一个完全无关、路径含空格的工作目录调用成功，使用的是安装后的 Skill 完整路径。普通用户不需要手动执行这一步。

GitHub 的 0.1.1 安装包与 ClawHub 的 0.1.1 匿名安装均已回验，8 个发布文件与源码一致。
