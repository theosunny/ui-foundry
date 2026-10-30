# Open-source readiness / 开源验收标准

UI Foundry is a **public beta**, intended for independent developers and small teams without a dedicated product designer. Its job is to help a coding agent make design decisions, reduce unnecessary user effort, preserve useful behavior and check the actual result. It is not a UI component library, an automatic design certification service or a guarantee of commercial success.

A good open-source skill needs the following, not a long list of rules or an attractive README alone.

| Area | Acceptance standard | Public evidence |
| --- | --- | --- |
| Positioning | Named audience, task, output and non-goals; claims match measured evidence | [README](../README.md), [claim register](claims.md) |
| Instructions | Clear activation and deliverable scope; runnable without private history; references discovered as needed; no arbitrary theme mandate | [Canonical skill](../skills/ui-foundry/SKILL.md) |
| Product utility | Representative tasks completed, useful existing behavior preserved, avoidable user work reduced | [Paired benchmark protocol](../benchmarks/README.md) and per-run artifacts/results |
| Visual and platform quality | Actual renders and task checks; independent visual review; native claims need native execution | Per-run screenshots and review; static README artwork is excluded |
| Failure recovery | Preserve failed artifact, fix responsible layer, rerun original and counterexample; no changing standards to pass | [Maintenance](../skills/ui-foundry/references/maintenance.md), [benchmark repair protocol](../benchmarks/README.md#repair-without-hiding-the-failure) |
| Code reliability | Valid/malformed records handled, no false claim of design certification; relevant tests on supported environments | [Tests](../tests), [CI](https://github.com/theosunny/ui-foundry/actions) |
| Distribution | Complete package, exact manifest, version/license consistency, reproducible ZIP, downloaded/installed bytes verified | [Release procedure](releasing.md), [installation records](installation-validation.md) |
| User safety | Local permission boundaries, no bundled private data, no default telemetry or unapproved publication, private security reporting | [Security policy](../SECURITY.md) |
| Documentation | Clear quick start, complete install/update/remove paths, language variants in sync; separate using from maintaining | [Installation](installation.md), [中文安装](installation.zh-CN.md) |
| Community maintenance | Small reproducible issues, contribution requirements, license, changelog, focused PR review | [Contributing](../CONTRIBUTING.md), [issue template](../.github/ISSUE_TEMPLATE/design-failure.md), [MIT](../LICENSE) |

## Evidence levels

- **Verified within scope:** a named check ran against a named artifact/version and its result is available.
- **Limited support:** an observation exists, but few tasks, one environment or no real users limit generalization.
- **Unverified:** no appropriate observation yet. It is not passed by a good README or passing unrelated tests.
- **Rework:** an actual contradiction or defect was observed. Fix it and preserve both attempts.

These levels apply per claim. They are not averaged into a single “95/100” maturity score.

## Release status

The repository can be published and contributed to as a beta. A broad claim that it consistently produces better-looking and more usable products requires more evidence: repeated held-out tasks, multiple model/client combinations, real users, accessibility assessment, and native device/simulator runs. Those are not replaced by filesystem installation into several client directories.

Concrete open acceptance items and current evidence are tracked in [validation still needed](next-validation.md).

## 中文

开源合格不等于“任何需求一次做完美”。验收要回答：服务谁、解决什么、别人是否装得上、规则是否独立可用、效果是否有真实证据、失败能否修复、别人能否复现与参与。

本项目按表中十项逐项记录证据。工程与分发可以用自动检查保证具体不变量；审美和交互必须检查真实产物。单次 AI 评审与两道题的对照只能支持局部结论，不足以宣传稳定领先。

发现不合格自动在当前授权内修复；原失败、修订原因、复测结果和未验范围均保留。缺环境时补能做的证据，不编造通过，不自行扩大到其他产品或全局配置。
