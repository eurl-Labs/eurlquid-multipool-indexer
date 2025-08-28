import { ponder } from "ponder:registry";
import { pools, swaps, liquidityEvents } from "ponder:schema";

// Handle PoolCreated events
ponder.on("SwapContract:PoolCreated", async ({ event, context }) => {
  await context.db.insert(pools).values({
    id: `Uniswap:${event.args.poolId}`,
    pool_id: event.args.poolId,
    dex_name: "Uniswap",
    token_a: event.args.tokenA,
    token_b: event.args.tokenB,
    creator: event.transaction.from,
    reserve_a: 0n,
    reserve_b: 0n,
    total_supply: 0n,
    created_at: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

// Handle Swap events
ponder.on("SwapContract:Swapped", async ({ event, context }) => {
  const { poolId, user, tokenIn, tokenOut, amountIn, amountOut } = event.args;

  await context.db.insert(swaps).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `Uniswap:${poolId}`,
    trader: user, // dari ABI: 'user'
    dex_name: "Uniswap",
    token_in: tokenIn,
    token_out: tokenOut, // sudah ada di ABI, tak perlu hitung dari pool
    amount_in: amountIn,
    amount_out: amountOut,
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

// Handle LiquidityAdded events
ponder.on("SwapContract:LiquidityAdded", async ({ event, context }) => {
  const { poolId, amountA, amountB } = event.args;

  await context.db.insert(liquidityEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `Uniswap:${poolId}`,
    provider: event.transaction.from, // sintetis
    amount_a: amountA,
    amount_b: amountB,
    liquidity: amountA + amountB, // atau null / hapus kolom jika tak perlu
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

// ===== ONEINCH CONTRACT HANDLERS =====
ponder.on("OneInchContract:PoolCreated", async ({ event, context }) => {
  await context.db.insert(pools).values({
    id: `OneInch:${event.args.poolId}`,
    pool_id: event.args.poolId,
    dex_name: "OneInch",
    token_a: event.args.tokenA,
    token_b: event.args.tokenB,
    creator: event.transaction.from,
    reserve_a: 0n,
    reserve_b: 0n,
    total_supply: 0n,
    created_at: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

ponder.on("OneInchContract:Swapped", async ({ event, context }) => {
  const { poolId, user, tokenIn, tokenOut, amountIn, amountOut } = event.args;

  await context.db.insert(swaps).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `OneInch:${poolId}`,
    trader: user, // dari ABI: 'user'
    dex_name: "OneInch",
    token_in: tokenIn,
    token_out: tokenOut, // sudah ada di ABI, tak perlu hitung dari pool
    amount_in: amountIn,
    amount_out: amountOut,
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

ponder.on("OneInchContract:LiquidityAdded", async ({ event, context }) => {
  const { poolId, amountA, amountB } = event.args;

  await context.db.insert(liquidityEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `OneInch:${poolId}`,
    provider: event.transaction.from, // sintetis
    amount_a: amountA,
    amount_b: amountB,
    liquidity: amountA + amountB, // atau null / hapus kolom jika tak perlu
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

// ===== CURVE CONTRACT HANDLERS =====
ponder.on("CurveContract:PoolCreated", async ({ event, context }) => {
  await context.db.insert(pools).values({
    id: `Curve:${event.args.poolId}`,
    pool_id: event.args.poolId,
    dex_name: "Curve",
    token_a: event.args.tokenA,
    token_b: event.args.tokenB,
    creator: event.transaction.from,
    reserve_a: 0n,
    reserve_b: 0n,
    total_supply: 0n,
    created_at: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

ponder.on("CurveContract:Swapped", async ({ event, context }) => {
  const { poolId, user, tokenIn, tokenOut, amountIn, amountOut } = event.args;

  await context.db.insert(swaps).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `Curve:${poolId}`,
    trader: user, // dari ABI: 'user'
    dex_name: "Curve",
    token_in: tokenIn,
    token_out: tokenOut, // sudah ada di ABI, tak perlu hitung dari pool
    amount_in: amountIn,
    amount_out: amountOut,
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

ponder.on("CurveContract:LiquidityAdded", async ({ event, context }) => {
  const { poolId, amountA, amountB } = event.args;

  await context.db.insert(liquidityEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `Curve:${poolId}`,
    provider: event.transaction.from, // sintetis
    amount_a: amountA,
    amount_b: amountB,
    liquidity: amountA + amountB, // atau null / hapus kolom jika tak perlu
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

// ===== BALANCER CONTRACT HANDLERS =====
ponder.on("BalancerContract:PoolCreated", async ({ event, context }) => {
  await context.db.insert(pools).values({
    id: `Balancer:${event.args.poolId}`,
    pool_id: event.args.poolId,
    dex_name: "Balancer",
    token_a: event.args.tokenA,
    token_b: event.args.tokenB,
    creator: event.transaction.from,
    reserve_a: 0n,
    reserve_b: 0n,
    total_supply: 0n,
    created_at: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

ponder.on("BalancerContract:Swapped", async ({ event, context }) => {
  const { poolId, user, tokenIn, tokenOut, amountIn, amountOut } = event.args;

  await context.db.insert(swaps).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `Balancer:${poolId}`,
    trader: user, // dari ABI: 'user'
    dex_name: "Balancer",
    token_in: tokenIn,
    token_out: tokenOut, // sudah ada di ABI, tak perlu hitung dari pool
    amount_in: amountIn,
    amount_out: amountOut,
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});

ponder.on("BalancerContract:LiquidityAdded", async ({ event, context }) => {
  const { poolId, amountA, amountB } = event.args;

  await context.db.insert(liquidityEvents).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    pool_id: `Balancer:${poolId}`,
    provider: event.transaction.from, // sintetis
    amount_a: amountA,
    amount_b: amountB,
    liquidity: amountA + amountB, // atau null / hapus kolom jika tak perlu
    timestamp: BigInt(event.block.timestamp),
    block_number: BigInt(event.block.number),
    transaction_hash: event.transaction.hash,
  });
});