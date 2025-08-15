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

// NEW: Get swaps by DEX name and trader address (FIXED for your error)
app.get("/api/swaps/dex/:dexName/trader/:address", async (c) => {
  const dexName = c.req.param("dexName");
  const address = c.req.param("address");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const result = await db.execute(`
      SELECT 
        s.*,
        p.token_a,
        p.token_b,
        p.creator as pool_creator
      FROM swaps s
      LEFT JOIN pools p ON s.pool_id = p.id
      WHERE LOWER(s.dex_name) = LOWER('${dexName}') 
        AND s.trader = '${address}'
      ORDER BY s.timestamp DESC 
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Get statistics for this combination
    const stats = await db.execute(`
      SELECT 
        COUNT(*) as total_swaps,
        SUM(amount_in) as total_volume_in,
        SUM(amount_out) as total_volume_out,
        MIN(timestamp) as first_swap,
        MAX(timestamp) as last_swap,
        COUNT(DISTINCT pool_id) as unique_pools
      FROM swaps 
      WHERE LOWER(dex_name) = LOWER('${dexName}') 
        AND trader = '${address}'
    `);

    return c.json({
      swaps: result.rows,
      dex_name: dexName,
      trader: address,
      count: result.rows.length,
      limit: limit,
      offset: offset,
      statistics: stats.rows[0] || {},
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to fetch swaps for DEX and trader", 
      details: String(error) 
    }, 500);
  }
});

// NEW: Advanced swaps search with multiple filters
app.get("/api/swaps/search", async (c) => {
  const dexName = c.req.query("dex");
  const trader = c.req.query("trader");
  const poolId = c.req.query("pool_id");
  const tokenIn = c.req.query("token_in");
  const minAmount = c.req.query("min_amount");
  const maxAmount = c.req.query("max_amount");
  const fromDate = c.req.query("from_date");
  const toDate = c.req.query("to_date");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    let query = `
      SELECT 
        s.*,
        p.token_a,
        p.token_b,
        p.creator as pool_creator
      FROM swaps s
      LEFT JOIN pools p ON s.pool_id = p.id
      WHERE 1=1
    `;

    // Build dynamic query based on provided filters
    if (dexName) {
      query += ` AND LOWER(s.dex_name) = LOWER('${dexName}')`;
    }
    if (trader) {
      query += ` AND s.trader = '${trader}'`;
    }
    if (poolId) {
      query += ` AND s.pool_id = '${poolId}'`;
    }
    if (tokenIn) {
      query += ` AND s.token_in = '${tokenIn}'`;
    }
    if (minAmount) {
      query += ` AND s.amount_in >= ${minAmount}`;
    }
    if (maxAmount) {
      query += ` AND s.amount_in <= ${maxAmount}`;
    }
    if (fromDate) {
      query += ` AND s.timestamp >= ${fromDate}`;
    }
    if (toDate) {
      query += ` AND s.timestamp <= ${toDate}`;
    }

    query += ` ORDER BY s.timestamp DESC LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.execute(query);

    return c.json({
      swaps: result.rows,
      count: result.rows.length,
      filters: {
        dex: dexName || "all",
        trader: trader || "all",
        pool_id: poolId || "all",
        token_in: tokenIn || "all",
        min_amount: minAmount || null,
        max_amount: maxAmount || null,
        from_date: fromDate || null,
        to_date: toDate || null,
        limit: limit,
        offset: offset
      }
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to search swaps", 
      details: String(error) 
    }, 500);
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

// ===== QUERY 1: Transaction History dengan Filter DEX =====
app.get("/api/transactions/history", async (c) => {
  const dexFilter = c.req.query("dex"); // Optional: filter by specific DEX
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");
  const fromDate = c.req.query("from_date"); // Optional: timestamp filter
  const toDate = c.req.query("to_date"); // Optional: timestamp filter

  try {
    let query = `
      SELECT 
        s.id as transaction_id,
        s.transaction_hash,
        s.dex_name,
        s.trader,
        s.pool_id,
        s.token_in,
        s.amount_in,
        s.amount_out,
        s.timestamp,
        s.block_number,
        p.token_a,
        p.token_b,
        p.creator as pool_creator
      FROM swaps s
      LEFT JOIN pools p ON s.pool_id = p.id
      WHERE 1=1
    `;

    // Add DEX filter if provided
    if (dexFilter) {
      query += ` AND LOWER(s.dex_name) = LOWER('${dexFilter}')`;
    }

    // Add date filters if provided
    if (fromDate) {
      query += ` AND s.timestamp >= ${fromDate}`;
    }
    if (toDate) {
      query += ` AND s.timestamp <= ${toDate}`;
    }

    query += ` ORDER BY s.timestamp DESC LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.execute(query);

    // Get available DEX names for filtering
    const dexList = await db.execute(`
      SELECT DISTINCT dex_name, COUNT(*) as transaction_count 
      FROM swaps 
      GROUP BY dex_name 
      ORDER BY transaction_count DESC
    `);

    return c.json({
      transactions: result.rows,
      count: result.rows.length,
      filters: {
        dex: dexFilter || "all",
        from_date: fromDate || null,
        to_date: toDate || null,
        limit: limit,
        offset: offset
      },
      available_dex: dexList.rows,
      total_transactions: dexList.rows.reduce((sum: number, dex: any) => sum + parseInt(dex.transaction_count), 0)
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to fetch transaction history", 
      details: String(error) 
    }, 500);
  }
});

// ===== QUERY 2: Pool yang Tersedia dengan Filter DEX =====
app.get("/api/pools/available", async (c) => {
  const dexFilter = c.req.query("dex"); // Optional: filter by specific DEX
  const tokenFilter = c.req.query("token"); // Optional: filter by token address
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");
  const sortBy = c.req.query("sort_by") || "created_at"; // created_at, total_supply, dex_name

  try {
    let query = `
      SELECT 
        p.id as pool_id,
        p.token_a,
        p.token_b,
        p.creator,
        p.dex_name,
        p.reserve_a,
        p.reserve_b,
        p.total_supply,
        p.created_at,
        p.block_number,
        p.transaction_hash,
        COUNT(s.id) as total_swaps,
        COALESCE(SUM(s.amount_in), 0) as total_volume,
        COUNT(DISTINCT s.trader) as unique_traders,
        COUNT(l.id) as liquidity_events
      FROM pools p
      LEFT JOIN swaps s ON p.id = s.pool_id
      LEFT JOIN "liquidityEvents" l ON p.id = l.pool_id
      WHERE 1=1
    `;

    // Add DEX filter if provided
    if (dexFilter) {
      query += ` AND LOWER(p.dex_name) = LOWER('${dexFilter}')`;
    }

    // Add token filter if provided (search in both token_a and token_b)
    if (tokenFilter) {
      query += ` AND (LOWER(p.token_a) = LOWER('${tokenFilter}') OR LOWER(p.token_b) = LOWER('${tokenFilter}'))`;
    }

    query += ` GROUP BY p.id, p.token_a, p.token_b, p.creator, p.dex_name, p.reserve_a, p.reserve_b, p.total_supply, p.created_at, p.block_number, p.transaction_hash`;

    // Add sorting
    switch (sortBy) {
      case "volume":
        query += ` ORDER BY total_volume DESC`;
        break;
      case "swaps":
        query += ` ORDER BY total_swaps DESC`;
        break;
      case "dex_name":
        query += ` ORDER BY p.dex_name ASC, p.created_at DESC`;
        break;
      default:
        query += ` ORDER BY p.created_at DESC`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.execute(query);

    // Get available DEX names and their pool counts
    const dexStats = await db.execute(`
      SELECT 
        dex_name, 
        COUNT(*) as pool_count,
        SUM(reserve_a + reserve_b) as total_liquidity
      FROM pools 
      GROUP BY dex_name 
      ORDER BY pool_count DESC
    `);

    // Get available token addresses
    const tokenStats = await db.execute(`
      SELECT token_address, COUNT(*) as pool_count
      FROM (
        SELECT token_a as token_address FROM pools
        UNION ALL
        SELECT token_b as token_address FROM pools
      ) as all_tokens
      GROUP BY token_address
      ORDER BY pool_count DESC
      LIMIT 20
    `);

    return c.json({
      pools: result.rows,
      count: result.rows.length,
      filters: {
        dex: dexFilter || "all",
        token: tokenFilter || "all",
        sort_by: sortBy,
        limit: limit,
        offset: offset
      },
      available_dex: dexStats.rows,
      popular_tokens: tokenStats.rows
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to fetch available pools", 
      details: String(error) 
    }, 500);
  }
});

// ===== QUERY 3: Pool yang Dibuat oleh Creator Address Tertentu =====
app.get("/api/pools/by-creator/:address", async (c) => {
  const creatorAddress = c.req.param("address");
  const dexFilter = c.req.query("dex"); // Optional: filter by specific DEX
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");
  const includeStats = c.req.query("include_stats") === "true";

  try {
    let query = `
      SELECT 
        p.id as pool_id,
        p.token_a,
        p.token_b,
        p.creator,
        p.dex_name,
        p.reserve_a,
        p.reserve_b,
        p.total_supply,
        p.created_at,
        p.block_number,
        p.transaction_hash
    `;

    if (includeStats) {
      query += `,
        COUNT(s.id) as total_swaps,
        COALESCE(SUM(s.amount_in), 0) as total_volume,
        COUNT(DISTINCT s.trader) as unique_traders,
        COUNT(l.id) as liquidity_events,
        MAX(s.timestamp) as last_swap_time
      `;
    }

    query += `
      FROM pools p
    `;

    if (includeStats) {
      query += `
        LEFT JOIN swaps s ON p.id = s.pool_id
        LEFT JOIN "liquidityEvents" l ON p.id = l.pool_id
      `;
    }

    query += ` WHERE p.creator = '${creatorAddress}'`;

    // Add DEX filter if provided
    if (dexFilter) {
      query += ` AND LOWER(p.dex_name) = LOWER('${dexFilter}')`;
    }

    if (includeStats) {
      query += ` GROUP BY p.id, p.token_a, p.token_b, p.creator, p.dex_name, p.reserve_a, p.reserve_b, p.total_supply, p.created_at, p.block_number, p.transaction_hash`;
    }

    query += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.execute(query);

    // Get creator statistics
    const creatorStats = await db.execute(`
      SELECT 
        p.dex_name,
        COUNT(*) as pools_created,
        SUM(p.reserve_a + p.reserve_b) as total_liquidity_provided,
        MIN(p.created_at) as first_pool_created,
        MAX(p.created_at) as last_pool_created
      FROM pools p
      WHERE p.creator = '${creatorAddress}'
      GROUP BY p.dex_name
      ORDER BY pools_created DESC
    `);

    // Get overall creator summary
    const creatorSummary = await db.execute(`
      SELECT 
        COUNT(*) as total_pools_created,
        COUNT(DISTINCT p.dex_name) as dex_platforms_used,
        SUM(p.reserve_a + p.reserve_b) as total_liquidity,
        MIN(p.created_at) as account_first_activity,
        MAX(p.created_at) as account_last_activity
      FROM pools p
      WHERE p.creator = '${creatorAddress}'
    `);

    return c.json({
      creator_address: creatorAddress,
      pools: result.rows,
      count: result.rows.length,
      filters: {
        dex: dexFilter || "all",
        include_stats: includeStats,
        limit: limit,
        offset: offset
      },
      creator_stats: {
        summary: creatorSummary.rows[0] || {},
        by_dex: creatorStats.rows
      }
    });
  } catch (error) {
    return c.json({ 
      error: "Failed to fetch pools by creator", 
      details: String(error) 
    }, 500);
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
