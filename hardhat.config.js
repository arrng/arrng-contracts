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
  ALCHEMY_PROVIDER_KEY,
} = process.env

const BLESSNET_API_KEY = process.env.ETHERSCAN_API_KEY || "" // no api key required, so just use this for now.

module.exports = {
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
      optimisticEthereum: OPTIMISM_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      blessnet: BLESSNET_API_KEY,
      blessnetSepolia: BLESSNET_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "blessnet",
        chainId: 45513,
        urls: {
          apiURL: "https://blessnet.calderaexplorer.xyz/api",
          browserURL: "https://scan.bless.net/",
        },
      },
      {
        network: "blessnetSepolia",
        chainId: 11145513,
        urls: {
          apiURL: "https://blessnet-sepolia-testnet.explorer.caldera.xyz/api",
          browserURL: "https://blessnet-sepolia-testnet.explorer.caldera.xyz/",
        },
      },
    ],
  },

  networks: {
    hardhat: {
      //
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_PROVIDER_KEY}`,
      chainId: 1,
    },
    arbitrumOne: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_PROVIDER_KEY}`,
      chainId: 42161,
    },
    optimisticEthereum: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_PROVIDER_KEY}`,
      chainId: 10,
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_PROVIDER_KEY}`,
      chainId: 137,
    },
    blessnet_sepolia: {
      url: `https://blessnet-sepolia-testnet.rpc.caldera.xyz/http`,
      chainId: 11145513,
    },
    blessnet: {
      url: `https://blessnet.calderachain.xyz/http`,
      chainId: 45513,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_PROVIDER_KEY}`,
      chainId: 11155111,
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
