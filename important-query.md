# 📋 Important Queries - GraphQL & REST API

## 🔗 Server Endpoints
- **GraphQL Playground:** `http://localhost:42069/graphql`
- **REST API Base:** `http://localhost:42069/api`

---

## 1. Get Pools Created by User

### GraphQL Query:
```graphql
query GetPoolsByCreator($creatorAddress: String!) {
  poolss(
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
  "creatorAddress": "0xebFACa8463E1c3495a09684137fEd7A4b4574179"
}
```

### 🌐 REST API Alternative:
```bash
# Basic query
curl "http://localhost:42069/api/pools/by-creator/0xebFACa8463E1c3495a09684137fEd7A4b4574179"

# With statistics
curl "http://localhost:42069/api/pools/by-creator/0xebFACa8463E1c3495a09684137fEd7A4b4574179?include_stats=true"

# Filter by DEX
curl "http://localhost:42069/api/pools/by-creator/0xebFACa8463E1c3495a09684137fEd7A4b4574179?dex=Curve&include_stats=true"
```

---

## 2. Get Pools by DEX Name

### GraphQL Query:
```graphql
query GetPoolsByDEX($dexName: String!) {
  poolss(
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
  "dexName": "Curve"
}
```

### 🌐 REST API Alternative:
```bash
# Pools by DEX with full stats
curl "http://localhost:42069/api/pools/available?dex=Curve&limit=20"

# Sort by volume
curl "http://localhost:42069/api/pools/available?dex=Balancer&sort_by=volume&limit=10"

# Sort by swap activity
curl "http://localhost:42069/api/pools/available?dex=Uniswap&sort_by=swaps"
```

---

## 3. User Trading History with DEX Breakdown

### GraphQL Query:
```graphql
query GetUserTradingHistory($walletAddress: String!, $limit: Int = 50) {
  swapss(
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
      token_out
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
  "walletAddress": "0xebfaca8463e1c3495a09684137fed7a4b4574179",
  "limit": 100
}
```

### 🌐 REST API Alternative:
```bash
# All swaps by trader
curl "http://localhost:42069/api/swaps/trader/0xebfaca8463e1c3495a09684137fed7a4b4574179"

# With pagination
curl "http://localhost:42069/api/swaps/trader/0xebfaca8463e1c3495a09684137fed7a4b4574179?limit=50&offset=0"

# Complete transaction history with DEX breakdown
curl "http://localhost:42069/api/transactions/history?limit=100"
```

---

## 4. Get Trading Swap Activity by DEX

### GraphQL Query:
```graphql
query GetTradingByDEX($dexName: String!, $limit: Int = 50) {
  swapss(
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
      token_out
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
  "dexName": "Uniswap",
  "limit": 100
}
```

### 🌐 REST API Alternative:
```bash
# Swaps by DEX
curl "http://localhost:42069/api/swaps/dex/Uniswap?limit=100"

# Transaction history with DEX filter
curl "http://localhost:42069/api/transactions/history?dex=Uniswap&limit=50"

# Advanced search by DEX
curl "http://localhost:42069/api/swaps/search?dex=Curve&limit=25"
```

---

## 5. Get Trading Swap by DEX Name + Wallet Address (FIXED) ⭐

### GraphQL Query:
```graphql
query GetTradingByDEXAndTrader($dexName: String!, $trader: String!, $limit: Int = 50) {
  swapss(
    where: { 
      dex_name: $dexName,
      trader: $trader
    }
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
      token_out
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
  "dexName": "Uniswap",
  "trader": "0xebFACa8463E1c3495a09684137fEd7A4b4574179",
  "limit": 100
}
```

### 🌐 REST API Alternative (RECOMMENDED):
```bash
# NEW: Specific endpoint for DEX + Trader combination
curl "http://localhost:42069/api/swaps/dex/Uniswap/trader/0xebFACa8463E1c3495a09684137fEd7A4b4574179"

# With pagination
curl "http://localhost:42069/api/swaps/dex/Curve/trader/0xebFACa8463E1c3495a09684137fEd7A4b4574179?limit=50&offset=0"

# Advanced search with both filters
curl "http://localhost:42069/api/swaps/search?dex=Balancer&trader=0xebFACa8463E1c3495a09684137fEd7A4b4574179"
```

---

## 6. Get All Trading Data with Optional Filters

