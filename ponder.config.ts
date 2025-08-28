import { createConfig } from "ponder";

import { UniswapABI } from "./abis/UniswapABI";
import { oneInchABI } from "./abis/OneInchABI";
import { curveABI } from "./abis/CurveABI";
import { BalancerABI } from "./abis/BalancerABI";

export default createConfig({
  chains: {
    sonicMainnet: {
      id: 146,
      rpc: process.env.PONDER_RPC_URL_57054 || "https://rpc.soniclabs.com",
    },
  },
  contracts: {
    SwapContract: {
      chain: "sonicMainnet",
      abi: UniswapABI,
      address: "0x50D1672685E594B27F298Ac5bFACa4F3488AAA9c",
      startBlock: 44382504, // 44,582,504 - 200,000
    },
    OneInchContract: {
      chain: "sonicMainnet",
      abi: oneInchABI,
      address: "0xA9b3eD890229E575863514ef8464C0e6a771Bc58",
      startBlock: 44382610, // 44,582,610 - 200,000
    },
    CurveContract: {
      chain: "sonicMainnet",
      abi: curveABI,
      address: "0x03a6FE06D6C0C7c9726Ecd079cD9283A37b4c178",
      startBlock: 44382722, // 44,582,674 - 200,000
    },
    BalancerContract: {
      chain: "sonicMainnet",
      abi: BalancerABI,
      address: "0x2B778181dAB6Db356b00931a6c1833E1450f9655",
      startBlock: 44382722, // 44,582,722 - 200,000
    },
  },
});

