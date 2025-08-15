# API Endpoints Dokumentasi

## Ketiga Query API yang Diminta

### 1. 📈 Transaction History dengan Filter DEX

**Endpoint:** `GET /api/transactions/history`

**Deskripsi:** Mendapatkan riwayat transaksi (swap) dari berbagai DEX dengan kemampuan filter berdasarkan nama DEX, tanggal, dan pagination.

**Query Parameters:**
- `dex` (optional): Filter berdasarkan nama DEX (contoh: "Uniswap", "OneInch", "Curve", "Balancer")
- `limit` (optional): Jumlah maksimal data yang diambil (default: 100)
- `offset` (optional): Offset untuk pagination (default: 0)
- `from_date` (optional): Filter transaksi dari timestamp tertentu
- `to_date` (optional): Filter transaksi sampai timestamp tertentu

**Contoh Penggunaan:**
```bash
# Semua transaksi
curl "http://localhost:42069/api/transactions/history?limit=5"

# Filter berdasarkan DEX Uniswap
curl "http://localhost:42069/api/transactions/history?dex=Uniswap&limit=10"

# Filter berdasarkan DEX dan tanggal
curl "http://localhost:42069/api/transactions/history?dex=Curve&from_date=1672531200&limit=20"
```

**Response JSON:**
```json
{
  "transactions": [
    {
      "transaction_id": "string",
      "transaction_hash": "0x...",
      "dex_name": "Uniswap",
      "trader": "0x...",
      "pool_id": "0x...",
      "token_in": "0x...",
      "amount_in": "1000000000000000000",
      "amount_out": "2000000000000000000",
      "timestamp": 1672531200,
      "block_number": 12345678,
      "token_a": "0x...",
      "token_b": "0x...",
      "pool_creator": "0x..."
    }
  ],
  "count": 5,
  "filters": {
    "dex": "Uniswap",
    "from_date": null,
    "to_date": null,
    "limit": 5,
    "offset": 0
  },
  "available_dex": [
    {
      "dex_name": "Uniswap",
      "transaction_count": "15"
    },
    {
      "dex_name": "Curve", 
      "transaction_count": "8"
    }
  ],
  "total_transactions": 23
}
```

---

### 2. 🏊 Pool yang Tersedia dengan Filter DEX

**Endpoint:** `GET /api/pools/available`

**Deskripsi:** Mendapatkan daftar pool yang tersedia dari berbagai DEX dengan filter berdasarkan nama DEX, token address, dan sorting options.

**Query Parameters:**
- `dex` (optional): Filter berdasarkan nama DEX
- `token` (optional): Filter pool yang mengandung token address tertentu
- `limit` (optional): Jumlah maksimal data (default: 100)
- `offset` (optional): Offset untuk pagination (default: 0)
- `sort_by` (optional): Sorting criteria ("created_at", "volume", "swaps", "dex_name") (default: "created_at")

**Contoh Penggunaan:**
```bash
# Semua pool
curl "http://localhost:42069/api/pools/available?limit=5"

# Filter berdasarkan DEX Balancer
curl "http://localhost:42069/api/pools/available?dex=Balancer&limit=10"

# Filter berdasarkan token dan sort by volume
curl "http://localhost:42069/api/pools/available?token=0x1234...&sort_by=volume&limit=15"

# Filter DEX dan sort berdasarkan jumlah swap
curl "http://localhost:42069/api/pools/available?dex=OneInch&sort_by=swaps"
```

**Response JSON:**
```json
{
  "pools": [
    {
      "pool_id": "0x...",
      "token_a": "0x...",
      "token_b": "0x...",
      "creator": "0x...",
      "dex_name": "Balancer",
      "reserve_a": "5000000000000000000000",
      "reserve_b": "10000000000000000000000",
      "total_supply": "15000000000000000000000",
      "created_at": 1672531200,
      "block_number": 12345678,
      "transaction_hash": "0x...",
      "total_swaps": 25,
      "total_volume": "50000000000000000000000",
      "unique_traders": 15,
      "liquidity_events": 8
    }
  ],
  "count": 5,
  "filters": {
    "dex": "Balancer",
    "token": "all",
    "sort_by": "created_at",
    "limit": 5,
    "offset": 0
  },
  "available_dex": [
    {
      "dex_name": "Balancer",
      "pool_count": "12",
      "total_liquidity": "1000000000000000000000000"
    }
  ],
  "popular_tokens": [
    {
      "token_address": "0x...",
      "pool_count": "8"
    }
  ]
}
```

---

### 3. 👤 Pool yang Dibuat oleh Creator Address

**Endpoint:** `GET /api/pools/by-creator/{address}`

**Deskripsi:** Mendapatkan semua pool yang dibuat oleh address creator tertentu dengan statistik lengkap.

