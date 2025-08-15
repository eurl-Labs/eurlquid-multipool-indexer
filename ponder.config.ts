import { createConfig } from "ponder";

import { UniswapABI } from "./abis/UniswapABI";
import { oneInchABI } from "./abis/OneInchABI";
import { curveABI } from "./abis/CurveABI";
import { BalancerABI } from "./abis/BalancerABI";

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
      abi: UniswapABI,
      address: "0xAF3097d87b080F681d8F134FBc649d87A5F84500",
      startBlock: 57750000, // Start from before the first event
    },
    OneInchContract: {
      chain: "sonicBlazeTestnet",
      abi: oneInchABI, // Using same ABI
      address: "0x9Fc1bBfa84B9041dd520BB533bBc2F8845537bBE",
      startBlock: 57767257,
    },
    CurveContract: {
      chain: "sonicBlazeTestnet",
      abi: curveABI, // Using same ABI
      address: "0x0c144C1CA973E36B499d216da6001D3822B15b57",
      startBlock: 57764694,
    },
    BalancerContract: {
      chain: "sonicBlazeTestnet",
      abi: BalancerABI, // Using same ABI
      address: "0xacC58C9D66c849B7877B857ce00212DD721BCab9",
      startBlock: 57798800,
    },
  },
});
