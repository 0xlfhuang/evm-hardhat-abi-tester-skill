# evm-hardhat-abi-tester-skill

[English](./README.md) | [中文概览](./docs/README.zh-CN.md) | [中文使用指南](./docs/usage.zh-CN.md)

`evm-hardhat-abi-tester-skill` is an installable skill bundle for AI coding tools. It helps agents scaffold beginner-friendly Hardhat JavaScript projects for interacting with deployed EVM smart contracts from ABI files, RPC credentials, contract notes, and an optional contract address.

This repository contains:

- a reusable skill bundle in `skill/evm-hardhat-abi-tester`
- installation templates for multiple agent tools
- shell installers for local and GitHub-based distribution
- a minimal validation script for the installer flows

It does not ship a production dApp or Solidity source tree. The goal is to distribute a reusable agent skill that can generate and customize Hardhat test projects on demand.

## Features

- Scaffolds Hardhat JavaScript projects for existing deployed contracts
- Starts from ABI, RPC URL, chain ID, private key, and interface notes
- Encourages a safe read-first workflow before enabling write tests
- Defaults to the `gsc_v2_test` network alias
- Supports distribution across several AI coding environments
- Provides one-command installation for user-level and project-level setups

## Supported Tools

| Tool | Install mode | Output |
| --- | --- | --- |
| Codex | User-level | `~/.codex/skills/evm-hardhat-abi-tester` |
| Claude Code | User-level | `~/.agent-skills/evm-hardhat-abi-tester` and `~/.claude/agents/evm-hardhat-abi-tester.md` |
| Claude Code | Project-level | `.agent-skills/evm-hardhat-abi-tester` and `CLAUDE.md` |
| Cursor | Project-level | `.agent-skills/evm-hardhat-abi-tester` and `.cursor/rules/evm-hardhat-abi-tester.mdc` |
| GitHub Copilot Coding Agent | Project-level | `.agent-skills/evm-hardhat-abi-tester`, `AGENTS.md`, and `.github/copilot-instructions.md` |
| Gemini CLI | Project-level | `.agent-skills/evm-hardhat-abi-tester` and `GEMINI.md` |
| Universal project mode | Project-level | Installs the bundle and writes all supported project files at once |

## Requirements

- Bash
- Standard Unix utilities such as `cp`, `sed`, `tar`, and `mktemp`
- One supported AI coding tool, depending on your target install mode
- `curl` if you plan to install directly from GitHub

## Quick Start

### Install from a local clone

```bash
./install.sh --tool codex-user
./install.sh --tool claude-user
./install.sh --tool project-all --target-dir /path/to/project
```

### Install from GitHub

Replace `<owner>/<repo>` with your repository slug:

```bash
curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/install.sh | bash -s -- --repo <owner>/<repo> --tool codex-user

curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/install.sh | bash -s -- --repo <owner>/<repo> --tool claude-user

curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/install.sh | bash -s -- --repo <owner>/<repo> --tool project-all --target-dir /path/to/project
```

## Installation Modes

### Codex

```bash
./install.sh --tool codex-user
```

Example prompt:

```text
Use $evm-hardhat-abi-tester to set up a Hardhat JavaScript test project for my deployed contract.
```

### Claude Code

User-level install:

```bash
./install.sh --tool claude-user
```

Project-level install:

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

### Universal Project Install

```bash
./install.sh --tool project-all --target-dir /path/to/project
```

Use this mode when you want one project to include prompt files for multiple agent ecosystems.

## Usage

After installation, the bundle can be used in two different ways depending on the tool:

- Codex user install: directly invoke the skill by name with `$evm-hardhat-abi-tester`
- Project-based installs for Claude, Cursor, Copilot, and Gemini: ask the agent to scaffold or test a deployed EVM contract from ABI, and the installed project instructions will point the agent to this bundle automatically

For a fuller Chinese walkthrough, see [docs/usage.zh-CN.md](./docs/usage.zh-CN.md).

