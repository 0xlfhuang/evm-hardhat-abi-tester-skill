#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -x "$SCRIPT_DIR/scripts/install-from-dir.sh" ]]; then
  exec "$SCRIPT_DIR/scripts/install-from-dir.sh" --source-dir "$SCRIPT_DIR" "$@"
fi

REPO=""
PASS_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      REPO="${2:-}"
      shift 2
      ;;
    *)
      PASS_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ -z "$REPO" ]]; then
  echo "Remote install requires --repo <owner>/<repo>."
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

ARCHIVE_URL="https://codeload.github.com/${REPO}/tar.gz/refs/heads/main"
echo "Downloading ${REPO} ..."
curl -fsSL "$ARCHIVE_URL" -o "$TMP_DIR/repo.tar.gz"
tar -xzf "$TMP_DIR/repo.tar.gz" -C "$TMP_DIR"

SOURCE_DIR="$(find "$TMP_DIR" -maxdepth 1 -type d -name "$(basename "$REPO")-*" | head -n 1)"
if [[ -z "$SOURCE_DIR" ]]; then
  echo "Could not unpack repository archive for ${REPO}."
  exit 1
fi

exec "$SOURCE_DIR/scripts/install-from-dir.sh" --source-dir "$SOURCE_DIR" "${PASS_ARGS[@]}"
