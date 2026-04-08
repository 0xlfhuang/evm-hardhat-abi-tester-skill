require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// 统一补齐私钥前缀，避免用户把不带 0x 的值直接写进 .env 后报错。
function normalizePrivateKey(value) {
  if (!value) {
    return "";
  }

  return value.startsWith("0x") ? value : `0x${value}`;
}

const privateKey = normalizePrivateKey(process.env.PRIVATE_KEY);

module.exports = {
  solidity: "0.8.24",
  // 这个默认网络名需要和 .env、package.json、README 里的示例命令保持一致。
  defaultNetwork: "gsc_v2_test",
  networks: {
    gsc_v2_test: {
      // 如果用户还没有填 .env，这里会先回退到本地节点地址，方便理解配置来源。
      url: process.env.RPC_URL || "http://127.0.0.1:8545",
      chainId: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : undefined,
      // 不配置私钥时，Hardhat 仍然可以做只读调用，但不能直接发起写交易。
      accounts: privateKey ? [privateKey] : []
    }
  },
  mocha: {
    // 链上调用有时会慢一些，给测试一个相对宽松的超时时间。
    timeout: 120000
  }
};