| Tool | Installed entry point | How to ask | What the agent does first |
| --- | --- | --- | --- |
| Codex | `~/.codex/skills/evm-hardhat-abi-tester` | Mention `$evm-hardhat-abi-tester` directly | Read the bundle and check Node.js and npm |
| Claude Code | `~/.claude/agents/evm-hardhat-abi-tester.md` or `CLAUDE.md` | Ask to scaffold or test a deployed contract from ABI | Read the installed bundle instructions |
| Cursor | `.cursor/rules/evm-hardhat-abi-tester.mdc` | Ask to scaffold ABI-based Hardhat tests in the project | Apply the installed rule and read the bundle |
| GitHub Copilot Coding Agent | `AGENTS.md` and `.github/copilot-instructions.md` | Ask to scaffold or run tests for a deployed EVM contract | Follow the installed agent instructions |
| Gemini CLI | `GEMINI.md` | Ask for Hardhat ABI-driven contract testing setup | Read the local bundle and collect inputs |

### Example Prompt

```text
Use $evm-hardhat-abi-tester to scaffold a Hardhat JavaScript test project for my deployed contract.

RPC_URL=...
CHAIN_ID=...
PRIVATE_KEY=...
ABI=...

Optional contract address: 0x...
Optional interface notes: ...
```

### What To Prepare

Have these inputs ready before you call the skill:

- `RPC_URL`
- `CHAIN_ID`
- `PRIVATE_KEY`
- `ABI`
- optional `CONTRACT_ADDRESS`
- optional interface notes, docs, or method descriptions

### What Happens Next

Once triggered, the agent is expected to follow the bundle workflow:

- check whether Node.js and npm are available
- copy the bundled Hardhat template into the target project
- write a local `.env` and a placeholder-only `.env.example`
- save the ABI and contract notes into the generated project
- install dependencies
- run read-first validation
- keep write tests skipped until the contract address, method, and arguments are confirmed safe

## Local Configuration and Secrets

Runtime values such as `RPC_URL`, `CHAIN_ID`, `PRIVATE_KEY`, and contract-specific connection settings are intended to live in a local `.env` file inside the generated Hardhat project.

- Store real secrets and environment-specific values in `.env`
- Keep `.env.example` tracked with placeholder values only
- Do not commit `.env`, private keys, or funded account credentials to Git
- Prefer a dedicated test account private key instead of a production wallet

This repository distributes templates and agent instructions. It is not meant to hardcode live RPC credentials or private keys into tracked files.

## What The Skill Helps Generate

Once installed, the skill is designed to guide an agent through:

- checking the local Node.js and npm environment
- copying a Hardhat JavaScript template
- writing a local `.env` for runtime values and a placeholder-only `.env.example`
- storing ABI and contract notes in the generated project
- configuring a target contract entry
- producing read-focused tests before write-enabled cases

The canonical scaffold template lives in `skill/evm-hardhat-abi-tester/assets/hardhat-js-template`.

## Repository Layout

```text
skill/evm-hardhat-abi-tester/   Skill bundle, references, and Hardhat template assets
templates/                      Prompt templates for supported AI tools
scripts/install-from-dir.sh     Main installer logic
scripts/test-installer.sh       Installer smoke tests
install.sh                      Entry point for local and GitHub installs
docs/                           Additional project documentation
```

## Development

Run the installer smoke test locally:

```bash
./scripts/test-installer.sh
```

The script validates:

- Codex user installation
- Claude user installation
- universal project installation

## Contributing

Contributions are welcome. Good pull requests usually fall into one of these areas:

- improving prompts, safety rules, or onboarding guidance
- expanding installer compatibility across tools
- refining the Hardhat template and test patterns
- fixing documentation, examples, or edge cases in the setup flow

If you change installer behavior or template output, please run `./scripts/test-installer.sh` before opening a pull request.

## License

Released under the [MIT License](./LICENSE).
