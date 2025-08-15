# Eurlquid Multi-DEX Swap Indexer

An indexer for multiple DEX smart contracts on Sonic Blaze Testnet using Ponder.

## Contract Details

- **Network**: Sonic Blaze Testnet (Chain ID: 57054)
- **RPC URL**: https://rpc.blaze.soniclabs.com

### Indexed Contracts:
- **Uniswap**: `0xAF3097d87b080F681d8F134FBc649d87A5F84500`
- **OneInch**: `0x9Fc1bBfa84B9041dd520BB533bBc2F8845537bBE`
- **Curve**: `0x0c144C1CA973E36B499d216da6001D3822B15b57`
- **Balancer**: `0xacC58C9D66c849B7877B857ce00212DD721BCab9`

## Features

This indexer tracks the following events from multiple DEX contracts:

1. **PoolCreated** - When new liquidity pools are created
2. **Swap** - When token swaps occur  
3. **LiquidityAdded** - When liquidity is added to pools

**Supported DEXs**: Uniswap, OneInch, Curve, Balancer

## Database Schema

### Pools
- `id` - Pool ID (bytes32 as hex string)
- `tokenA` - Address of token A
- `tokenB` - Address of token B  
- `reserveA` - Current reserve of token A
- `reserveB` - Current reserve of token B
- `totalSupply` - Total liquidity tokens in circulation
- `createdAt` - Block timestamp when pool was created
- `blockNumber` - Block number when pool was created

### Swaps
- `id` - Unique identifier (transactionHash-logIndex)
- `poolId` - ID of the pool where swap occurred
- `trader` - Address of the trader
- `tokenIn` - Address of input token
- `amountIn` - Amount of input token
- `amountOut` - Amount of output token received
- `timestamp` - Block timestamp
- `blockNumber` - Block number
- `transactionHash` - Transaction hash

### Liquidity Events
- `id` - Unique identifier (transactionHash-logIndex)
- `poolId` - ID of the pool
- `provider` - Address of liquidity provider
- `amountA` - Amount of token A added
- `amountB` - Amount of token B added
- `liquidity` - Amount of liquidity tokens minted
- `timestamp` - Block timestamp
- `blockNumber` - Block number
- `transactionHash` - Transaction hash

## Setup & Running

1. **Install dependencies**:
```bash
pnpm install
```

2. **Configure environment**:
Edit `.env.local` to set your RPC URL (optional, uses public RPC by default):
```bash
PONDER_RPC_URL_57054=https://rpc.blaze.soniclabs.com
```

3. **Run in development mode**:
```bash
pnpm dev
```

4. **Access the API**:
- GraphQL Playground: http://localhost:42069/graphql
- API Endpoints: http://localhost:42069/api/*

## Testing with GraphQL Playground

1. **Access the playground**: Navigate to http://localhost:42069/graphql
2. **Copy any query from above** into the left panel
3. **Add variables** (if needed) in the Variables panel at bottom left
4. **Click the Play button** to execute the query
5. **View results** in the right panel

### Sample Data for Testing

Use these real values from your indexed data:

**Wallet Addresses:**
- `0xebfaca8463e1c3495a09684137fed7a4b4574179`
- `0xb34a4eaecb848d573a0410bc305787d5b69328b8`

**Token Addresses:**
- `0x6eb23ca35d4f467d0d2c326b1e23c8bfdf0688b4` (Example Token A)
- `0xec3a35b973e9cb9e735123a6e4ba1b3d237a9f7f` (Example Token B)
- `0xfd9bd8cfc9f6326a1496f240e83ff6717f960e20` (Example Token C)

**DEX Names:**
- `"1inch"` or `"OneInch"`
- `"Uniswap"`
- `"Curve"`
- `"Balancer"`

**Transaction Hashes:** (Use actual hashes from your data)
- Look for recent transactions in the GraphQL playground

**Timestamp Examples:**
- Last 24 hours: `"1734217200"`
- Last week: `"1733612400"`
- Custom timestamp: Use Unix timestamp converter

**Amount Examples:**
- Small amount: `"1000000000000000000"` (1 ETH in wei)
- Large amount: `"10000000000000000000"` (10 ETH in wei)

### Query Tips for Trading History

- **For transaction table view**: Use Query #1 (Complete Trading History)
- **For user-specific data**: Use Query #2 with wallet address
- **For DEX comparison**: Use Query #3 with timestamp filter
- **For high-value transactions**: Use Query #6 with minimum amount
- **For specific DEX analysis**: Use Query #7 with DEX name

