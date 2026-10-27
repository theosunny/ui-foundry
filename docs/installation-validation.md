# Installation validation · 安装验证

## 0.1.2 — 2026-10-27

Release source: [`39c91a0`](https://github.com/theosunny/ui-foundry/commit/39c91a07780ccbc6e56ac30ef902fe45e53d3ae2). [GitHub release](https://github.com/theosunny/ui-foundry/releases/tag/v0.1.2) · [passing CI run](https://github.com/theosunny/ui-foundry/actions/runs/40451824372).

| Check | Observed result |
| --- | --- |
| Unit and packaging checks | 28 tests passed locally; Python 3.10 / 3.13 on both Windows and Ubuntu passed in CI |
| Final archive browser check | Verifier checked the manifest, archive and every file, extracted a fresh Skill root, then ran 6 foundation checks and 9 reference-task checks; all passed locally and in CI |
| Reproducibility | Two local builds, downloaded Windows and Ubuntu CI builds, and the downloaded GitHub release ZIP have the same SHA-256 |
| GitHub download | All 12 canonical files matched the release manifest; no private profile or local environment is bundled |
| Skills CLI 1.7.4 | Public GitHub source installed with `--copy` into an isolated project for Codex, Claude Code, Cursor, OpenCode and OpenClaw; all 12 canonical file hashes matched at each physical install location |
| Installed helper | The full installed script path worked from an unrelated directory with spaces, using a record filename with spaces; untouched template remained UNVERIFIED / exit 3 |
| License | Root and bundled license match standard MIT; GitHub reports MIT. Old MIT-0 releases remain intact |
| ClawHub 0.1.2 | Submitted; registry returned `pending-publication`. Anonymous availability is not yet confirmed |

Archive SHA-256:

```text
2b2d6dbbe0d329ca33b7c657eaecae99d6a885ca56d276d39f9f83bf41cf0f7c
```

The [first CI run](https://github.com/theosunny/ui-foundry/actions/runs/40451655990) failed on Windows: a test compared native backslash paths with portable slash paths, and checkout changed the root license's line endings. The correction uses portable path representation and pins root-license LF bytes; the rerun passed. The release review also caught source-only browser testing and replay output overwriting historical evidence. The final runners test the extracted ZIP and keep replay output separate; original benchmark artifacts were not rewritten.

These checks verify named files, environments and web behavior. Installing into five client destinations does not mean five models were tested. No native device or human-usability study is claimed. The [benchmark results](../benchmarks/RESULTS.md) separately retain visual failures, repairs and evidence limits.

**中文：** 0.1.2 的 GitHub 安装包已下载回验；Windows、Linux 与本机构建字节一致，五种客户端安装目标的文件完整。最终 ZIP 中的界面底稿通过 15 项浏览器检查，28 项工程测试通过。原生运行、真人体验和各客户端生成质量仍未验证。

## 0.1.1 — historical record

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
