# 🌊 Eurlquid Multi-DEX Swap Indexer

An indexer for multiple DEX smart contracts on **Sonic Mainnet** using [Ponder](https://ponder.sh).  
This service indexes events like **swaps, pool creation, and liquidity changes** across multiple DEXs and exposes them via **GraphQL** and **REST API**.

---

## 🔗 Contract Details

- **Network**: Sonic Mainnet  
- **Chain ID**: 146  
- **RPC URL**: https://rpc.soniclabs.com  

### Indexed Contracts
- **Uniswap**: `0x50D1672685E594B27F298Ac5bFACa4F3488AAA9c`  
- **1inch**: `0xA9b3eD890229E575863514ef8464C0e6a771Bc58`  
- **Curve**: `0x03a6FE06D6C0C7c9726Ecd079cD9283A37b4c178`  
- **Balancer**: `0x2B778181dAB6Db356b00931a6c1833E1450f9655`  

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root folder:

```bash
# Sonic RPC endpoint
PONDER_RPC_URL_57054=https://rpc.soniclabs.com

# Database schema (default: public)
DATABASE_SCHEMA=public

🚀 Setup & Running
# Install dependencies
pnpm install

# Run in development mode
pnpm dev


Once running, you can access:

GraphQL Playground → http://localhost:42069/graphql

REST API Endpoints → http://localhost:42069/api/

🧪 Example GraphQL Queries
🔹 Recent Swaps
query GetRecentSwaps($limit: Int = 20) {
  swaps(orderBy: "timestamp", orderDirection: "desc", limit: $limit) {
    items {
      id
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
    }
  }
}

🔹 Pool Details
query GetPoolDetails($poolId: String!) {
  pools(where: { id: $poolId }) {
    items {
      id
      token_a
      token_b
      reserve_a
      reserve_b
      total_supply
      created_at
    }
  }
}

🔹 User Swap History
query GetUserSwaps($wallet: String!) {
  swaps(
    where: { trader: $wallet }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 50
  ) {
    items {
      pool_id
      dex_name
      amount_in
      amount_out
      timestamp
      transaction_hash
    }
  }
}

🛠 Scripts
pnpm dev       # Start dev server (hot reload)
pnpm start     # Run in production
pnpm db        # Database management
pnpm codegen   # Generate types from schema
pnpm lint      # Run ESLint
pnpm typecheck # Run TypeScript type checking


