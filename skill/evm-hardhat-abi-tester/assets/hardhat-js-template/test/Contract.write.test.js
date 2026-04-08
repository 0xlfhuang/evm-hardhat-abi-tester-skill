const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// 写测试和读测试共用同一份目标配置，方便统一维护地址和 ABI。
function loadTargets() {
  const filePath = path.join(__dirname, "..", "config", "targets.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// 这里读取的 ABI 会用于构造可写合约实例。
function loadAbi(abiPath) {
  const filePath = path.join(__dirname, "..", abiPath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

describe("Contract write tests", function () {
  const targets = loadTargets();
  const contractAddress = process.env.CONTRACT_ADDRESS || targets.contractAddress;
  const abi = loadAbi(targets.abiPath);

  // 新增写测试前，建议先按这个顺序确认：
  // 1. contractAddress 已经填写正确
  // 2. PRIVATE_KEY 对应的是测试钱包，不是生产钱包
  // 3. 方法名、参数顺序、副作用都已经确认
  // 4. 能先用 staticCall 预检查时，优先先做预检查
  //
  // 可以参考下面这个占位结构来新增写测试：
  //
  // it("calls a state-changing method after confirmation", async function () {
  //   this.skip(); // 确认安全前先保持跳过
  //
  //   const [signer] = await ethers.getSigners();
  //   const contract = new ethers.Contract(contractAddress, abi, signer);
  //
  //   // 先做静态预检查（如果目标方法支持）
  //   // await contract.yourMethod.staticCall(arg1, arg2);
  //
  //   // 再执行真实交易
  //   // const tx = await contract.yourMethod(arg1, arg2);
  //   // await tx.wait();
  // });

  it("prepares a signer when PRIVATE_KEY is configured", async function () {
    // 没有私钥时跳过，表示当前环境只适合做只读测试。
    if (!process.env.PRIVATE_KEY) {
      this.skip();
    }

    const [signer] = await ethers.getSigners();
    expect(await signer.getAddress()).to.match(/^0x[a-fA-F0-9]{40}$/);
  });

  it("template write call stays disabled until method and args are confirmed", async function () {
    // 这里默认故意跳过，目的是防止新手在没有确认方法和参数前直接发送真实交易。
    this.skip();

    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // 把这里替换成真实的状态修改方法前，先确认方法名、参数顺序和副作用。
    await contract.replaceWithStateChangingMethod();
  });

  // 如果后续要补多个写测试，建议继续按功能拆分 case，
  // 并把每个 case 对应的方法说明、参数示例和风险说明同步写进 docs/<ContractName>.md。
});
