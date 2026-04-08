# evm-hardhat-abi-tester-skill

[English](../README.md) | [中文概览](./README.zh-CN.md) | [中文使用指南](./usage.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)
[![Issues](https://img.shields.io/github/issues/0xlfhuang/evm-hardhat-abi-tester-skill)](https://github.com/0xlfhuang/evm-hardhat-abi-tester-skill/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](../CONTRIBUTING.md)

`evm-hardhat-abi-tester-skill` 是一个面向 AI 编码工具的可安装 Skill/Agent Bundle，用来帮助代理从 ABI、RPC 配置、私钥、接口说明和可选合约地址出发，生成一个适合新手上手的 Hardhat JavaScript 合约交互测试项目。

仓库地址：[github.com/0xlfhuang/evm-hardhat-abi-tester-skill](https://github.com/0xlfhuang/evm-hardhat-abi-tester-skill)

快速入口：

- [从 GitHub 安装](#install-from-github-zh)
- [怎么使用这个 Skill](#how-to-use-this-skill-zh)
- [Skill 仓库和生成项目的区别](#skill-repo-vs-generated-project-zh)
- [中文使用指南](./usage.zh-CN.md)
- [提交 Issue](https://github.com/0xlfhuang/evm-hardhat-abi-tester-skill/issues)

这个仓库本身不是业务 dApp，也不是 Solidity 合约源码仓库。它更像一个“可分发的能力包”，重点在于：

- 把 `evm-hardhat-abi-tester` 作为独立 GitHub 仓库分发
- 通过安装脚本分发到不同 AI 工具
- 复用统一的 Hardhat 模板和提示词规范
- 引导代理优先完成只读测试，再谨慎开启写入测试

## 项目特点

- 面向“已部署合约 + ABI”的交互测试场景
- 从最常见的输入材料开始：`RPC_URL`、`CHAIN_ID`、`PRIVATE_KEY`、`ABI`
- 默认网络别名为 `gsc_v2_test`
- 内置 read-first、安全优先的测试流程
- 支持多种 AI 编码工具的用户级或项目级安装
- 提供本地安装与 GitHub 分发两种方式

## 支持的工具

| 工具 | 安装方式 | 结果 |
| --- | --- | --- |
| Codex | 用户级 | `~/.codex/skills/evm-hardhat-abi-tester` |
| Claude Code | 用户级 | `~/.agent-skills/evm-hardhat-abi-tester` 和 `~/.claude/agents/evm-hardhat-abi-tester.md` |
| Claude Code | 项目级 | `.agent-skills/evm-hardhat-abi-tester` 和 `CLAUDE.md` |
| Cursor | 项目级 | `.agent-skills/evm-hardhat-abi-tester` 和 `.cursor/rules/evm-hardhat-abi-tester.mdc` |
| GitHub Copilot Coding Agent | 项目级 | `.agent-skills/evm-hardhat-abi-tester`、`AGENTS.md`、`.github/copilot-instructions.md` |
| Gemini CLI | 项目级 | `.agent-skills/evm-hardhat-abi-tester` 和 `GEMINI.md` |
| 通用项目模式 | 项目级 | 一次性写入多套工具所需的项目文件 |

## 环境要求

- Bash
- `cp`、`sed`、`tar`、`mktemp` 等常见 Unix 工具
- 至少一种目标 AI 编码工具
- 如果要从 GitHub 直接安装，需要 `curl`

## 快速开始

### 从本地仓库安装

```bash
git clone https://github.com/0xlfhuang/evm-hardhat-abi-tester-skill.git
cd evm-hardhat-abi-tester-skill
./install.sh --tool codex-user
./install.sh --tool claude-user
./install.sh --tool project-all --target-dir /path/to/project
```

<a id="install-from-github-zh"></a>

### 从 GitHub 安装

已发布仓库地址：`0xlfhuang/evm-hardhat-abi-tester-skill`

```bash
curl -fsSL https://raw.githubusercontent.com/0xlfhuang/evm-hardhat-abi-tester-skill/main/install.sh | bash -s -- --repo 0xlfhuang/evm-hardhat-abi-tester-skill --tool codex-user

curl -fsSL https://raw.githubusercontent.com/0xlfhuang/evm-hardhat-abi-tester-skill/main/install.sh | bash -s -- --repo 0xlfhuang/evm-hardhat-abi-tester-skill --tool claude-user

curl -fsSL https://raw.githubusercontent.com/0xlfhuang/evm-hardhat-abi-tester-skill/main/install.sh | bash -s -- --repo 0xlfhuang/evm-hardhat-abi-tester-skill --tool project-all --target-dir /path/to/project
```

<a id="how-to-use-this-skill-zh"></a>

## 怎么使用这个 Skill

安装完成后，如果你想知道“接下来怎么触发这个 skill、需要提供什么材料、代理会帮我做什么”，建议直接看 [中文使用指南](./usage.zh-CN.md)。

简要来说：

- Codex 用户级安装后，可以直接在对话里点名 `$evm-hardhat-abi-tester`
- Claude、Cursor、Copilot、Gemini 这类项目级安装，通常不需要显式写 skill 名；用户只要提出“基于 ABI 初始化 Hardhat 测试项目”这类任务，工具会通过已安装的提示词或规则文件自动读到这个 bundle

如果你只想看完整安装后怎么用、怎么提问、执行后会发生什么，优先阅读这份文档：

- [中文使用指南](./usage.zh-CN.md)

<a id="skill-repo-vs-generated-project-zh"></a>

## Skill 仓库和生成项目的区别

这个仓库里实际上有两层不同的说明文档，它们解决的问题也不一样：

- 当前这个仓库里的 `README.md` / `README.zh-CN.md`
  用来说明这个 skill 本身是什么、怎么安装、怎么触发
- 由 skill 生成出来的脚手架项目里的根目录 `README.md`
  用来说明那个 Hardhat 测试项目怎么理解、先改什么、先跑什么、怎么新增测试

可以简单理解成：

- 想搞清楚“这个 skill 怎么装、怎么调用”，看当前仓库文档
- 想搞清楚“生成出来的 Hardhat 项目怎么用”，看生成项目里的 `README.md`

## 安装模式

### Codex

```bash
./install.sh --tool codex-user
```

示例提示词：

```text
Use $evm-hardhat-abi-tester to set up a Hardhat JavaScript test project for my deployed contract.
```

### Claude Code

用户级安装：

```bash
./install.sh --tool claude-user
```

项目级安装：

```bash
./install.sh --tool claude-project --target-dir /path/to/project
```

### Cursor

```bash
./install.sh --tool cursor-project --target-dir /path/to/project
```

### GitHub Copilot Coding Agent

```bash
./install.sh --tool copilot-project --target-dir /path/to/project
```

### Gemini CLI

```bash
./install.sh --tool gemini-project --target-dir /path/to/project
```

### 通用项目安装

```bash
./install.sh --tool project-all --target-dir /path/to/project
```

如果你希望同一个项目同时兼容多种 Agent 工具，推荐直接使用这个模式。

## 本地配置与敏感信息

像 `RPC_URL`、`CHAIN_ID`、`PRIVATE_KEY` 这类运行时配置，以及和具体链环境相关的连接信息，应该放在生成出来的 Hardhat 项目的本地 `.env` 文件里，而不是写进受 Git 跟踪的仓库文件。

- 真实的密钥和环境配置放在本地 `.env`
- 仓库中跟踪的 `.env.example` 只保留占位符示例
- 不要把 `.env`、私钥或带资金的测试账户凭据提交到 Git
- 建议使用专门的测试账号私钥，不要使用生产钱包私钥

这个仓库提供的是模板、提示词和安装逻辑，不应该把真实 RPC 凭据或私钥硬编码到版本库中。

## Skill 会帮助代理完成什么

安装完成后，这个 Skill 主要用于引导代理完成以下工作：

- 检查 Node.js 和 npm 是否可用
- 复制 Hardhat JavaScript 模板工程
- 生成用于本地运行的 `.env`，以及仅包含占位示例的 `.env.example`
- 写入 ABI 与合约接口说明文档
- 更新目标配置文件
- 先生成安全的只读测试，再逐步补充写入测试

仓库中的标准模板位于 `skill/evm-hardhat-abi-tester/assets/hardhat-js-template`。

## 仓库结构

```text
skill/evm-hardhat-abi-tester/   Skill 本体、参考文档和 Hardhat 模板资源
templates/                      面向不同 AI 工具的模板文件
scripts/install-from-dir.sh     主安装逻辑
scripts/test-installer.sh       安装器冒烟测试
install.sh                      本地安装和 GitHub 安装入口
docs/                           补充文档
```

## 本地开发与验证

执行下面的命令可以验证安装流程：

```bash
./scripts/test-installer.sh
```

当前会校验：

- Codex 用户级安装
- Claude 用户级安装
- 通用项目级安装

## 贡献建议

欢迎提交 Issue 和 Pull Request。比较适合贡献的方向包括：

- 改进提示词、风险控制规则和新手引导
- 扩展不同 Agent 工具的安装兼容性
- 完善 Hardhat 模板与测试样例
- 修正文档、命令示例和边界场景

如果你修改了安装器逻辑或模板输出，建议先运行 `./scripts/test-installer.sh` 再提交变更。

反馈与贡献入口：

- 问题反馈与功能建议：[GitHub Issues](https://github.com/0xlfhuang/evm-hardhat-abi-tester-skill/issues)
- 提交代码修改：[GitHub Pull Requests](https://github.com/0xlfhuang/evm-hardhat-abi-tester-skill/pulls)
- 贡献说明：[CONTRIBUTING.md](../CONTRIBUTING.md)

## 常见问题

### `curl ... | bash` 是使用命令吗？

不是。这条命令是“安装这个 skill bundle”的命令，不是“调用 skill 干活”的命令。安装完成后，你还需要在对应的 AI 工具里提出任务，让代理按这个 skill 的规则去搭建或测试项目。

### 为什么 Codex 可以直接写 `$evm-hardhat-abi-tester`，其他工具却不是这样？

因为 Codex 的用户级安装支持按名字直接调用 skill。Claude、Cursor、Copilot、Gemini 这类工具，更多是通过安装后的 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`、`.cursor/rules/...` 这类文件间接加载这个 bundle。

### 为什么生成出来的脚手架项目里还有一个 `README.md`？

因为两份 README 负责的事情不同。这个仓库的 README 讲的是 skill 本身；生成项目里的 README 讲的是那个 Hardhat 测试项目本身，用户后续真正会修改和运行的是后者。

### `RPC_URL`、`CHAIN_ID`、`PRIVATE_KEY` 应该放哪里？

应该放在生成项目的本地 `.env` 文件里。`.env.example` 只保留占位符，不要把真实私钥、RPC 凭据或带资金的钱包信息提交到 Git。

### 这个仓库会帮我编译或部署 Solidity 合约吗？

不会。这个 skill 的重点是“基于 ABI 与已部署合约”生成 Hardhat JavaScript 交互测试工程，而不是本地编译、部署或升级 Solidity 合约。

## 许可证

本项目使用 [MIT License](../LICENSE)。