All timestamps are in Unix epoch format and amounts are in wei (BigInt).

### GraphQL Query Tips

- Use `limit` to control how many results you get
- Use `orderBy` and `orderDirection` for sorting
- Use `where` clauses for filtering
- Timestamps are in Unix epoch format (BigInt)
- All amounts are in wei format (BigInt)
- Use GraphQL introspection (`Ctrl+Space`) to see available fields

## API Endpoints

### REST API
- `GET /api/pools` - List all pools
- `GET /api/pools/:poolId` - Get specific pool details
- `GET /api/swaps` - List recent swaps (with pagination)
- `GET /api/swaps/:poolId` - Get swaps for specific pool
- `GET /api/liquidity` - List recent liquidity events
- `GET /api/stats` - Get overall statistics

### GraphQL
Available at `/graphql` endpoint with full schema introspection.

#### Trading History & Transaction Queries

Access GraphQL Playground at: **http://localhost:42069/graphql**

##### 1. Complete Trading History (Transaction Table View)
```graphql
query GetTradingHistory($limit: Int = 100, $offset: Int = 0) {
  swaps(
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
    offset: $offset
  ) {
    items {
      id
      pool_id
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      block_number
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "limit": 50,
  "offset": 0
}
```

##### 2. User Trading History with DEX Breakdown
```graphql
query GetUserTradingHistory($walletAddress: String!, $limit: Int = 50) {
  swaps(
    where: { trader: $walletAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      id
      pool_id
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      block_number
      transaction_hash
      # Additional computed fields would go here
    }
  }
}
```
**Variables:**
```json
{
  "walletAddress": "0xebfaca8463e1c3495a09684137fed7a4b4574179",
  "limit": 100
}
```

##### 3. Multi-DEX Trading Comparison
```graphql
query GetMultiDEXTradingData($fromTimestamp: BigInt!, $limit: Int = 50) {
  oneInchSwaps: swaps(
    where: { 
      dex_name: "1inch",
      timestamp_gte: $fromTimestamp 
    }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      trader
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
      dex_name
    }
  }
  
  uniswapSwaps: swaps(
    where: { 
      dex_name: "Uniswap",
      timestamp_gte: $fromTimestamp 
    }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      trader
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
      dex_name
    }
  }
  
  curveSwaps: swaps(
    where: { 
      dex_name: "Curve",
      timestamp_gte: $fromTimestamp 
    }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      trader
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
      dex_name
    }
  }
  
  balancerSwaps: swaps(
    where: { 
      dex_name: "Balancer",
      timestamp_gte: $fromTimestamp 
    }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      trader
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
      dex_name
    }
  }
}
```
**Variables:**
```json
{
  "fromTimestamp": "1734217200",
  "limit": 25
}
```

##### 4. Trading Volume by DEX Aggregator
```graphql
query GetTradingVolumeByDEX($fromTimestamp: BigInt!) {
  swaps(
    where: { timestamp_gte: $fromTimestamp }
    orderBy: "amount_in"
    orderDirection: "desc"
  ) {
    items {
      dex_name
      amount_in
      amount_out
      timestamp
      trader
      token_in
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "fromTimestamp": "1734217200"
}
```

##### 5. Token Pair Trading Analysis
```graphql
query GetTokenPairTrading($tokenAddress: String!, $limit: Int = 100) {
  incomingTrades: swaps(
    where: { token_in: $tokenAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      trader
      dex_name
      amount_in
      amount_out
      timestamp
      transaction_hash
      pool_id
    }
  }
}
```
**Variables:**
```json
{
  "tokenAddress": "0x6eb23ca35d4f467d0d2c326b1e23c8bfdf0688b4",
  "limit": 50
}
```

##### 6. Recent High-Value Transactions
```graphql
query GetHighValueTransactions($minAmount: BigInt!, $limit: Int = 20) {
  swaps(
    where: { amount_in_gte: $minAmount }
    orderBy: "amount_in"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
      block_number
    }
  }
}
```
**Variables:**
```json
{
  "minAmount": "1000000000000000000",
  "limit": 30
}
```

##### 7. DEX Performance Analytics
```graphql
query GetDEXPerformance($dexName: String!, $fromTimestamp: BigInt!) {
  swaps(
    where: { 
      dex_name: $dexName,
      timestamp_gte: $fromTimestamp 
    }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    items {
      trader
      amount_in
      amount_out
      timestamp
      transaction_hash
    }
  }
  
  pools(where: { dex_name: $dexName }) {
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
```
**Variables:**
```json
{
  "dexName": "1inch",
  "fromTimestamp": "1734217200"
}
```

