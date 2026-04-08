#!/usr/bin/env bash
set -euo pipefail

echo "Node.js environment check"
echo

if command -v uname >/dev/null 2>&1; then
  echo "OS: $(uname -s)"
fi

echo
echo "Runtime tools:"

if command -v node >/dev/null 2>&1; then
  echo "- node: $(node -v)"
else
  echo "- node: missing"
fi

if command -v npm >/dev/null 2>&1; then
  echo "- npm: $(npm -v)"
else
  echo "- npm: missing"
fi

if command -v npx >/dev/null 2>&1; then
  echo "- npx: $(npx --version)"
else
  echo "- npx: missing"
fi

echo
echo "Package managers:"

for tool in brew apt-get dnf winget choco; do
  if command -v "$tool" >/dev/null 2>&1; then
    echo "- $tool: available"
  else
    echo "- $tool: missing"
  fi
done

echo
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Status: ready for Hardhat project setup"
else
  echo "Status: install Node.js and npm first"
fi
