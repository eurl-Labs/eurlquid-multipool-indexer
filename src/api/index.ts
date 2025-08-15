import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

try {
  app.use("/", graphql({ db, schema }));
  app.use("/graphql", graphql({ db, schema }));
} catch (error) {
  console.log("GraphQL setup failed, using REST only");
}
app.get("/api/pools", async (c) => {
  try {
    const result = await db.execute(
      `SELECT * FROM pools ORDER BY "blockNumber" DESC`
    );
    return c.json(result.rows);
  } catch (error) {
    const result = await db.execute(`SELECT * FROM pools`);
    return c.json(result.rows);
  }
});
app.get("/api/pools/:poolId", async (c) => {
  const poolId = c.req.param("poolId");
  const result = await db.execute(`SELECT * FROM pools WHERE id = '${poolId}'`);

  if (result.rows.length === 0) {
    return c.json({ error: "Pool not found" }, 404);
  }

  return c.json(result.rows[0]);
});

// New endpoint: Get pools by token addresses
app.get("/api/pools/tokens/:tokenA/:tokenB", async (c) => {
  const tokenA = c.req.param("tokenA");
  const tokenB = c.req.param("tokenB");

  try {
    // Search for pool with either tokenA/tokenB order
    const result = await db.execute(`
      SELECT * FROM pools 
      WHERE ("tokenA" = '${tokenA}' AND "tokenB" = '${tokenB}') 
         OR ("tokenA" = '${tokenB}' AND "tokenB" = '${tokenA}')
      ORDER BY "createdAt" DESC
    `);

    return c.json({
      pools: result.rows,
      tokenA: tokenA,
      tokenB: tokenB,
      count: result.rows.length,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch pools for token pair" }, 500);
  }
});

// New endpoint: Get latest created pools
app.get("/api/pools/latest/:count?", async (c) => {
  const count = parseInt(c.req.param("count") || "10");

  try {
    const result = await db.execute(`
      SELECT * FROM pools 
      ORDER BY "created_at" DESC 
      LIMIT ${count}
    `);

    return c.json({
      pools: result.rows,
      count: result.rows.length,
      requested: count,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch latest pools" }, 500);
  }
});

// New endpoint: Get pools by DEX name
app.get("/api/pools/dex/:dexName", async (c) => {
  const dexName = c.req.param("dexName");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(`
      SELECT * FROM pools 
      WHERE LOWER("dex_name") = LOWER('${dexName}') 
      ORDER BY "created_at" DESC 
      LIMIT ${limit} OFFSET ${offset}
    `);

    return c.json({
      pools: result.rows,
      dex: dexName,
      count: result.rows.length,
      limit: limit,
      offset: offset,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch pools by DEX name", details: String(error) }, 500);
  }
});

// New endpoint: Get swaps by DEX name
app.get("/api/swaps/dex/:dexName", async (c) => {
  const dexName = c.req.param("dexName");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(`
      SELECT * FROM swaps 
      WHERE LOWER("dex_name") = LOWER('${dexName}') 
      ORDER BY "timestamp" DESC 
      LIMIT ${limit} OFFSET ${offset}
    `);

    return c.json({
      swaps: result.rows,
      dex: dexName,
      count: result.rows.length,
      limit: limit,
      offset: offset,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch swaps by DEX name", details: String(error) }, 500);
  }
});

// New endpoint: Get DEX statistics
app.get("/api/stats/dex", async (c) => {
  try {
    const poolsByDex = await db.execute(`
      SELECT "dex_name", COUNT(*) as pool_count 
      FROM pools 
      GROUP BY "dex_name" 
      ORDER BY pool_count DESC
    `);
    
    const swapsByDex = await db.execute(`
      SELECT "dex_name", COUNT(*) as swap_count, SUM("amount_in") as total_volume
      FROM swaps 
      GROUP BY "dex_name" 
      ORDER BY swap_count DESC
    `);

    return c.json({
      poolsByDex: poolsByDex.rows,
      swapsByDex: swapsByDex.rows,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch DEX statistics", details: String(error) }, 500);
  }
});

// New endpoint: Get pools created by specific address
app.get("/api/pools/creator/:address", async (c) => {
  const address = c.req.param("address");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(`
      SELECT * FROM pools 
      WHERE "creator" = '${address}' 
      ORDER BY "created_at" DESC 
      LIMIT ${limit} OFFSET ${offset}
    `);

    return c.json({
      pools: result.rows,
      creator: address,
      count: result.rows.length,
      limit: limit,
      offset: offset,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch pools created by address", details: String(error) }, 500);
  }
});
app.get("/api/swaps", async (c) => {
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(
      `SELECT * FROM swaps ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`
    );
    return c.json(result.rows);
  } catch (error) {
    const result = await db.execute(
      `SELECT * FROM swaps LIMIT ${limit} OFFSET ${offset}`
    );
    return c.json(result.rows);
  }
});

app.get("/api/swaps/:poolId", async (c) => {
  const poolId = c.req.param("poolId");
  const limit = parseInt(c.req.query("limit") || "100");

  try {
    const result = await db.execute(
      `SELECT * FROM swaps WHERE "poolId" = '${poolId}' ORDER BY "timestamp" DESC LIMIT ${limit}`
    );
    return c.json(result.rows);
  } catch (error) {
    const result = await db.execute(
      `SELECT * FROM swaps WHERE id LIKE '%${poolId}%' LIMIT ${limit}`
    );
    return c.json(result.rows);
  }
});

// New endpoint: Get swaps by trader address
app.get("/api/swaps/trader/:address", async (c) => {
  const address = c.req.param("address");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(
      `SELECT * FROM swaps WHERE "trader" = '${address}' ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`
    );
    return c.json({
      swaps: result.rows,
      trader: address,
      count: result.rows.length,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch swaps for trader" }, 500);
  }
});

// New endpoint: Get liquidity events by provider address
app.get("/api/liquidity/provider/:address", async (c) => {
  const address = c.req.param("address");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(
      `SELECT * FROM "liquidityEvents" WHERE "provider" = '${address}' ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`
    );
    return c.json({
      liquidityEvents: result.rows,
      provider: address,
      count: result.rows.length,
    });
  } catch (error) {
    return c.json(
      { error: "Failed to fetch liquidity events for provider" },
      500
    );
  }
});

app.get("/api/liquidity", async (c) => {
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(
      `SELECT * FROM "liquidityEvents" ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`
    );
    return c.json(result.rows);
  } catch (error) {
    const result = await db.execute(
      `SELECT * FROM "liquidityEvents" LIMIT ${limit} OFFSET ${offset}`
    );
    return c.json(result.rows);
  }
});

app.get("/api/stats", async (c) => {
  const poolsCount = await db.execute(`SELECT COUNT(*) as count FROM pools`);
  const swapsCount = await db.execute(`SELECT COUNT(*) as count FROM swaps`);
  const liquidityCount = await db.execute(
    `SELECT COUNT(*) as count FROM "liquidityEvents"`
  );

  return c.json({
    totalPools: parseInt(poolsCount.rows[0].count),
    totalSwaps: parseInt(swapsCount.rows[0].count),
    totalLiquidityEvents: parseInt(liquidityCount.rows[0].count),
  });
});

app.get("/api/debug/tables", async (c) => {
  try {
    const poolsSchema = await db.execute(`PRAGMA table_info(pools)`);
    const swapsSchema = await db.execute(`PRAGMA table_info(swaps)`);
    const liquiditySchema = await db.execute(
      `PRAGMA table_info("liquidityEvents")`
    );

    return c.json({
      pools: poolsSchema.rows,
      swaps: swapsSchema.rows,
      liquidityEvents: liquiditySchema.rows,
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Special endpoint for testing specific address
app.get("/api/test/address/:address", async (c) => {
  const address = c.req.param("address");

  try {
    // Check swaps
    const swaps = await db.execute(
      `SELECT * FROM swaps WHERE "trader" = '${address}' ORDER BY "timestamp" DESC`
    );

    // Check liquidity events
    const liquidity = await db.execute(
      `SELECT * FROM "liquidityEvents" WHERE "provider" = '${address}' ORDER BY "timestamp" DESC`
    );

    // Check pools created by this address
    const poolsCreated = await db.execute(
      `SELECT * FROM pools WHERE "creator" = '${address}' ORDER BY "created_at" DESC`
    );

    // Get DEX usage stats for this address
    const dexUsage = await db.execute(`
      SELECT "dex_name", COUNT(*) as usage_count 
      FROM (
        SELECT "dex_name" FROM swaps WHERE "trader" = '${address}'
        UNION ALL
        SELECT "dex_name" FROM pools WHERE "creator" = '${address}'
      ) as combined
      GROUP BY "dex_name"
      ORDER BY usage_count DESC
    `);

    // Get summary
    const summary = {
      address: address,
      totalSwaps: swaps.rows.length,
      totalLiquidityEvents: liquidity.rows.length,
      totalPoolsCreated: poolsCreated.rows.length,
      preferredDEX: dexUsage.rows[0]?.dex_name || "N/A",
      dexUsageStats: dexUsage.rows,
      latestSwap: swaps.rows[0] || null,
      latestLiquidityEvent: liquidity.rows[0] || null,
      latestPoolCreated: poolsCreated.rows[0] || null,
    };

    return c.json({
      summary,
      swaps: swaps.rows,
      liquidityEvents: liquidity.rows,
      poolsCreated: poolsCreated.rows,
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default app;
