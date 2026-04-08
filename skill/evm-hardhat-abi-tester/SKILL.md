---
name: evm-hardhat-abi-tester
description: Scaffold and customize a beginner-friendly Hardhat JavaScript project for testing existing EVM smart contracts from ABI, RPC, chain ID, private key, contract docs, and an optional contract address. Use when a user wants an AI-guided setup in an empty folder, needs Node.js and npm checked or installed first, wants .env-driven contract interaction tests, or needs to turn ABI and interface docs into read/write Hardhat scripts with the default network alias gsc_v2_test.
---

# EVM Hardhat ABI Tester

Use this skill to take a beginner from "I only have RPC, chainId, private key, ABI, and docs" to "my Hardhat test project is installed and the first contract interaction test is runnable."

## When To Use This Skill

Use this skill when the user:
- wants to create a contract testing project from scratch in an empty directory
- has an ABI and contract interface documentation, but not necessarily contract source code
- needs a standard Hardhat JavaScript testing scaffold with `.env`-driven network configuration
- wants every default command and example to use `--network gsc_v2_test`

Do not default to source compilation or deployment workflows. This skill is for interacting with an already deployed EVM contract by ABI.

## Default Rules

- Default network alias: `gsc_v2_test`
- Default execution commands must use `--network gsc_v2_test`
- Store the network connection values for `gsc_v2_test` in `.env`
- Always generate a project-level `README.md` for the scaffolded project
- Add beginner-friendly Chinese comments to generated scaffold scripts and test files by default
- Always check `node -v` and `npm -v` before scaffolding the project
- If Node.js or npm is missing, first try to install it automatically with the platform package manager when the environment and permissions allow it
- If automatic installation is blocked, give platform-specific install steps and stop before the Hardhat setup step
- If the user explicitly asks for another network alias, update the template consistently in config, commands, and docs
- If `CONTRACT_ADDRESS` is not available yet, generate the scaffold anyway and keep read/write tests in a safe placeholder state
- Write tests should be conservative by default and remain skipped until the target method and parameters are confirmed
- Before generating the scaffold, confirm whether the generated project documentation should be in Chinese or English
- If the user did not specify a language, ask before generating the scaffold; do not silently choose one
- Keep the generated `README.md` and `docs/<ContractName>.md` in the same language
- If the user does not ask for another comment language, keep code comments in Chinese so beginners can understand the scaffold faster

## Workflow

### 0. Verify the runtime environment

Run these checks first:

```bash
node -v
npm -v
```

If both work, continue immediately.

If either command is missing:
- run `scripts/check-nodejs-env.sh` when you want a quick environment diagnosis
- read [references/nodejs-setup.md](references/nodejs-setup.md)
- prefer automatic installation only when there is a clear package manager and the user allows the command
- after installation, rerun `node -v` and `npm -v`
- only then continue to Hardhat scaffolding

Preferred install order by platform:
- macOS: `brew install node`
- Ubuntu or Debian: `sudo apt-get update && sudo apt-get install -y nodejs npm`
- Fedora: `sudo dnf install -y nodejs npm`
- Windows: `winget install OpenJS.NodeJS.LTS`

If the machine already has Node but `npx hardhat` does not resolve correctly, prefer `npx --no-install hardhat ...` after dependencies are installed.

### 1. Inspect the workspace

- If the working directory is empty or clearly intended for a new project, copy the contents of `assets/hardhat-js-template/` into the target directory
- If the directory already contains a project, either adapt the existing Hardhat files or copy only the missing template pieces
- Avoid creating a `contracts/` folder unless the user also wants local source compilation

### 2. Collect the minimum inputs

You need:
- `RPC_URL`
- `CHAIN_ID`
- `PRIVATE_KEY`
- `ABI`

You should also collect:
- `CONTRACT_NAME`
- interface documentation or method notes
- optional `CONTRACT_ADDRESS`
- README language: Chinese or English

If a value is missing and the user has not provided it yet, ask only for the specific missing field. Keep the setup moving with placeholders when safe.

If the user asks to scaffold a new project and has not specified the README language, ask before writing project files.

