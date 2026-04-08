const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// 所有测试都从 config/targets.json 读取目标配置，避免把地址和 ABI 路径写死在代码里。
function loadTargets() {
  const filePath = path.join(__dirname, "..", "config", "targets.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// ABI 文件路径来自 targets.json，这样后续替换合约 ABI 时只需要改一处配置。
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

  // 新增读测试时，可以先参考下面这个思路：
  // 1. 先在 config/targets.json 里补充 readMethods 或 smokeRead
  // 2. 再按下面的结构新增一个 it case
  // 3. 如果方法有参数，优先把参数示例和预期结果写进 docs/<ContractName>.md
  //
  // 示例：
  // it("reads totalSupply", async function () {
  //   if (!contractAddress) {
  //     this.skip();
  //   }
  //
  //   const contract = new ethers.Contract(contractAddress, abi, ethers.provider);
  //   const result = await contract.totalSupply();
  //
  //   console.log("totalSupply =>", result.toString());
  //   expect(result).to.not.equal(undefined);
  // });

  it("verifies deployed bytecode exists when CONTRACT_ADDRESS is configured", async function () {
    // 没有地址时先跳过，避免让新手误以为脚手架本身坏了。
    if (!contractAddress) {
      this.skip();
    }

    // 先确认目标地址上真的有合约代码，再继续后面的读取测试。
    const bytecode = await ethers.provider.getCode(contractAddress);
    expect(bytecode).to.not.equal("0x");
  });

  it("calls the configured smoke read method", async function () {
    // smokeRead.method 是第一个建议调用的只读方法，没有配置前保持跳过状态。
    if (!contractAddress || !smokeRead.method) {
      this.skip();
    }

    const contract = new ethers.Contract(contractAddress, abi, ethers.provider);
    const result = await contract[smokeRead.method](...(smokeRead.args || []));

    console.log(`${contractName}.${smokeRead.method} =>`, result);
    expect(result).to.not.equal(undefined);
  });

  // 你也可以把更多只读 case 按功能分组写在这里，例如：
  //
  // describe("extra read cases", function () {
  //   it("reads owner", async function () {
  //     if (!contractAddress) {
  //       this.skip();
  //     }
  //
  //     const contract = new ethers.Contract(contractAddress, abi, ethers.provider);
  //     const owner = await contract.owner();
  //
  //     console.log("owner =>", owner);
  //     expect(owner).to.match(/^0x[a-fA-F0-9]{40}$/);
  //   });
  // });
});