**Path Parameters:**
- `address` (required): Address creator/pembuat pool

**Query Parameters:**
- `dex` (optional): Filter berdasarkan nama DEX
- `limit` (optional): Jumlah maksimal data (default: 100)
- `offset` (optional): Offset untuk pagination (default: 0)
- `include_stats` (optional): Include statistik detail untuk setiap pool ("true"/"false") (default: false)

**Contoh Penggunaan:**
```bash
# Pool yang dibuat oleh address tertentu
curl "http://localhost:42069/api/pools/by-creator/0x1234567890abcdef1234567890abcdef12345678"

# Pool dari creator dengan filter DEX
curl "http://localhost:42069/api/pools/by-creator/0x1234567890abcdef1234567890abcdef12345678?dex=Uniswap"

# Pool dari creator dengan statistik detail
curl "http://localhost:42069/api/pools/by-creator/0x1234567890abcdef1234567890abcdef12345678?include_stats=true"

# Pool dari creator dengan filter DEX dan statistik
curl "http://localhost:42069/api/pools/by-creator/0x1234567890abcdef1234567890abcdef12345678?dex=Curve&include_stats=true&limit=5"
```

**Response JSON:**
```json
{
  "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
  "pools": [
    {
      "pool_id": "0x...",
      "token_a": "0x...",
      "token_b": "0x...",
      "creator": "0x1234567890abcdef1234567890abcdef12345678",
      "dex_name": "Curve",
      "reserve_a": "2000000000000000000000",
      "reserve_b": "4000000000000000000000",
      "total_supply": "6000000000000000000000",
      "created_at": 1672531200,
      "block_number": 12345678,
      "transaction_hash": "0x...",
      "total_swaps": 12,
      "total_volume": "24000000000000000000000",
      "unique_traders": 8,
      "liquidity_events": 5,
      "last_swap_time": 1672617600
    }
  ],
  "count": 3,
  "filters": {
    "dex": "Curve",
    "include_stats": true,
    "limit": 5,
    "offset": 0
  },
  "creator_stats": {
    "summary": {
      "total_pools_created": "8",
      "dex_platforms_used": "3",
      "total_liquidity": "50000000000000000000000",
      "account_first_activity": 1672531200,
      "account_last_activity": 1672617600
    },
    "by_dex": [
      {
        "dex_name": "Curve",
        "pools_created": "3",
        "total_liquidity_provided": "18000000000000000000000",
        "first_pool_created": 1672531200,
        "last_pool_created": 1672617600
      },
      {
        "dex_name": "Uniswap",
        "pools_created": "5",
        "total_liquidity_provided": "32000000000000000000000",
        "first_pool_created": 1672531400,
        "last_pool_created": 1672617400
      }
    ]
  }
}
```

---

## 🔍 Fitur Utama

### Filter DEX yang Tersedia:
- **Uniswap**: DEX utama dengan berbagai pool
- **OneInch**: DEX aggregator dengan fokus pada routing optimal
- **Curve**: Specialized untuk stablecoin trading
- **Balancer**: Automated portfolio manager dan liquidity provider

### Sorting Options untuk Pools:
- `created_at`: Berdasarkan waktu pembuatan (terbaru)
- `volume`: Berdasarkan total volume trading
- `swaps`: Berdasarkan jumlah swap transactions
- `dex_name`: Berdasarkan nama DEX (alfabetis)

### Pagination:
Semua endpoint mendukung pagination dengan parameter `limit` dan `offset` untuk mengelola data dalam jumlah besar.

### Response Format:
Semua endpoint mengembalikan JSON dengan struktur yang konsisten, termasuk:
- Data utama (`transactions`, `pools`)
- Metadata filter yang digunakan
- Statistik tambahan
- Informasi untuk pagination

---

## 🚀 Contoh Use Cases

### 1. Dashboard Trading History
```bash
# Mendapatkan 50 transaksi terakhir dengan info DEX
curl "http://localhost:42069/api/transactions/history?limit=50"
```

### 2. Pool Explorer dengan Filter
```bash
# Melihat pool Balancer yang paling aktif
curl "http://localhost:42069/api/pools/available?dex=Balancer&sort_by=swaps&limit=10"
```

### 3. Creator Portfolio Analysis
```bash
# Analisis lengkap pool yang dibuat oleh address tertentu
curl "http://localhost:42069/api/pools/by-creator/0x1234...?include_stats=true"
```

### 4. Multi-DEX Comparison
```bash
# Bandingkan pool dari berbagai DEX
curl "http://localhost:42069/api/pools/available?sort_by=volume&limit=20"
```

---

## 🆕 ENDPOINT BARU: Fix untuk Error DEX + Wallet Address

### 4. **Get Swaps by DEX Name + Trader Address** 🎯

