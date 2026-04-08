# Generated Project README Template (English)

Use this file as a structure reference when generating the scaffold project's root `README.md`.

Do not copy this file verbatim into the generated project. Replace placeholders and tailor the content to the actual scaffold output.

## Recommended README structure

```md
# <ContractName> Hardhat ABI Test Scaffold

This project is a Hardhat JavaScript scaffold for interacting with an already deployed EVM contract by ABI.

## What This Project Contains

- `README.md`: beginner-oriented project guide
- `.env`: local runtime configuration
- `.env.example`: placeholder environment template
- `abi/<ContractName>.json`: ABI used by the tests and scripts
- `config/targets.json`: central contract and test metadata
- `docs/<ContractName>.md`: contract interface notes and testing hints
- `scripts/smoke/read-contract.js`: first safe smoke-read script
- `test/<ContractName>.read.test.js`: read-only test cases
- `test/<ContractName>.write.test.js`: conservative write-test template

## Before You Run Anything

- Fill `.env` with `RPC_URL`, `CHAIN_ID`, `PRIVATE_KEY`, `CONTRACT_NAME`, and `CONTRACT_ADDRESS`
- Do not commit `.env` or real private keys
- Use a dedicated test wallet instead of a production wallet
- If `CONTRACT_ADDRESS` is still empty, smoke/read/write behavior will stay limited or skipped

## Quick Start

```bash
npm install
npm run smoke
npm run read
```

The direct Hardhat commands remain:

```bash
npx hardhat run scripts/smoke/read-contract.js --network <NetworkName>
npx hardhat test test/<ContractName>.read.test.js --network <NetworkName>
```

Useful npm script aliases:

```bash
npm run smoke
npm run read
npm run write
```

`npm run write` still points to the conservative write-test template. For explicit execution with a focused case:

```bash
npx hardhat run scripts/smoke/read-contract.js --network <NetworkName>
npx hardhat test test/<ContractName>.read.test.js --network <NetworkName>
npx hardhat test test/<ContractName>.write.test.js --network <NetworkName> --grep "<case>"
```

## Important Files

### `.env`

Explain which fields the user must edit first.

### `config/targets.json`

Explain:
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

Explain that this file should document safe read methods, risky write methods, parameter examples, and assumptions.

## How To Add A New Read Test

1. Update `config/targets.json` with `readMethods` or `smokeRead`
2. Add a new case in `test/<ContractName>.read.test.js`
3. If needed, update `docs/<ContractName>.md` with argument notes and expected results

## How To Add A New Write Test

1. Confirm address, method name, argument order, and side effects
2. Record the target method in `config/targets.json` and `docs/<ContractName>.md`
3. Add or enable a case in `test/<ContractName>.write.test.js`
4. Prefer `staticCall` or a disabled placeholder first; do not encourage immediate live writes

## How To Change ABI, Address, Or Network

- Replace `abi/<ContractName>.json` when the ABI changes
- Update `.env` and `config/targets.json` when the address changes
- Update `.env`, `hardhat.config.js`, commands, and `config/targets.json` when the network alias changes

## Safety Notes

- Read tests should come first
- Write tests stay skipped until confirmed safe
- This project is for ABI-driven interaction with deployed contracts, not source deployment
```
