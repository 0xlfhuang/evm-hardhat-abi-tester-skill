# Input Contract Materials

## Minimum Required Inputs

- `RPC_URL`: full RPC endpoint for the target EVM network
- `CHAIN_ID`: integer chain ID for that network
- `PRIVATE_KEY`: private key used for signing transactions
- `ABI`: JSON ABI array or a path to an ABI JSON file

## Recommended Inputs

- `CONTRACT_NAME`: short readable label used for filenames and test names
- `CONTRACT_ADDRESS`: deployed address of the contract to interact with
- interface documentation: method descriptions, argument meanings, expected events, common example inputs

## Normalization Rules

- Store connection values in `.env`
- Save the ABI as `abi/<ContractName>.json` when the contract name is known
- Save interface notes as `docs/<ContractName>.md`
- Keep `docs/<ContractName>.md` structured so beginners can quickly find:
  - what the contract does
  - which read methods are safest to call first
  - which write methods should stay disabled for now
  - argument examples and smoke-read suggestions
- Update `config/targets.json` as the single summary of what to test

## How To Derive Good Starter Tests

Prefer these in order:

1. A safe `view` method with no arguments
2. A safe `view` method with simple scalar arguments
3. A static preflight for a future write action

Avoid choosing the first smoke read from:
- admin-only methods
- overloaded methods if the docs are ambiguous
- methods requiring complex tuple or bytes payloads

When there is no contract address yet:
- still write `.env.example`
- still save the ABI and docs
- keep `contractAddress` empty in `config/targets.json`
- leave `smokeRead.method` empty if a real call cannot run yet
