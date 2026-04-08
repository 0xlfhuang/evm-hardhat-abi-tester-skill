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

describe("Contract write tests", function () {
  const targets = loadTargets();
  const contractAddress = process.env.CONTRACT_ADDRESS || targets.contractAddress;
  const abi = loadAbi(targets.abiPath);

  it("prepares a signer when PRIVATE_KEY is configured", async function () {
    if (!process.env.PRIVATE_KEY) {
      this.skip();
    }

    const [signer] = await ethers.getSigners();
    expect(await signer.getAddress()).to.match(/^0x[a-fA-F0-9]{40}$/);
  });

  it("template write call stays disabled until method and args are confirmed", async function () {
    this.skip();

    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    await contract.replaceWithStateChangingMethod();
  });
});