### GraphQL Query:
```graphql
query GetAllTradingData($dexName: String, $trader: String, $limit: Int = 50) {
  swapss(
    where: { 
      dex_name: $dexName,
      trader: $trader
    }
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
      token_out
      amount_in
      amount_out
      timestamp
      block_number
      transaction_hash
    }
  }
}
```
**Variables (bisa kosong untuk optional):**
```json
{
  "dexName": "Uniswap",
  "trader": "0xebFACa8463E1c3495a09684137fEd7A4b4574179",
  "limit": 50
}
```

### 🌐 REST API Alternative:
```bash
# Flexible search with multiple optional filters
curl "http://localhost:42069/api/swaps/search?dex=OneInch&trader=0xebFACa8463E1c3495a09684137fEd7A4b4574179&limit=50"

# Filter by amount range
curl "http://localhost:42069/api/swaps/search?min_amount=1000000000000000000&max_amount=10000000000000000000"

# Filter by date range
curl "http://localhost:42069/api/swaps/search?from_date=1672531200&to_date=1672617600"

# Combine multiple filters
curl "http://localhost:42069/api/swaps/search?dex=Curve&min_amount=5000000000000000000&limit=20"
```

---

## 🚀 Quick Reference - Common API Endpoints

### 📊 Statistics & Overview:
```bash
# Overall statistics
curl "http://localhost:42069/api/stats"

# DEX comparison stats
curl "http://localhost:42069/api/stats/dex"

# Debug table schema
curl "http://localhost:42069/api/debug/tables"
```

### 🏊‍♂️ Pool Queries:
```bash
# All pools with stats
curl "http://localhost:42069/api/pools/available?sort_by=volume&limit=20"

# Latest created pools
curl "http://localhost:42069/api/pools/latest/10"

# Pools for specific token pair
curl "http://localhost:42069/api/pools/tokens/0xtoken1/0xtoken2"
```

### 💱 Swap Queries:
```bash
# All recent swaps
curl "http://localhost:42069/api/swaps?limit=50"

# Swaps for specific pool
curl "http://localhost:42069/api/swaps/0xpoolId"

# Complex search
curl "http://localhost:42069/api/swaps/search?dex=Uniswap&min_amount=1000000000000000000"
```

### 💧 Liquidity Queries:
```bash
# All liquidity events
curl "http://localhost:42069/api/liquidity?limit=50"

# Liquidity by provider
curl "http://localhost:42069/api/liquidity/provider/0xproviderAddress"
```

---

## 🔧 Testing Your Specific Case

Untuk error yang Anda alami dengan DEX + wallet address, gunakan:

```bash
# Method 1: Dedicated endpoint (RECOMMENDED)
curl "http://localhost:42069/api/swaps/dex/Uniswap/trader/0xebFACa8463E1c3495a09684137fEd7A4b4574179"

# Method 2: Search endpoint
curl "http://localhost:42069/api/swaps/search?dex=Uniswap&trader=0xebFACa8463E1c3495a09684137fEd7A4b4574179"

# Method 3: Transaction history with filters
curl "http://localhost:42069/api/transactions/history?dex=Uniswap&limit=100"
```
```graphql
query GetPoolsByCreator($creatorAddress: String!) {
  poolss(
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
  "creatorAddress": "0xebFACa8463E1c3495a09684137fEd7A4b4574179"
}
```

2. Get Pools by DEX Name
```graphql
query GetPoolsByDEX($dexName: String!) {
  poolss(
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
  "dexName": "Curve"
}
```
3. User Trading History with DEX Breakdown
```graphql
query GetUserTradingHistory($walletAddress: String!, $limit: Int = 50) {
  swapss(
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
4. Get Trading Swap Activity by DEX
```graphql
query GetTradingByDEX($dexName: String!, $limit: Int = 50) {
  swapss(
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
  "dexName": "Uniswap",
  "limit": 100
}
```

5. Get Trading Swap by DEX Name + Wallet Address (FIXED)
```graphql
query GetTradingByDEXAndTrader($dexName: String!, $trader: String!, $limit: Int = 50) {
  swapss(
    where: { 
      dex_name: $dexName,
      trader: $trader
    }
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
  "dexName": "Uniswap",
  "trader": "0xebFACa8463E1c3495a09684137fEd7A4b4574179",
  "limit": 100
}
```

6. Get All Trading Data with Optional Filters
```graphql
query GetAllTradingData($dexName: String, $trader: String, $limit: Int = 50) {
  swapss(
    where: { 
      dex_name: $dexName,
      trader: $trader
    }
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
**Variables (bisa kosong untuk optional):**
```json
{
  "dexName": "Uniswap",
  "trader": "0xebFACa8463E1c3495a09684137fEd7A4b4574179",
  "limit": 50
}
```