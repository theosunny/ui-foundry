# Optional review-record checker

[中文](#中文) · [README](../README.md)

This is an optional helper for agents and maintainers, not an installation step. It checks the structure of a review record and summarizes the author's statuses. It does not inspect a screen or certify design quality.

The script ships at `scripts/check_design_gate.py` **inside the skill folder**. Resolve that folder from the `SKILL.md` actually loaded by your agent, regardless of which installer or client you used. Do not look for this script in the product being reviewed.

For a manual check in a POSIX shell, replace the example directories with your actual absolute paths:

```sh
UI_FOUNDRY_DIR="/absolute/path/to/installed/ui-foundry"
python3 "$UI_FOUNDRY_DIR/scripts/check_design_gate.py" "/absolute/path/to/review.json"
```

Python 3 is needed only for this helper. No packages or credentials are required. The script only reads the specified JSON file and prints its result; it does not modify the project or contact a service.

For maintainers working from **this repository root**, a concrete smoke check is:

```sh
python3 skills/ui-foundry/scripts/check_design_gate.py skills/ui-foundry/assets/review-record.json
```

The untouched template should return exit code **3**, `UNVERIFIED`. Exit codes: 0 = authored statuses summarize to PASS; 1 = invalid record; 2 = REWORK; 3 = UNVERIFIED. `quality_verified_by_script` is always `false`.

Run this repository's automated tests separately with `python3 -m unittest discover -s tests -v`. These are maintainer checks, not setup commands for people using the skill.

## 中文

这个工具用于 Agent 或维护者做可选的审核记录检查，**不是安装步骤，普通用户不用执行**。它只校验记录结构、汇总作者填入的状态，不能看界面、核实证据或认证设计质量。

脚本在 Skill 文件夹内部的 `scripts/check_design_gate.py`。由 Agent 根据当前加载的 `SKILL.md` 确定真实安装目录，不去被审查产品的目录里猜测路径。

确实需要手动检查时，在 POSIX shell 中将上面的 `UI_FOUNDRY_DIR` 改成实际安装绝对路径，再传入审核 JSON 的绝对路径；从任意当前工作目录都可调用。仓库维护者在本仓库根目录使用第二条示例命令即可。

只有这个可选工具需要 Python 3，不需要额外包或凭据。未填模板返回 `UNVERIFIED` 和退出码 3 是正确结果，不代表检查失败或产品已合格。格式检查不能替代真实的视觉和交互验收。
