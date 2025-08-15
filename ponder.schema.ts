import { onchainTable } from "ponder";

export const pools = onchainTable("pools", (t) => ({
  id: t.hex().primaryKey(),
  token_a: t.hex().notNull(),
  token_b: t.hex().notNull(),
  creator: t.hex().notNull(),
  dex_name: t.text().notNull().default("Uniswap"), // DEX aggregator name
  reserve_a: t.bigint().notNull(),
  reserve_b: t.bigint().notNull(),
  total_supply: t.bigint().notNull(),
  created_at: t.bigint().notNull(),
  block_number: t.bigint().notNull(),
  transaction_hash: t.hex().notNull(),
}));

export const swaps = onchainTable("swaps", (t) => ({
  id: t.text().primaryKey(),
  pool_id: t.hex().notNull(),
  trader: t.hex().notNull(),
  dex_name: t.text().notNull().default("Uniswap"), // DEX aggregator name
  token_in: t.hex().notNull(),
  amount_in: t.bigint().notNull(),
  amount_out: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  block_number: t.bigint().notNull(),
  transaction_hash: t.hex().notNull(),
}));

export const liquidityEvents = onchainTable("liquidityEvents", (t) => ({
  id: t.text().primaryKey(), // transactionHash-logIndex
  pool_id: t.hex().notNull(),
  provider: t.hex().notNull(),
  amount_a: t.bigint().notNull(),
  amount_b: t.bigint().notNull(),
  liquidity: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  block_number: t.bigint().notNull(),
  transaction_hash: t.hex().notNull(),
}));
