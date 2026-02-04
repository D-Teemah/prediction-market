# External Services & Endpoints

This document provides a comprehensive list of all external API endpoints and services used by this application, categorized by their function.

## 1. Core Infrastructure & Database

| Service | Endpoint / URL | Purpose |
| :--- | :--- | :--- |
| **Supabase** | `*.supabase.co` | **Primary Backend**: Used for PostgreSQL database, Authentication (JWT), and Object Storage (images/assets). Configured via `NEXT_PUBLIC_SUPABASE_URL`. |

## 2. Blockchain & Web3

| Service | Endpoint / URL | Purpose |
| :--- | :--- | :--- |
| **Goldsky** | `api.goldsky.com` | **Indexer**: Fetches blockchain events via the PnL Subgraph to sync market data. Used in `src/app/api/sync/events/route.ts`. |
| **Irys (Arweave)** | `gateway.irys.xyz` | **Decentralized Storage**: Fetches market metadata and images stored on Arweave. Used in `src/app/api/sync/events/route.ts`. |
| **WalletConnect** | `rpc.walletconnect.org` | **RPC Provider**: Used by `@reown/appkit` and `viem` for blockchain interactions and wallet verification. |
| **Kuest Relayer** | `process.env.RELAYER_URL` | **Transaction Relay**: Used for proxy wallet operations (gasless transactions). Calls `/wallet/safe`. |
| **UMA Oracle** | `oracle.uma.xyz` | **Dispute Resolution**: Linked for market proposals and dispute settlements. |

## 3. Artificial Intelligence

| Service | Endpoint / URL | Purpose |
| :--- | :--- | :--- |
| **OpenRouter** | `openrouter.ai/api/v1/*` | **AI Model Access**: Used to fetch available AI models (`/models`) and generate chat completions (`/chat/completions`) for market context/resolution. |

## 4. Data Seeding & News

| Service | Endpoint / URL | Purpose |
| :--- | :--- | :--- |
| **GDELT Project** | `api.gdeltproject.org` | **Global News**: Fetches recent news articles to seed initial prediction market events (`/api/v2/doc/doc`). |
| **BBC News** | `feeds.bbci.co.uk` | **RSS Feed**: Fetches world news RSS feeds to seed initial events. |

## 5. Authentication & Identity

| Service | Endpoint / URL | Purpose |
| :--- | :--- | :--- |
| **Reown (AppKit)** | `*.reown.com` | **Wallet Auth**: Manages wallet connections and SIWE (Sign-In with Ethereum). Configured via `NEXT_PUBLIC_REOWN_APPKIT_PROJECT_ID`. |
| **Better Auth** | (Internal/Library) | **Auth Library**: Manages sessions and authentication flows. Uses `rpc.walletconnect.org` for signature verification. |
