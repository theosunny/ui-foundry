# UI Foundry · 界面工坊

**让 AI 承担设计工作，让你只做重要决策。**

一个面向网页、产品工作台与原生 App 的设计主理人 Skill：把“古板、满屏文字、输入太多、不像手机 App”变成具体的视觉与交互决策，再用真实产物验证。

它不承诺一键生成完美 UI，也不预设所有产品都应使用同一种主题。目标是持续做出更精致、更省力、更适合产品的设计。

[ClawHub 安装页](https://clawhub.ai/theosunny/skills/ui-foundry) · [下载 0.1.0 安装包](https://github.com/theosunny/ui-foundry/releases/tag/v0.1.0)

## 怎么用

安装后直接说：

> 用 UI Foundry 改好这个产品。先判断服务谁、主任务是什么；替我做视觉和交互决策，完成后自己操作验证，不让我逐项指定控件。

也可以只要提示词或改进流程：

> 用 UI Foundry 把这个想法变成能直接交给开发 Agent 的完整设计任务书，先不改代码。

> 用 UI Foundry 分析这次设计为什么失败，修正 Skill 并做一个有边界的验证，不要继续改当前网站。

## 安装

### Codex

将本仓库的 `skills/ui-foundry` 目录复制到 `~/.codex/skills/ui-foundry`，重新加载会话后使用 `$ui-foundry`。已有同名目录时先保留本地定制，再手动合并，避免覆盖私人偏好。

### ClawHub / OpenClaw

```sh
clawhub install @theosunny/ui-foundry
```

已验证 ClawHub CLI 0.23.3 可匿名安装 0.1.0，8 个发布文件与源码逐字节一致。使用带作者名称的包名时，文件位于工作目录下的 `skills/@theosunny/ui-foundry`；实际位置还受 CLI 配置影响。

### 其他支持 Agent Skills 的工具

将同一目录放到该客户端支持的 Skill 位置。`SKILL.md` 是入口，`agents/openai.yaml` 是 Codex 的展示元数据，不是其他客户端的必要依赖。未逐一验证所有客户端；安装一个客户端不会自动同步其他账号。

## 它会做什么

- **先锁定交付**：做产品、写提示词、改 Skill、给建议，分别处理。
- **先锁定用户与结果**：减少多余决策、重新整理资料和无效输入。
- **整体设计**：构图、排版、密度、材质、状态、导航与动效一起考虑。
- **双重审核**：视觉品质和任务可用性分别检查，发现具体问题就返工。
- **有边界地学习**：修根因，用反例复测；不把一次配色争议变成永久禁令。

现有技术栈能够胜任就复用。组件库、检测器和设计参考是工具，不是审美替代品。原生 App 要在设备或模拟器检验，不能拿浏览器截图冒充。

## 检验与限制

核心流程无需 API key、外部服务或固定框架。可选 Python 3 脚本只读取指定的本地审核 JSON，校验格式并汇总人工判断，不联网、不修改项目。

```sh
python3 -m unittest discover -s tests -v
python3 skills/ui-foundry/scripts/check_design_gate.py skills/ui-foundry/assets/review-record.json
```

第二条对未填模板应返回退出码 **3**（UNVERIFIED）。脚本的 `quality_verified_by_script` 始终是 `false`，不能把其退出码当审美认证。

匿名检验场景位于 [evals](evals/cases.json)；[验证记录](docs/validation.md) 区分脚本测试、行为检查与实际视觉验证。模型、工具、素材和任务都会影响结果，不能由少数样例推断所有设计都达标。

## 隐私与许可

公开包包含通用流程、审核模板及格式校验器。没有作者的个人偏好档案、聊天记录、账号信息、私人产品数据或本机路径。安装后不会自动修改其他工具配置或上传项目资料。

项目采用 [MIT-0](LICENSE)，与 ClawHub 的 Skill 发布许可一致。参考来源见 [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md)，不包含其实现代码。

---

**English:** UI Foundry is a design-lead Agent Skill for coherent visual design, lower-effort interactions and evidence-based review across websites, workspaces and native apps. Instructions are written in Chinese; the agent should respond in the user's language. The included validator checks review records, not aesthetic quality. No bundled service, credentials or automatic publishing.
