const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// smoke 脚本会先读取统一配置，再决定连哪个合约、调用哪个只读方法。
function loadTargets() {
  const filePath = path.join(__dirname, "..", "..", "config", "targets.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// ABI 路径不写死在脚本里，后续替换合约时只改 targets.json 即可。
function loadAbi(abiPath) {
  const filePath = path.join(__dirname, "..", "..", abiPath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function main() {
  const targets = loadTargets();
  const contractName = process.env.CONTRACT_NAME || targets.contractName || "Contract";
  const contractAddress = process.env.CONTRACT_ADDRESS || targets.contractAddress;
  const smokeRead = targets.smokeRead || {};

  // 没有地址时直接提示用户先补配置，而不是抛出复杂报错。
  if (!contractAddress) {
    console.log("CONTRACT_ADDRESS is empty. Fill .env first, then rerun this smoke script.");
    return;
  }

  // 先检查地址上是否真的部署了合约代码，这是最基础的一步连通性验证。
  const code = await hre.ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error(`No deployed bytecode found at ${contractAddress}`);
  }

  console.log(`Connected to ${contractName} at ${contractAddress}`);

  if (!smokeRead.method) {
    console.log("No smokeRead.method configured yet. Update config/targets.json with a safe view method.");
    return;
  }

  // 这里只做一个安全的只读调用，帮助用户先确认 ABI、地址和 RPC 是否匹配。
  const abi = loadAbi(targets.abiPath);
  const contract = new hre.ethers.Contract(contractAddress, abi, hre.ethers.provider);
  const result = await contract[smokeRead.method](...(smokeRead.args || []));

  console.log(`${contractName}.${smokeRead.method} =>`, result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