**Endpoint:** `GET /api/swaps/dex/{dexName}/trader/{address}`

**Deskripsi:** Mendapatkan data swap berdasarkan nama DEX dan alamat trader (wallet address) - **SOLUSI untuk error yang Anda alami!**

**Path Parameters:**
- `dexName` (required): Nama DEX ("Uniswap", "OneInch", "Curve", "Balancer")
- `address` (required): Alamat wallet trader

**Query Parameters:**
- `limit` (optional): Jumlah maksimal data (default: 100)
- `offset` (optional): Offset untuk pagination (default: 0)

**Contoh Penggunaan:**
```bash
# Swap dari Uniswap oleh trader tertentu
curl "http://localhost:42069/api/swaps/dex/Uniswap/trader/0xebFACa8463E1c3495a09684137fEd7A4b4574179"

# Dengan pagination
curl "http://localhost:42069/api/swaps/dex/Curve/trader/0xebFACa8463E1c3495a09684137fEd7A4b4574179?limit=50&offset=0"
```

**Response JSON:**
```json
{
  "swaps": [
    {
      "id": "0xc11cedba8a272da202fdb5aabc3f242141ff7-2",
      "pool_id": "0xe13a819a2714c9c4dcc864a30ddb2de467789",
      "trader": "0xebfaca8463e1c3495a09684137fed7a4b4574179",
      "dex_name": "Uniswap",
      "token_in": "0x6eb23ca35d4f467d02c326b1e23c8b7",
      "amount_in": "5000000000000000000",
      "amount_out": "5979642417",
      "timestamp": 1755011384,
      "block_number": 58118612,
      "transaction_hash": "0xc11cedba8a272da202fdb5aabc3f242141ff7",
      "token_a": "0x6eb23ca35d4f467d02c326b1e23c8b7",
      "token_b": "0xe13a819a2714c9c4dcc864a30ddb2de467789",
      "pool_creator": "0xebfaca8463e1c3495a09684137fed7a4b4574179"
    }
  ],
  "dex_name": "Uniswap",
  "trader": "0xebFACa8463E1c3495a09684137fEd7A4b4574179",
  "count": 1,
  "limit": 100,
  "offset": 0,
  "statistics": {
    "total_swaps": "1",
    "total_volume_in": "5000000000000000000",
    "total_volume_out": "5979642417",
    "first_swap": 1755011384,
    "last_swap": 1755011384,
    "unique_pools": "1"
  }
}
```

### 5. **Advanced Swaps Search** 🔍

**Endpoint:** `GET /api/swaps/search`

**Deskripsi:** Pencarian swap dengan multiple filter (alternatif fleksibel untuk query kompleks)

**Query Parameters:**
- `dex` (optional): Filter berdasarkan nama DEX
- `trader` (optional): Filter berdasarkan alamat trader
- `pool_id` (optional): Filter berdasarkan pool ID
- `token_in` (optional): Filter berdasarkan token input
- `min_amount` (optional): Minimum amount_in
- `max_amount` (optional): Maximum amount_in
- `from_date` (optional): Filter dari timestamp
- `to_date` (optional): Filter sampai timestamp
- `limit` (optional): Jumlah maksimal data (default: 100)
- `offset` (optional): Offset untuk pagination (default: 0)

**Contoh Penggunaan:**
```bash
# Kombinasi DEX + trader (sama seperti endpoint di atas)
curl "http://localhost:42069/api/swaps/search?dex=Uniswap&trader=0xebFACa8463E1c3495a09684137fEd7A4b4574179"

# Swap besar di Curve (> 1000 tokens)
curl "http://localhost:42069/api/swaps/search?dex=Curve&min_amount=1000000000000000000000"

# Swap dalam rentang waktu tertentu
curl "http://localhost:42069/api/swaps/search?from_date=1672531200&to_date=1672617600"

# Multiple filters
curl "http://localhost:42069/api/swaps/search?dex=Balancer&trader=0x123...&min_amount=1000000000000000000&limit=25"
```

---

## 🔧 Solusi untuk Error GraphQL

**Masalah:** Variable '$trader' is not defined by operation 'GetTradingByDEX'

**Solusi:** Gunakan query GraphQL yang sudah diperbaiki di file `important-query.md`:

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

---

## 📊 Data yang Tersedia

Berdasarkan indexing saat ini, server telah mengindeks:
- **37 pools** total (11 Uniswap + 8 OneInch + 12 Curve + 6 Balancer)
- **1 swap transaction** (dari Uniswap)
- **29 liquidity events** (13 Uniswap + 6 OneInch + 7 Curve + 3 Balancer)

Data terus bertambah secara real-time seiring dengan blok baru yang diindeks dari Sonic Blaze Testnet.
