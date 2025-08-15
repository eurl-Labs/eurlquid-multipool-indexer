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

## 📊 Data yang Tersedia

Berdasarkan indexing saat ini, server telah mengindeks:
- **37 pools** total (11 Uniswap + 8 OneInch + 12 Curve + 6 Balancer)
- **1 swap transaction** (dari Uniswap)
- **29 liquidity events** (13 Uniswap + 6 OneInch + 7 Curve + 3 Balancer)

Data terus bertambah secara real-time seiring dengan blok baru yang diindeks dari Sonic Blaze Testnet.
