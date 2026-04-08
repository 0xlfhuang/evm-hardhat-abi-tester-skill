# 生成项目 README 参考模板（中文）

这个文件是生成脚手架项目根目录 `README.md` 时的结构参考。

不要把这个文件原样复制到用户项目里。应根据实际生成结果，把占位内容替换成真实的合约名、网络名、文件名、命令和说明。

## 推荐 README 结构

```md
# <ContractName> Hardhat ABI 测试脚手架

这个项目是一个基于 Hardhat JavaScript 的脚手架，用于通过 ABI 与“已经部署好的 EVM 合约”进行交互测试。

## 这个项目包含什么

- `README.md`：面向新手的项目说明
- `.env`：本地运行时配置
- `.env.example`：环境变量占位模板
- `abi/<ContractName>.json`：测试和脚本使用的 ABI
- `config/targets.json`：集中管理合约目标与测试元信息
- `docs/<ContractName>.md`：合约接口说明与测试备注
- `scripts/smoke/read-contract.js`：第一个安全的 smoke read 脚本
- `test/<ContractName>.read.test.js`：只读测试
- `test/<ContractName>.write.test.js`：保守默认的写测试模板

## 运行前先做什么

- 先填写 `.env`：`RPC_URL`、`CHAIN_ID`、`PRIVATE_KEY`、`CONTRACT_NAME`、`CONTRACT_ADDRESS`
- 不要提交 `.env` 或真实私钥
- 尽量使用专门的测试钱包，不要使用生产钱包
- 如果 `CONTRACT_ADDRESS` 还没填，smoke/read/write 行为会保持受限或跳过

## 快速开始

```bash
npm install
npm run smoke
npm run read
```

如果你想直接看底层 Hardhat 命令，也可以用：

```bash
npx hardhat run scripts/smoke/read-contract.js --network <NetworkName>
npx hardhat test test/<ContractName>.read.test.js --network <NetworkName>
```

脚手架里还提供了更适合新手记忆的 npm script 别名：

```bash
npm run smoke
npm run read
npm run write
```

其中 `npm run write` 仍然对应保守默认的写测试模板。只有在目标方法、参数和副作用都确认后，才建议执行类似下面的命令：

```bash
npx hardhat run scripts/smoke/read-contract.js --network <NetworkName>
npx hardhat test test/<ContractName>.read.test.js --network <NetworkName>
npx hardhat test test/<ContractName>.write.test.js --network <NetworkName> --grep "<case>"
```

## 关键文件说明

### `.env`

说明用户最先应该改哪些字段。

### `config/targets.json`

说明这些字段的作用：
- `defaultNetwork`
- `contractName`
- `contractAddress`
- `abiPath`
- `docsPath`
- `readMethods`
- `writeMethods`
- `smokeRead`
- `notes`

### `docs/<ContractName>.md`

说明这里应该记录：
- 适合先调用的只读方法
- 暂时不要开启的写方法
- 参数示例
- 测试假设和注意事项

## 怎么新增一个读测试

1. 先更新 `config/targets.json` 中的 `readMethods` 或 `smokeRead`
2. 再在 `test/<ContractName>.read.test.js` 里新增 case
3. 如有必要，补充 `docs/<ContractName>.md` 中的参数说明和预期结果

## 怎么新增一个写测试

1. 先确认地址、方法名、参数顺序和副作用
2. 在 `config/targets.json` 和 `docs/<ContractName>.md` 中记录目标方法
3. 在 `test/<ContractName>.write.test.js` 中新增或放开对应 case
4. 优先考虑先写 `staticCall` 或保留禁用占位，不要直接鼓励真实链上写入

## 怎么修改 ABI、地址或网络

- ABI 变化时，替换 `abi/<ContractName>.json`
- 地址变化时，更新 `.env` 和 `config/targets.json`
- 网络别名变化时，统一更新 `.env`、`hardhat.config.js`、命令示例和 `config/targets.json`

## 安全提示

- 先跑读测试，再考虑写测试
- 写测试默认保持跳过，直到确认安全
- 这个项目用于“基于 ABI 与已部署合约交互”，不是源码编译和部署项目
```
