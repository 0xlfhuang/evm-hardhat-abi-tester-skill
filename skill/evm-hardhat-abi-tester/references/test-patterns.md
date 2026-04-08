# Test Patterns

## Read Test Pattern

Read tests should usually contain:
- one connection test that checks bytecode exists at the configured address
- one or more safe `view` or `pure` method calls
- console output that helps a beginner see what was returned

Pattern:

```js
const contract = new ethers.Contract(contractAddress, abi, ethers.provider);
const result = await contract.methodName(...args);
console.log("methodName =>", result);
```

## Write Test Pattern

Write tests should usually contain:
- a clear title describing the action
- a skipped default state until inputs are confirmed
- an optional `staticCall` preflight
- `tx.wait()` before asserting success
- receipt or event parsing when that helps the user understand what happened

Pattern:

```js
const [signer] = await ethers.getSigners();
const contract = new ethers.Contract(contractAddress, abi, signer);
const preview = await contract.methodName.staticCall(...args);
const tx = await contract.methodName(...args);
const receipt = await tx.wait();
console.log("tx hash:", receipt.hash ?? tx.hash);
```

## Event Parsing Pattern

Use this when the docs describe important emitted events:

```js
const iface = new ethers.Interface(abi);
for (const log of receipt.logs) {
  try {
    const parsed = iface.parseLog(log);
    console.log("event:", parsed.name, parsed.args);
  } catch (_) {}
}
```

## Execution Pattern

Prefer these command shapes for beginner guidance:

```bash
npx hardhat run scripts/smoke/read-contract.js --network gsc_v2_test
npx hardhat test test/Contract.read.test.js --network gsc_v2_test
npx hardhat test test/Contract.write.test.js --network gsc_v2_test --grep "case name"
```
