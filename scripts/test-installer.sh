#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

TEST_HOME="$TMP_DIR/home"
TEST_PROJECT="$TMP_DIR/project"
mkdir -p "$TEST_HOME" "$TEST_PROJECT"

echo "Testing codex-user install ..."
"$REPO_DIR/scripts/install-from-dir.sh" --source-dir "$REPO_DIR" --tool codex-user --home "$TEST_HOME"
test -f "$TEST_HOME/.codex/skills/evm-hardhat-abi-tester/SKILL.md"

echo "Testing claude-user install ..."
"$REPO_DIR/scripts/install-from-dir.sh" --source-dir "$REPO_DIR" --tool claude-user --home "$TEST_HOME"
test -f "$TEST_HOME/.claude/agents/evm-hardhat-abi-tester.md"
test -f "$TEST_HOME/.agent-skills/evm-hardhat-abi-tester/SKILL.md"

echo "Testing project-all install ..."
"$REPO_DIR/scripts/install-from-dir.sh" --source-dir "$REPO_DIR" --tool project-all --target-dir "$TEST_PROJECT"
test -f "$TEST_PROJECT/AGENTS.md"
test -f "$TEST_PROJECT/CLAUDE.md"
test -f "$TEST_PROJECT/GEMINI.md"
test -f "$TEST_PROJECT/.github/copilot-instructions.md"
test -f "$TEST_PROJECT/.cursor/rules/evm-hardhat-abi-tester.mdc"
test -f "$TEST_PROJECT/.agent-skills/evm-hardhat-abi-tester/SKILL.md"

echo "Installer tests passed."
