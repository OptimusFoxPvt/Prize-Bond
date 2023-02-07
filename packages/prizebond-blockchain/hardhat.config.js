require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const {FANTOM_APIKEY, PRIVATE_KEY, ID, ETHERSCAN_APIKEY} =  process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    fantomtest: {
      url: FANTOM_APIKEY,
      accounts: [PRIVATE_KEY],
      chainId: 4002,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
  },
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_APIKEY,
  },
};