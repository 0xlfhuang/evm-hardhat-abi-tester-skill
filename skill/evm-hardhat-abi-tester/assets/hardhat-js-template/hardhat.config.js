require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

function normalizePrivateKey(value) {
  if (!value) {
    return "";
  }

  return value.startsWith("0x") ? value : `0x${value}`;
}

const privateKey = normalizePrivateKey(process.env.PRIVATE_KEY);

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "gsc_v2_test",
  networks: {
    gsc_v2_test: {
      url: process.env.RPC_URL || "http://127.0.0.1:8545",
      chainId: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : undefined,
      accounts: privateKey ? [privateKey] : []
    }
  },
  mocha: {
    timeout: 120000
  }
};
