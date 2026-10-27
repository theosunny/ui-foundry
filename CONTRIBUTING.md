# Contributing / 参与改进

UI Foundry helps independent developers and small teams delegate product design to their coding agent. Contributions should improve a decision or an observed result, not merely add more instructions.

## Smallest useful contribution

1. Open an issue with a fictional or redacted request, starting state, actual result and expected result. Say which skill version and client you used. Separate visual complaints, task-flow defects and missing verification.
2. Fix the smallest responsible layer: implementation, project convention, skill guidance or tooling. A project-specific color preference is not a universal skill rule.
3. Retest the failure and a nearby case that should remain unchanged. Keep failing observations. Don't change the acceptance criteria to make a patch pass.
4. Send a focused PR with the problem, change, real checks and limitations. For guidance changes, include the anonymous output or artifact and follow the [benchmark protocol](benchmarks/README.md).

English and Chinese are welcome. Keep both README/installation variants aligned when changing public instructions. Runtime instructions live in `skills/ui-foundry`; contributor/release tools and benchmark artifacts stay outside the installable package. No dependency or new reference is required without a concrete use.

## Checks

From the repository root, with Python 3.10 or newer:

```sh
python3 -m unittest discover -s tests -v
python3 tooling/package_skill.py
```

The optional runtime checker is `skills/ui-foundry/scripts/check_design_gate.py`; ordinary users don't run contributor commands. These checks validate code, package boundaries and record consistency. They do not certify design quality.

Before publishing, follow [the release checklist](docs/releasing.md). Contributions are licensed under the repository's current [MIT license](LICENSE). Do not include credentials, private profiles, real user data or third-party assets without appropriate rights.

## 中文

欢迎直接用中文反馈。最有用的内容是：脱敏后的原始需求、初始状态、实际结果、预期结果，以及 Skill/客户端版本。

改动优先修最小责任范围；保留失败记录，用原案例和一个反例复测。视觉问题要有实际画面，功能问题要有真实操作结果；不能用“测试全绿”代替审美验收。别把项目配色变成全局规则，也别为了让检查通过而放宽标准。

提交 PR 时说明问题、改动、实际验证和未验范围。维护命令从仓库根目录执行；使用者不需要运行这些命令。只改公开资料，不提交私人历史或真实用户数据。
