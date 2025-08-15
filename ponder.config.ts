import { createConfig } from "ponder";

import { SwapContractAbi } from "./abis/UniswapABI";

export default createConfig({
  chains: {
    sonicBlazeTestnet: {
      id: 57054, // Sonic Blaze testnet chain ID
      rpc: process.env.PONDER_RPC_URL_57054 || "https://rpc.blaze.soniclabs.com",
    },
  },
  contracts: {
    SwapContract: {
      chain: "sonicBlazeTestnet",
      abi: SwapContractAbi,
      address: "0xAF3097d87b080F681d8F134FBc649d87A5F84500",
      startBlock: 1, // Adjust this to deployment block
    },
  },
});
