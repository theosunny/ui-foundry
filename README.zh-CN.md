<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/wordmark-dark.svg" />
    <img src="docs/assets/wordmark-light.svg" width="300" height="70" alt="UI Foundry · 界面工坊" />
  </picture>
</p>

<h3 align="center">让你的编程 Agent，兼任设计负责人。</h3>

<p align="center">为没有专职设计师的独立开发者与小团队而做。</p>

<p align="center">
  <a href="#start"><strong>开始使用</strong></a> &nbsp;&nbsp;
  <a href="docs/installation.zh-CN.md">选择你的 Agent</a> &nbsp;&nbsp;
  <a href="benchmarks/README.md">公开对照测试</a> &nbsp;&nbsp;
  <a href="README.md">English</a>
</p>

<p align="center">
  <picture>
    <source media="(max-width: 600px)" srcset="docs/assets/interface-study-mobile.zh-CN.svg" />
    <img src="docs/assets/interface-study.zh-CN.svg" width="1200" alt="界面设计示例：聚焦内容的发布工作台，以及直接选择日期的移动端排期面板。" />
  </picture>
  <br/>
  <sub>原创界面示例 · 虚构内容 · 用于展示设计思路，非已上线 App。</sub>
</p>

**你不必先学会设计，才能做出一个好产品。**

UI Foundry 给编程 Agent 一套能落地的设计体系：**具体视觉底稿、可运行界面范例、交互模式、组件适配和审核返修**。从想法或现有页面出发，由 Agent 选择并实现完整设计；你决定产品目标和重要约束。

<p align="center">
  <strong>网页 · 产品工作台 · 原生 App</strong><br/>
  <sub>公开测试版 · MIT · Skill 无需额外服务或 API key</sub>
</p>

<a id="start"></a>

## 安装一次，从你的想法开始

```sh
npx skills add theosunny/ui-foundry -g
```

在安装器里选择 **Codex、Claude Code、Cursor、OpenCode 或 OpenClaw**，然后直接说：

> 用 UI Foundry 把这个产品做好看、做顺手。设计细节你来定，让主要任务更省力，做完检查实际效果，保留已有的好用功能。

一个想法、一张现有页面、一个仓库，或一份草图，都能作为起点。

<details>
<summary>安装要求、其他方式与调用方法</summary>

[Skills CLI](https://github.com/vercel-labs/skills) 需要 **Node.js 22.20+**。`-g` 表示跨项目使用；去掉它，只安装到当前项目。Skill 本身无需配置 Node.js 或 Python。

Codex 中可用 **`$ui-foundry`** 明确调用。其他客户端使用各自的 Skill 选择器或调用格式；按客户端要求重新加载。

[指定客户端与手动安装](docs/installation.zh-CN.md) · [ClawHub](https://clawhub.ai/theosunny/skills/ui-foundry) · [下载 ZIP](https://github.com/theosunny/ui-foundry/releases)

</details>

## 把功夫花在这些细节上

| 视觉有整体感 | 用起来更省力 | 做完，真的检查 |
| --- | --- | --- |
| 构图、字体、层次和状态一起设计。App 按移动端的习惯来做。 | 已有信息直接用，操作放在内容旁，需要时才让用户补充。 | 看实际页面，走真实任务。发现问题就修，再核对结果。 |

内置可直接采用的排版、间距、浅深色 token 和可运行范例。Agent 按任务选用并调整，沿用项目已认可的视觉方向，接上兼容的组件。你不必自己选库、配色或拼提示词。[查看完整体系](docs/design-system.md)。

## 你在哪一步，就从哪一步开始

| 手上有什么 | 直接这样说 |
| --- | --- |
| **一个想法** | “设计并实现这个 iPhone App，方向你来定。” |
| **一个难用的页面** | “这里让我读太多、填太多，把任务做得更顺手。” |
| **要交给其他 Agent 的需求** | “把想法整理成完整设计任务书，先不改代码。” |
| **一个不满意的结果** | “找出这次设计失败的原因，修正后再检查。” |

流程很简单：**理解任务 → 设计 → 实现 → 检查 → 改进**。检查时分清已验证、明确有问题和缺少证据；能构建成功，只是其中一步。

## 效果，拿证据来说

同一任务，对比加载和不加载 Skill 的结果：两组产物都公开，检查实际保存的数据，再匿名评审界面。失败保留，修复另开一轮并复测反例。首轮样本很小，不足以证明稳定领先。

[对照方法与结果](benchmarks/README.md) · [开源验收](docs/open-source-readiness.md) · [宣传与证据](docs/claims.md)

## Skill 里有什么

视觉配方、CSS 底稿、可运行范例、组件适配与审核工具随包提供。可选脚本位于已安装 Skill 的 `ui-foundry/scripts/check_design_gate.py`，由 Agent 定位，**你不需要手动运行 Python**。它检查记录格式，不认证审美或证据真假。

[查看 Skill](skills/ui-foundry/SKILL.md) · [审核方法](skills/ui-foundry/references/review.md) · [进阶脚本说明](docs/review-records.md#中文)

<details>
<summary>语言、验证范围与隐私</summary>

README 提供中英文版本。Skill 内部指令目前使用中文，你可以要求 Agent 用偏好的语言输出。

安装成功不代表每个客户端行为相同，浏览器检查也不能代替原生 App 验收。[行为验证](docs/validation.md)与[安装验证](docs/installation-validation.md)分别记录实际范围。上方界面是原创示意，不是实测的前后对比成果。

UI Foundry 提供设计基础及实现、审核流程，不能保证每次产出都完美。公开包不含私人偏好、聊天记录、凭据或真实用户资料，也不会自动上传项目数据或发布自身更新。

</details>

## 一起把它做好

发现问题可以[提交 Issue](https://github.com/theosunny/ui-foundry/issues)，附上虚构或脱敏案例：你的要求、预期结果、实际结果和客户端。有用的反馈，会帮助改进这套方法。

[参与贡献](CONTRIBUTING.md) · [安全报告](SECURITY.md) · [MIT 许可](LICENSE) · [版本记录](CHANGELOG.md) · [参考致谢](ACKNOWLEDGMENTS.md)
