const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

function loadTargets() {
  const filePath = path.join(__dirname, "..", "config", "targets.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadAbi(abiPath) {
  const filePath = path.join(__dirname, "..", abiPath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

describe("Contract read tests", function () {
  const targets = loadTargets();
  const contractName = process.env.CONTRACT_NAME || targets.contractName || "Contract";
  const contractAddress = process.env.CONTRACT_ADDRESS || targets.contractAddress;
  const abi = loadAbi(targets.abiPath);
  const smokeRead = targets.smokeRead || {};

  it("verifies deployed bytecode exists when CONTRACT_ADDRESS is configured", async function () {
    if (!contractAddress) {
      this.skip();
    }

    const bytecode = await ethers.provider.getCode(contractAddress);
    expect(bytecode).to.not.equal("0x");
  });

  it("calls the configured smoke read method", async function () {
    if (!contractAddress || !smokeRead.method) {
      this.skip();
    }

    const contract = new ethers.Contract(contractAddress, abi, ethers.provider);
    const result = await contract[smokeRead.method](...(smokeRead.args || []));

    console.log(`${contractName}.${smokeRead.method} =>`, result);
    expect(result).to.not.equal(undefined);
  });
});