Read [references/input-contract-materials.md](references/input-contract-materials.md) when you need the exact intake checklist or need to derive test cases from ABI plus docs.

### 3. Materialize the project

After copying the template:
- write `.env` from the provided values
- refresh `.env.example` so it mirrors the expected keys
- generate a project-level `README.md` in the confirmed language
- save the ABI to `abi/<ContractName>.json`
- summarize the interface notes to `docs/<ContractName>.md` in the same language as `README.md`
- keep `docs/<ContractName>.md` structured and beginner-friendly, covering contract purpose, safe read methods, risky write methods, smoke-read suggestions, and testing notes
- keep the scaffold code comments beginner-friendly and Chinese by default
- keep `package.json` scripts easy to discover for beginners, including simple aliases for smoke/read/write flows
- update `config/targets.json` with:
  - `defaultNetwork`
  - `contractName`
  - `contractAddress`
  - `abiPath`
  - `docsPath`
  - at least one candidate `readMethods` entry if docs are sufficient
  - one `smokeRead` entry when a specific view method can be identified
  - beginner-friendly `notes` that explain what to edit next

If the contract name is known, replace the placeholder `Contract` label inside the copied test and script files.

Use these references when generating the project README:

- [references/generated-project-readme.en.md](references/generated-project-readme.en.md)
- [references/generated-project-readme.zh-CN.md](references/generated-project-readme.zh-CN.md)

Do not drop those reference files into the user project unchanged. Instead, use them as the structure source and fill in the actual contract name, paths, test files, commands, and warnings for the generated scaffold.

### 4. Build the first tests

Always prioritize read-only tests first.

- Translate obvious `view` and `pure` functions into `test/<ContractName>.read.test.js`
- Keep a generic smoke test that verifies deployed bytecode exists at the configured address
- Configure `smokeRead` in `config/targets.json` when you can identify a safe first read method
- Keep `test/<ContractName>.write.test.js` skipped until the method, args, and side effects are confirmed

Read [references/test-patterns.md](references/test-patterns.md) when mapping docs to test structure, event parsing, static calls, or `--grep`-based execution.

### 5. Run and guide

Give the user the next concrete commands in this order:
- verify Node.js and npm are available
- install dependencies
- run the read smoke script
- run the read test file
- only later, run a specific write case with `--grep`

When handing off the generated project:
- explicitly point the user to `README.md` first
- explain which files they are expected to edit next
- explain why write tests stay skipped until the transaction details are confirmed

Default commands:

```bash
node -v
npm -v
npm install
npx hardhat run scripts/smoke/read-contract.js --network gsc_v2_test
npx hardhat test test/Contract.read.test.js --network gsc_v2_test
npx hardhat test test/Contract.write.test.js --network gsc_v2_test --grep "<case>"
```

If the contract name is known and you renamed the files, update the commands accordingly.

### 6. Protect beginners from risky writes

Before enabling any write case:
- confirm the target contract address
- confirm the method name and argument order
- confirm the user understands it will send a transaction
- prefer a preflight `staticCall` when applicable
- keep the test skipped if any of the above is unclear

Read [references/safety-rules.md](references/safety-rules.md) before generating or enabling write tests.

## References

- [references/onboarding.md](references/onboarding.md): beginner-first workflow and command order
- [references/nodejs-setup.md](references/nodejs-setup.md): how to detect, install, and verify Node.js and npm on each platform
- [references/input-contract-materials.md](references/input-contract-materials.md): required inputs and how to normalize them
- [references/test-patterns.md](references/test-patterns.md): reusable read/write/event test shapes
- [references/safety-rules.md](references/safety-rules.md): write safeguards and stop conditions
- [references/generated-project-readme.en.md](references/generated-project-readme.en.md): English scaffold README structure
- [references/generated-project-readme.zh-CN.md](references/generated-project-readme.zh-CN.md): Chinese scaffold README structure

## Assets

Use `assets/hardhat-js-template/` as the canonical scaffold. Copy it first, then customize it with the user's ABI, docs, addresses, and selected contract name.

## Scripts

- `scripts/check-nodejs-env.sh`: quick diagnosis for Node.js, npm, npx, OS, and package manager availability
