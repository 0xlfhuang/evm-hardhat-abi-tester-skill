#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR=""
TOOL=""
TARGET_DIR=""
TARGET_HOME="${HOME}"

usage() {
  cat <<'EOF'
Usage:
  install-from-dir.sh --source-dir <repo-dir> --tool <mode> [--target-dir <dir>] [--home <dir>]

Modes:
  codex-user
  claude-user
  claude-project
  cursor-project
  copilot-project
  gemini-project
  project-all
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source-dir)
      SOURCE_DIR="${2:-}"
      shift 2
      ;;
    --tool)
      TOOL="${2:-}"
      shift 2
      ;;
    --target-dir)
      TARGET_DIR="${2:-}"
      shift 2
      ;;
    --home)
      TARGET_HOME="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$SOURCE_DIR" || -z "$TOOL" ]]; then
  usage
  exit 1
fi

SOURCE_DIR="$(cd "$SOURCE_DIR" && pwd)"
SKILL_SRC="$SOURCE_DIR/skill/evm-hardhat-abi-tester"
TEMPLATE_DIR="$SOURCE_DIR/templates"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"

if [[ ! -d "$SKILL_SRC" ]]; then
  echo "Skill source not found: $SKILL_SRC"
  exit 1
fi

backup_if_exists() {
  local path="$1"
  if [[ -e "$path" || -L "$path" ]]; then
    mv "$path" "${path}.bak.${TIMESTAMP}"
  fi
}

copy_dir_contents() {
  local src="$1"
  local dest="$2"
  mkdir -p "$dest"
  cp -R "$src"/. "$dest"/
}

install_bundle() {
  local dest="$1"
  backup_if_exists "$dest"
  mkdir -p "$dest"
  copy_dir_contents "$SKILL_SRC" "$dest"
}

escape_sed() {
  printf '%s' "$1" | sed 's/[\/&]/\\&/g'
}

render_template() {
  local src="$1"
  local dest="$2"
  local bundle_path="$3"
  local bundle_escaped
  bundle_escaped="$(escape_sed "$bundle_path")"
  mkdir -p "$(dirname "$dest")"
  sed "s/__BUNDLE_PATH__/${bundle_escaped}/g" "$src" > "$dest"
}

ensure_project_target() {
  if [[ -z "$TARGET_DIR" ]]; then
    TARGET_DIR="$PWD"
  fi
  mkdir -p "$TARGET_DIR"
  TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
}

install_codex_user() {
  local dest="$TARGET_HOME/.codex/skills/evm-hardhat-abi-tester"
  install_bundle "$dest"
  echo "Installed Codex skill to $dest"
}

install_claude_user() {
  local bundle_dest="$TARGET_HOME/.agent-skills/evm-hardhat-abi-tester"
  local agent_dest="$TARGET_HOME/.claude/agents/evm-hardhat-abi-tester.md"
  install_bundle "$bundle_dest"
  mkdir -p "$(dirname "$agent_dest")"
  backup_if_exists "$agent_dest"
  render_template "$TEMPLATE_DIR/CLAUDE.md.tmpl" "$agent_dest" "$bundle_dest"
  echo "Installed Claude Code user agent to $agent_dest"
}

install_claude_project() {
  ensure_project_target
  local bundle_dest="$TARGET_DIR/.agent-skills/evm-hardhat-abi-tester"
  local doc_dest="$TARGET_DIR/CLAUDE.md"
  install_bundle "$bundle_dest"
  backup_if_exists "$doc_dest"
  render_template "$TEMPLATE_DIR/CLAUDE.md.tmpl" "$doc_dest" "./.agent-skills/evm-hardhat-abi-tester"
  echo "Installed Claude project files to $TARGET_DIR"
}

