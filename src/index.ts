import { ponder } from "ponder:registry";
import { pools, swaps, liquidityEvents } from "ponder:schema";

// Handle PoolCreated events
ponder.on("SwapContract:PoolCreated", async ({ event, context }) => {
  await context.db.insert(pools).values({
    id: event.args.poolId,
    token_a: event.args.tokenA,
    token_b: event.args.tokenB,
    creator: event.transaction.from,
    dex_name: "Uniswap", // Set nama DEX aggregator
    reserve_a: 0n,
    reserve_b: 0n,
    total_supply: 0n,
    created_at: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

// Handle Swap events
ponder.on("SwapContract:Swap", async ({ event, context }) => {
  const { poolId, trader, tokenIn, amountIn, amountOut } = event.args;
  
  // Create swap record
  await context.db.insert(swaps).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: poolId,
    trader: trader,
    dex_name: "Uniswap", // Set nama DEX aggregator
    token_in: tokenIn,
    amount_in: amountIn,
    amount_out: amountOut,
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

// Handle LiquidityAdded events
ponder.on("SwapContract:LiquidityAdded", async ({ event, context }) => {
  const { poolId, provider, amountA, amountB, liquidity } = event.args;
  
  // Create liquidity event record
  await context.db.insert(liquidityEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: poolId,
    provider: provider,
    amount_a: amountA,
    amount_b: amountB,
    liquidity: liquidity,
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});
