# Eurlquid Swap Indexer

An indexer for the Eurlquid Swap smart contract on Sonic Blaze Testnet using Ponder.

## Contract Details

- **Network**: Sonic Blaze Testnet (Chain ID: 57054)
- **Contract Address**: `0xAF3097d87b080F681d8F134FBc649d87A5F84500`
- **RPC URL**: https://rpc.blaze.soniclabs.com

## Features

This indexer tracks the following events from the swap contract:

1. **PoolCreated** - When new liquidity pools are created
2. **Swap** - When token swaps occur
3. **LiquidityAdded** - When liquidity is added to pools

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
