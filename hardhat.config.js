require("@nomicfoundation/hardhat-toolbox")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-etherscan-abi")
const dotenv = require("dotenv")

dotenv.config()

const {
  ETHERSCAN_API_KEY,
  ARBISCAN_API_KEY,
  OPTIMISM_API_KEY,
  POLYGONSCAN_API_KEY,
  ARBI_GOERLI_ALCHEMY_API_KEY,
  ARBI_MAINNET_ALCHEMY_API_KEY,
  OPTI_GOERLI_ALCHEMY_API_KEY,
  OPTI_MAINNET_ALCHEMY_API_KEY,
  POLY_MAINNET_ALCHEMY_API_KEY,
  POLY_MUMBAI_ALCHEMY_API_KEY,
} = process.env

module.exports = {
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      arbitrumGoerli: ARBISCAN_API_KEY,
      optimisticGoerli: OPTIMISM_API_KEY,
      optimisticEthereum: OPTIMISM_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
    },
    customChains: [],
  },

  networks: {
    hardhat: {
      //
    },
    arbitrumGoerli: {
      url: `https://arb-goerli.g.alchemy.com/v2/${ARBI_GOERLI_ALCHEMY_API_KEY}`,
      chainId: 421613,
      //gasPrice: 5 * 1_000_000_000, // gwei
      //accounts: [`0x${GOERLI_PRIVATE_KEY}`],
    },
    arbitrumOne: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${ARBI_MAINNET_ALCHEMY_API_KEY}`,
      chainId: 42161,
      //gasPrice: 55 * 1_000_000_000, // gwei
      //accounts: [`0x${MAINNET_PRIVATE_KEY}`],
    },
    optimisticGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${OPTI_GOERLI_ALCHEMY_API_KEY}`,
      chainId: 420,
      //gasPrice: 55 * 1_000_000_000, // gwei
      //accounts: [`0x${MAINNET_PRIVATE_KEY}`],
    },
    optimisticEthereum: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${OPTI_MAINNET_ALCHEMY_API_KEY}`,
      chainId: 10,
      //gasPrice: 55 * 1_000_000_000, // gwei
      //accounts: [`0x${MAINNET_PRIVATE_KEY}`],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${POLY_MUMBAI_ALCHEMY_API_KEY}`,
      chainId: 80001,
      //gasPrice: 55 * 1_000_000_000, // gwei
      //accounts: [`0x${MAINNET_PRIVATE_KEY}`],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${POLY_MAINNET_ALCHEMY_API_KEY}`,
      chainId: 137,
      //gasPrice: 55 * 1_000_000_000, // gwei
      //accounts: [`0x${MAINNET_PRIVATE_KEY}`],
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
  },
}