##### 8. Complete Transaction Details
```graphql
query GetTransactionDetails($transactionHash: String!) {
  swaps(where: { transaction_hash: $transactionHash }) {
    items {
      id
      pool_id
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      block_number
      transaction_hash
    }
  }
  
  liquidityEvents(where: { transaction_hash: $transactionHash }) {
    items {
      id
      pool_id
      provider
      amount_a
      amount_b
      liquidity
      timestamp
      block_number
    }
  }
}
```
**Variables:**
```json
{
  "transactionHash": "0x1234567890abcdef..."
}
```
      id
      pool_id
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      block_number
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "walletAddress": "0xebfaca8463e1c3495a09684137fed7a4b4574179"
}
```

##### 3. Get Recent Swaps (Last 24 Hours)
```graphql
query GetRecentSwaps($fromTimestamp: BigInt!) {
  swaps(
    where: { timestamp_gte: $fromTimestamp }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 100
  ) {
    items {
      id
      pool_id
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      block_number
      transaction_hash
    }
  }
}
```
**Variables (for last 24h):**
```json
{
  "fromTimestamp": "1734217200"
}
```

##### 4. Get Pool Details with Recent Activity
```graphql
query GetPoolDetails($poolId: String!) {
  pools(where: { id: $poolId }) {
    items {
      id
      token_a
      token_b
      creator
      dex_name
      reserve_a
      reserve_b
      total_supply
      created_at
      block_number
    }
  }
  swaps(
    where: { pool_id: $poolId }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 20
  ) {
    items {
      id
      trader
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
    }
  }
  liquidityEvents(
    where: { pool_id: $poolId }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 10
  ) {
    items {
      id
      provider
      amount_a
      amount_b
      liquidity
      timestamp
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "poolId": "0x083828c23a4a388c8cf5eaab6c3482f851cb59a931f33986a35de3c918cd6571"
}
```

##### 5. Get Top Traders by Volume
```graphql
query GetTopTraders {
  swaps(
    orderBy: "amount_in"
    orderDirection: "desc"
    limit: 50
  ) {
    items {
      trader
      amount_in
      amount_out
      token_in
      timestamp
      pool_id
      transaction_hash
    }
  }
}
```

##### 6. Get Liquidity Providers for a Pool
```graphql
query GetLiquidityProviders($poolId: String!) {
  liquidityEvents(
    where: { pool_id: $poolId }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 50
  ) {
    items {
      id
      provider
      amount_a
      amount_b
      liquidity
      timestamp
      block_number
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "poolId": "0x083828c23a4a388c8cf5eaab6c3482f851cb59a931f33986a35de3c918cd6571"
}
```

##### 7. Get Trading Activity by Token
```graphql
query GetTradingByToken($tokenAddress: String!) {
  swaps(
    where: { token_in: $tokenAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 100
  ) {
    items {
      id
      pool_id
      trader
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "tokenAddress": "0x6eb23ca35d4f467d0d2c326b1e23c8bfdf0688b4"
}
```

##### 8. Get Pool Analytics (Combined Data)
```graphql
query GetPoolAnalytics($poolId: String!, $fromTimestamp: BigInt!) {
  pools(where: { id: $poolId }) {
    items {
      id
      token_a
      token_b
      reserve_a
      reserve_b
      total_supply
      dex_name
    }
  }
  swaps: swaps(
    where: { 
      pool_id: $poolId,
      timestamp_gte: $fromTimestamp 
    }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    items {
      amount_in
      amount_out
      timestamp
      trader
    }
  }
  liquidityEvents: liquidityEvents(
    where: { 
      pool_id: $poolId,
      timestamp_gte: $fromTimestamp 
    }
  ) {
    items {
      amount_a
      amount_b
      liquidity
      timestamp
      provider
    }
  }
}
```
**Variables:**
```json
{
  "poolId": "0x083828c23a4a388c8cf5eaab6c3482f851cb59a931f33986a35de3c918cd6571",
  "fromTimestamp": "1734217200"
}
```

##### 9. Get Pools Created by User
```graphql
query GetPoolsByCreator($creatorAddress: String!) {
  pools(
    where: { creator: $creatorAddress }
    orderBy: "created_at"
    orderDirection: "desc"
  ) {
    items {
      id
      token_a
      token_b
      creator
      dex_name
      reserve_a
      reserve_b
      total_supply
      created_at
      block_number
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "creatorAddress": "0xb34a4eaecb848d573a0410bc305787d5b69328b8"
}
```

##### 10. Get User's Pool Creation History with Activity
```graphql
query GetUserPoolHistory($creatorAddress: String!) {
  pools(
    where: { creator: $creatorAddress }
    orderBy: "created_at"
    orderDirection: "desc"
  ) {
    items {
      id
      token_a
      token_b
      creator
      dex_name
      reserve_a
      reserve_b
      total_supply
      created_at
      block_number
      transaction_hash
    }
  }
  swaps(
    where: { trader: $creatorAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 20
  ) {
    items {
      id
      pool_id
      trader
      token_in
      amount_in
      amount_out
      timestamp
      transaction_hash
    }
  }
  liquidityEvents(
    where: { provider: $creatorAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 20
  ) {
    items {
      id
      pool_id
      provider
      amount_a
      amount_b
      liquidity
      timestamp
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "creatorAddress": "0xb34a4eaecb848d573a0410bc305787d5b69328b8"
}
```

##### 11. Get Pools by Token Pair
```graphql
query GetPoolsByTokenPair($tokenA: String!, $tokenB: String!) {
  pools(
    where: { 
      or: [
        { and: [{ token_a: $tokenA }, { token_b: $tokenB }] },
        { and: [{ token_a: $tokenB }, { token_b: $tokenA }] }
      ]
    }
    orderBy: "created_at"
    orderDirection: "desc"
  ) {
    items {
      id
      token_a
      token_b
      creator
      dex_name
      reserve_a
      reserve_b
      total_supply
      created_at
      block_number
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "tokenA": "0x6eb23ca35d4f467d0d2c326b1e23c8bfdf0688b4",
  "tokenB": "0xec3a35b973e9cb9e735123a6e4ba1b3d237a9f7f"
}
```

##### 12. Get Pools by DEX Name
```graphql
query GetPoolsByDEX($dexName: String!) {
  pools(
    where: { dex_name: $dexName }
    orderBy: "created_at"
    orderDirection: "desc"
  ) {
    items {
      id
      token_a
      token_b
      creator
      dex_name
      reserve_a
      reserve_b
      total_supply
      created_at
      block_number
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "dexName": "OneInch"
}
```

##### 13. Get Trading Activity by DEX
```graphql
query GetTradingByDEX($dexName: String!, $limit: Int = 50) {
  swaps(
    where: { dex_name: $dexName }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: $limit
  ) {
    items {
      id
      pool_id
      trader
      dex_name
      token_in
      amount_in
      amount_out
      timestamp
      block_number
      transaction_hash
    }
  }
}
```
**Variables:**
```json
{
  "dexName": "Curve",
  "limit": 100
}
```

##### 14. Get Multi-DEX Comparison
```graphql
query GetMultiDEXComparison {
  uniswapPools: pools(where: { dex_name: "Uniswap" }) {
    items {
      id
      dex_name
      total_supply
      created_at
    }
  }
  oneInchPools: pools(where: { dex_name: "OneInch" }) {
    items {
      id
      dex_name
      total_supply
      created_at
    }
  }
  curvePools: pools(where: { dex_name: "Curve" }) {
    items {
      id
      dex_name
      total_supply
      created_at
    }
  }
  balancerPools: pools(where: { dex_name: "Balancer" }) {
    items {
      id
      dex_name
      total_supply
      created_at
    }
  }
  recentSwaps: swaps(
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 20
  ) {
    items {
      dex_name
      amount_in
      amount_out
      timestamp
    }
  }
}
```

### SQL Interface
Available at `/sql` for direct database queries.

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm start` - Start production server
- `pnpm db` - Database management commands
- `pnpm codegen` - Generate types from schema
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

## Configuration

The main configuration is in `ponder.config.ts`:
- Network settings
- Contract address and ABI
- Starting block number (adjust for optimal sync time)

## Development

To modify the indexer:

1. **Update schema**: Edit `ponder.schema.ts` to add new tables
2. **Add event handlers**: Edit `src/index.ts` to handle new events
3. **Add API endpoints**: Edit `src/api/index.ts` for custom REST endpoints
4. **Update ABI**: Edit `abis/ExampleContractAbi.ts` for contract changes

## Production Deployment

For production deployment:

1. Set up a dedicated RPC URL with higher rate limits
2. Use PostgreSQL database (set DATABASE_URL environment variable)
3. Run `pnpm start` instead of `pnpm dev`
4. Consider using PM2 or similar for process management

## Notes

- The indexer starts from block 1 by default. Adjust `startBlock` in config for faster initial sync
- Uses public RPC by default - consider upgrading for production
- SQLite database used by default - consider PostgreSQL for production