install_cursor_project() {
  ensure_project_target
  local bundle_dest="$TARGET_DIR/.agent-skills/evm-hardhat-abi-tester"
  local rule_dest="$TARGET_DIR/.cursor/rules/evm-hardhat-abi-tester.mdc"
  install_bundle "$bundle_dest"
  backup_if_exists "$rule_dest"
  render_template "$TEMPLATE_DIR/cursor-rule.mdc.tmpl" "$rule_dest" "./.agent-skills/evm-hardhat-abi-tester"
  echo "Installed Cursor rule to $rule_dest"
}

install_copilot_project() {
  ensure_project_target
  local bundle_dest="$TARGET_DIR/.agent-skills/evm-hardhat-abi-tester"
  local agents_dest="$TARGET_DIR/AGENTS.md"
  local copilot_dest="$TARGET_DIR/.github/copilot-instructions.md"
  install_bundle "$bundle_dest"
  backup_if_exists "$agents_dest"
  backup_if_exists "$copilot_dest"
  render_template "$TEMPLATE_DIR/AGENTS.md.tmpl" "$agents_dest" "./.agent-skills/evm-hardhat-abi-tester"
  render_template "$TEMPLATE_DIR/copilot-instructions.md.tmpl" "$copilot_dest" "./.agent-skills/evm-hardhat-abi-tester"
  echo "Installed GitHub Copilot instructions to $TARGET_DIR"
}

install_gemini_project() {
  ensure_project_target
  local bundle_dest="$TARGET_DIR/.agent-skills/evm-hardhat-abi-tester"
  local gemini_dest="$TARGET_DIR/GEMINI.md"
  install_bundle "$bundle_dest"
  backup_if_exists "$gemini_dest"
  render_template "$TEMPLATE_DIR/GEMINI.md.tmpl" "$gemini_dest" "./.agent-skills/evm-hardhat-abi-tester"
  echo "Installed Gemini project file to $gemini_dest"
}

install_project_all() {
  ensure_project_target
  local bundle_dest="$TARGET_DIR/.agent-skills/evm-hardhat-abi-tester"
  local agents_dest="$TARGET_DIR/AGENTS.md"
  local claude_dest="$TARGET_DIR/CLAUDE.md"
  local gemini_dest="$TARGET_DIR/GEMINI.md"
  local copilot_dest="$TARGET_DIR/.github/copilot-instructions.md"
  local cursor_dest="$TARGET_DIR/.cursor/rules/evm-hardhat-abi-tester.mdc"

  install_bundle "$bundle_dest"
  backup_if_exists "$agents_dest"
  backup_if_exists "$claude_dest"
  backup_if_exists "$gemini_dest"
  backup_if_exists "$copilot_dest"
  backup_if_exists "$cursor_dest"

  render_template "$TEMPLATE_DIR/AGENTS.md.tmpl" "$agents_dest" "./.agent-skills/evm-hardhat-abi-tester"
  render_template "$TEMPLATE_DIR/CLAUDE.md.tmpl" "$claude_dest" "./.agent-skills/evm-hardhat-abi-tester"
  render_template "$TEMPLATE_DIR/GEMINI.md.tmpl" "$gemini_dest" "./.agent-skills/evm-hardhat-abi-tester"
  render_template "$TEMPLATE_DIR/copilot-instructions.md.tmpl" "$copilot_dest" "./.agent-skills/evm-hardhat-abi-tester"
  render_template "$TEMPLATE_DIR/cursor-rule.mdc.tmpl" "$cursor_dest" "./.agent-skills/evm-hardhat-abi-tester"
  echo "Installed universal project files to $TARGET_DIR"
}

case "$TOOL" in
  codex-user)
    install_codex_user
    ;;
  claude-user)
    install_claude_user
    ;;
  claude-project)
    install_claude_project
    ;;
  cursor-project)
    install_cursor_project
    ;;
  copilot-project)
    install_copilot_project
    ;;
  gemini-project)
    install_gemini_project
    ;;
  project-all)
    install_project_all
    ;;
  *)
    echo "Unknown tool mode: $TOOL"
    usage
    exit 1
    ;;
esac
