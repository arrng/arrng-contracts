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

const BLESSNET_API_KEY = process.env.ETHERSCAN_API_KEY || "" // no api key required, so just use this for now.

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
      blast_sepolia: "blast_sepolia", // apiKey is not required, just set a placeholder
      blessnet: BLESSNET_API_KEY,
      blessnetSepolia: BLESSNET_API_KEY,
    },
    customChains: [
      {
        network: "blast_sepolia",
        chainId: 168587773,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://testnet.blastscan.io",
        },
      },
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
    blast_sepolia: {
      url: "https://sepolia.blast.io",
      chainId: 168587773,
    },
    blessnet_sepolia: {
      url: `https://blessnet-sepolia-testnet.rpc.caldera.xyz/http`,
      chainId: 11145513,
    },
    blessnet: {
      url: `https://blessnet.calderachain.xyz/http`,
      chainId: 45513,
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
