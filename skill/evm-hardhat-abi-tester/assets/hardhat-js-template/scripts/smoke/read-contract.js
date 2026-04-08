const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

function loadTargets() {
  const filePath = path.join(__dirname, "..", "..", "config", "targets.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadAbi(abiPath) {
  const filePath = path.join(__dirname, "..", "..", abiPath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function main() {
  const targets = loadTargets();
  const contractName = process.env.CONTRACT_NAME || targets.contractName || "Contract";
  const contractAddress = process.env.CONTRACT_ADDRESS || targets.contractAddress;
  const smokeRead = targets.smokeRead || {};

  if (!contractAddress) {
    console.log("CONTRACT_ADDRESS is empty. Fill .env first, then rerun this smoke script.");
    return;
  }

  const code = await hre.ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error(`No deployed bytecode found at ${contractAddress}`);
  }

  console.log(`Connected to ${contractName} at ${contractAddress}`);

  if (!smokeRead.method) {
    console.log("No smokeRead.method configured yet. Update config/targets.json with a safe view method.");
    return;
  }

  const abi = loadAbi(targets.abiPath);
  const contract = new hre.ethers.Contract(contractAddress, abi, hre.ethers.provider);
  const result = await contract[smokeRead.method](...(smokeRead.args || []));

  console.log(`${contractName}.${smokeRead.method} =>`, result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
