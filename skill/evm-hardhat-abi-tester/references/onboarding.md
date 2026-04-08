# Beginner Onboarding Flow

Use this order for beginners:

1. Check `node -v` and `npm -v`.
2. If either is missing, install Node.js first or guide the user using `references/nodejs-setup.md`.
3. Explain that the project is for interacting with an already deployed contract by ABI, not for deploying source code.
4. Confirm the default network alias is `gsc_v2_test`.
5. Confirm whether the generated project README should be in Chinese or English.
6. Gather `RPC_URL`, `CHAIN_ID`, `PRIVATE_KEY`, `ABI`, and optional `CONTRACT_ADDRESS`.
7. Copy the Hardhat template into the target directory.
8. Fill `.env`, `.env.example`, `README.md`, `abi/`, `docs/`, and `config/targets.json`.
9. Tell the user to read `README.md` first so they understand the scaffold layout.
10. Run the smoke script first.
11. Run the read test file next.
12. Only after that, discuss write tests.

Recommended command order:

```bash
node -v
npm -v
npm install
npx hardhat run scripts/smoke/read-contract.js --network gsc_v2_test
npx hardhat test test/Contract.read.test.js --network gsc_v2_test
```

If no contract address is available yet:
- keep the project scaffolded
- still generate `README.md` and explain the missing address impact there
- explain that read and write tests will stay skipped until the address is added
- keep the next action focused on filling `CONTRACT_ADDRESS`

If the user gives another network alias:
- replace `gsc_v2_test` consistently in `hardhat.config.js`
- update command examples
- update `config/targets.json`
- update the generated `README.md`
