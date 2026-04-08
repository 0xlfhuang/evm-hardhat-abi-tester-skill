# evm-hardhat-abi-tester 使用指南

[English README](../README.md) | [中文概览](./README.zh-CN.md) | [中文使用指南](./usage.zh-CN.md)

这份文档专门回答一个问题：`evm-hardhat-abi-tester-skill` 安装完成后，到底应该怎么用。

官方仓库地址：[github.com/0xlfhuang/evm-hardhat-abi-tester-skill](https://github.com/0xlfhuang/evm-hardhat-abi-tester-skill)

如果你已经完成安装，但还不确定：

- 在不同工具里怎么触发它
- 需要提前准备什么材料
- 应该怎么向 AI 描述任务
- 运行后代理会帮你做哪些事

看这份文档就够了。

不过要注意，这份文档讲的是“怎么使用这个 skill”，不是“生成后的 Hardhat 项目怎么维护”。后者应该看生成脚手架后根目录里的 `README.md`。

## 一句话理解

这个 skill 的用途是：让 AI 代理基于你提供的 ABI、RPC 配置和接口说明，在一个目录里初始化或补全一个用于“已部署 EVM 合约交互测试”的 Hardhat JavaScript 项目。

它不是用来编译或部署 Solidity 源码的，重点是围绕“已有合约 + ABI”做 read/write 测试脚手架。

## 两层 README 不要混淆

你后续会看到两类 README：

- 这个仓库里的 README
  讲的是 skill 本身怎么安装、怎么触发、怎么给 AI 提需求
- 生成脚手架后的项目 README
  讲的是那个 Hardhat 测试工程怎么理解、怎么运行、怎么继续补测试

如果你已经把脚手架项目生成出来了，后续主要应该看生成项目根目录里的 `README.md`。

## 安装后怎么触发

不同工具的触发方式不完全一样，可以分成两类。

### 1. Codex 用户级安装

如果你执行的是：

```bash
./install.sh --tool codex-user
```

安装结果会放到：

```text
~/.codex/skills/evm-hardhat-abi-tester
```

这种情况下，你可以在对话里直接点名调用这个 skill，例如：

```text
Use $evm-hardhat-abi-tester to scaffold a Hardhat JavaScript test project for my deployed contract.
```

### 2. Claude / Cursor / Copilot / Gemini / 通用项目安装

如果你安装的是这些模式：

- `claude-user`
- `claude-project`
- `cursor-project`
- `copilot-project`
- `gemini-project`
- `project-all`

那么它们的工作方式通常不是“显式写 skill 名称”，而是通过安装后的提示词文件、规则文件或项目说明文件，在你提出相关任务时自动加载本地 bundle。

也就是说，你通常只需要说清楚任务本身，比如：

- 帮我基于 ABI 初始化一个 Hardhat 合约测试项目
- 帮我为一个已部署的 EVM 合约生成只读测试
- 帮我把 RPC、ABI 和接口文档整理成可运行的 Hardhat 测试工程

代理拿到任务后，会先读安装到项目里的说明文件，再定位到这个 bundle。

## 各工具怎么理解

| 工具 | 安装后的入口 | 用户怎么说 | 代理第一步通常做什么 |
| --- | --- | --- | --- |
| Codex | `~/.codex/skills/evm-hardhat-abi-tester` | 直接点名 `$evm-hardhat-abi-tester` | 读取 `SKILL.md`，检查 Node.js / npm |
| Claude Code | `~/.claude/agents/evm-hardhat-abi-tester.md` 或项目里的 `CLAUDE.md` | 描述“基于 ABI 搭建 Hardhat 测试项目” | 读取 bundle 说明 |
| Cursor | `.cursor/rules/evm-hardhat-abi-tester.mdc` | 描述“生成 ABI 驱动的 Hardhat 测试” | 套用规则并读取 bundle |
| GitHub Copilot Coding Agent | `AGENTS.md` 和 `.github/copilot-instructions.md` | 描述“为已部署合约搭建或运行 Hardhat 测试” | 按安装好的 agent 指令执行 |
| Gemini CLI | `GEMINI.md` | 描述“帮我完成 Hardhat ABI 测试工程初始化” | 读取本地 bundle 并收集输入 |

## 你需要准备什么

最少需要准备这些输入：

- `RPC_URL`
- `CHAIN_ID`
- `PRIVATE_KEY`
- `ABI`

建议同时提供这些信息：

- `CONTRACT_NAME`
- `CONTRACT_ADDRESS`
- 接口文档、函数说明、调用备注

如果你提供的信息越完整，代理生成出来的读测试和后续写测试就会越准确。

## 推荐的提问模板

下面这段可以直接作为中文提示词使用：

```text
请使用 evm-hardhat-abi-tester 帮我在当前目录初始化一个 Hardhat JavaScript 合约测试项目。

默认网络别名使用 gsc_v2_test。

我的 RPC_URL 是 ...
我的 CHAIN_ID 是 ...
我的 PRIVATE_KEY 是 ...

这是 ABI：
...

可选合约地址：
0x...

这是接口文档或方法说明：
...
```

如果你在 Codex 里显式调用 skill，可以写成：

```text
Use $evm-hardhat-abi-tester to scaffold a Hardhat JavaScript test project in the current directory.

RPC_URL=...
CHAIN_ID=...
PRIVATE_KEY=...
ABI=...
CONTRACT_ADDRESS=0x...
Interface notes: ...
```

## 触发后代理会帮你做什么

正常情况下，这个 skill 会按下面的顺序推进：

1. 检查 `node -v` 和 `npm -v`
2. 如果本机缺少 Node.js 或 npm，优先尝试给出安装方案
3. 复制 Hardhat JavaScript 模板
4. 生成本地 `.env` 和占位符版本的 `.env.example`
5. 保存 ABI 到项目目录
6. 保存合约接口文档或说明
7. 更新目标配置
8. 优先生成并运行只读测试
9. 对写测试保持保守策略，默认跳过，直到合约地址、方法和参数确认安全

## 生成后的项目大概会包含什么

生成结果通常会围绕这些内容展开：

- 一个 Hardhat JavaScript 模板工程
- 本地 `.env`
- `.env.example`
- `abi/<ContractName>.json`
- `docs/<ContractName>.md`
- 只读测试文件
- 谨慎默认下保持跳过状态的写测试文件

具体结构以 `skill/evm-hardhat-abi-tester/assets/hardhat-js-template` 为准。

## 本地配置和私钥怎么处理

运行时配置应放在生成项目的本地 `.env` 中，例如：

- `RPC_URL`
- `CHAIN_ID`
- `PRIVATE_KEY`
- `CONTRACT_ADDRESS`

请注意：

- `.env.example` 只应该保留示例占位符
- 不要把 `.env` 或真实私钥提交到 Git
- 最好使用专门的测试账号私钥，不要使用生产钱包

## 生成后你可以怎么验证

如果代理已经把项目搭起来了，通常下一步可以这样验证：

```bash
npm install
npx hardhat run scripts/smoke/read-contract.js --network gsc_v2_test
npx hardhat test test/Contract.read.test.js --network gsc_v2_test
```

如果文件名已经根据合约名改写，命令中的测试文件名也要对应替换。

写测试不要急着直接跑，先确认：

- 合约地址是对的
- 方法名和参数顺序是对的
- 你知道这会发起真实交易

## 什么时候适合用它

这个 skill 特别适合下面几类场景：

- 你只有 ABI 和链上地址，没有源码仓库
- 你想快速搭一个 Hardhat 测试工程验证只读接口
- 你想把 RPC、ABI、文档整理成一个可持续维护的交互测试项目
- 你希望 AI 先帮你做好安全的 read-first 脚手架

如果你的目标是本地编译、部署、升级 Solidity 合约，那就不属于这个 skill 的主场景了。
