# UI Foundry · 界面工坊

**你说产品目标，AI 负责设计判断。**

[English](README.md) · 简体中文

[开始安装](#安装) · [ClawHub](https://clawhub.ai/theosunny/skills/ui-foundry) · [下载 ZIP](https://github.com/theosunny/ui-foundry/releases) · [验证记录](docs/validation.md)

面向网页、产品工作台和原生 App 的设计主理人 Skill。把“满屏文字”“输入太多”“App 像网页”变成具体的设计决策，再通过真实界面和实际任务核对结果。

## 安装

运行一条命令，然后选择你使用的 Agent：

```sh
npx skills add theosunny/ui-foundry -g
```

这个安装器需要 **Node.js 22.20+**。`-g` 表示跨项目使用；去掉它，只安装到当前项目。Skill 的设计流程本身不要求配置 Node.js、API key 或 Python。

通过 [Skills CLI](https://github.com/vercel-labs/skills) 可选择 **Codex、Claude Code、Cursor、OpenCode、OpenClaw** 等目标。指定客户端、ClawHub 和免终端安装方法见[完整安装说明](docs/installation.zh-CN.md)。

## 然后，正常说需求

> 用 UI Foundry 改好这个产品。替我做视觉和交互决策，保留已有能力，完成后自己验证；让我只做影响产品的重要决策。

也可以只做其中一件事：

| 你需要 | 直接说 |
| --- | --- |
| 做一个新 App | “用 UI Foundry 设计并实现这个 iPhone App，方向你来定。” |
| 减少使用负担 | “这个页面让我读太多、填太多，把任务做得更顺手。” |
| 给其他 Agent 的提示词 | “把这个想法变成完整设计任务书，先不改代码。” |
| 改进设计方法 | “找出这次设计失败的原因，修正 Skill 并复测。” |

Codex 中可明确使用 **`$ui-foundry`**。其他客户端使用各自的 Skill 选择器或调用方式；安装后按客户端要求重新加载。

## 它会改变什么

| 常见问题 | UI Foundry 要求 Agent 做什么 |
| --- | --- |
| 让你逐项指定控件 | 主动确定人群、任务和一致的设计方向 |
| 用大段说明补救交互 | 复用上下文、合理默认和直接操作 |
| 从一种模板换到另一种模板 | 一起设计构图、排版、密度、状态和动效 |
| 把桌面网页压进手机 | 按平台处理导航、触摸、键盘和安全区 |
| 能构建就说设计完成 | 分别审核视觉品质与任务可用性 |
| 出一次问题就堆一条口号 | 找根因，用相关反例检验修正 |

保留有用的自由写作、高效专业表单和行动前的必要信息。不强制使用某套框架、配色或组件库。

## 安装的是 Skill，不是又一个要配置的 App

安装、说目标、让 Agent 开始工作。参考材料、审核模板与可选脚本都随 Skill 分发：

```text
ui-foundry/                 # 已安装的 Skill 根目录
├── SKILL.md
├── agents/openai.yaml
├── references/
├── assets/review-record.json
└── scripts/check_design_gate.py
```

**普通使用不需要手动运行 Python。** 可选脚本只检查审核记录格式，不认证审美或证据真假。需要时由 Agent 从已安装的 Skill 目录定位，不会去你的项目里猜测 `scripts/` 目录。[进阶审核说明 →](docs/review-records.md#中文)

## 能力与边界

README 提供中英文版本。Skill 内部指令目前使用中文；你可以要求 Agent 用偏好的语言输出。

安装成功不代表每个客户端的行为都一样；浏览器检查也不能代替原生 App 验收。[实际验证范围](docs/validation.md)单独记录。

UI Foundry 提供设计判断与审核流程，不能保证每次产出都完美。公开包不含私人偏好、聊天记录、凭据或真实用户资料，也不会自动上传项目数据或发布自身更新。

## 反馈

发现问题可以[提交 Issue](https://github.com/theosunny/ui-foundry/issues)，提供虚构或脱敏案例：原始要求、预期行为、实际结果和使用的客户端。截图和日志中请移除私人信息。

[MIT-0 许可](LICENSE) · [版本记录](CHANGELOG.md) · [参考致谢](ACKNOWLEDGMENTS.md)
