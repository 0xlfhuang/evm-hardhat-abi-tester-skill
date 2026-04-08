# Node.js Setup

Use this reference when the user wants the Skill to work in a truly empty directory on a machine that may not have Node.js installed yet.

## First Check

Run:

```bash
node -v
npm -v
```

If both succeed, continue to the Hardhat project setup.

If either fails, inspect the OS and available package managers:

```bash
uname -s
which brew
which apt-get
which dnf
which winget
```

You can also run `scripts/check-nodejs-env.sh` for a quick diagnosis.

## Automatic Install Policy

Prefer automatic installation when:
- the package manager is clearly available
- the command is standard for the platform
- the user has allowed the install command

Prefer guided installation instead when:
- the environment is locked down
- there is no obvious package manager
- the install command requires choices the user should make first

After installation, rerun:

```bash
node -v
npm -v
```

## macOS

Preferred:

```bash
brew install node
```

Fallback:
- ask the user to install Node.js LTS from the official installer
- if the user prefers version managers, `nvm` is acceptable, but keep beginner instructions simple

## Ubuntu / Debian

Preferred:

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm
```

If the distro package is too old for the user's project:
- explain that Node.js LTS from NodeSource or `nvm` may be better
- only switch to that path if the default package clearly causes a version problem

## Fedora

Preferred:

```bash
sudo dnf install -y nodejs npm
```

## Windows

Preferred:

```powershell
winget install OpenJS.NodeJS.LTS
```

Fallback:
- official Node.js LTS installer

## Verification After Install

Run:

```bash
node -v
npm -v
npx --version
```

Then in the target project directory:

```bash
npm install
npx --no-install hardhat --version
```

Use `npx --no-install hardhat ...` if the environment resolves `npx hardhat` unreliably.

## Beginner-Facing Explanation

When explaining this step to a beginner:
- say Node.js is the runtime used to execute Hardhat and the test scripts
- say npm is the package manager used to install Hardhat and related dependencies
- explain that the Skill can scaffold the project automatically, but it still needs Node.js available on the machine first
