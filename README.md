# OpenRouter Worker & Local Proxy

這個專案包含兩個主要部分：一個 Cloudflare Worker 用於轉發請求到 OpenRouter API，以及一個本地 Express Proxy 用於轉發Openclaw 的請求到Cloudflare Worker

## 專案結構

- **`src/index.js`**: Cloudflare Worker 的核心邏輯，負責處理 CORS 並將請求轉發至 OpenRouter (`https://openrouter.ai/api`)。
- **`local-proxy/`**: 一個本地的 Node.js Express 伺服器，用於將請求轉發到已部署的 Cloudflare Worker，並完整支援串流 (Streaming) 回應與日誌記錄。
- **`wrangler.toml`**: Cloudflare Worker 的設定檔。

## 前置需求

- [Node.js](https://nodejs.org/) (建議 v22 或以上)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (Cloudflare Workers CLI)

## 安裝與設定

### 1. Cloudflare Worker

這個 Worker 的主要作用是作為 OpenRouter API 的中繼站。

**部署到 Cloudflare:**
```bash
npx wrangler deploy
```

設定檔 `wrangler.toml` 中已定義了相容性日期與放置區域 (Region)。

### 2. Local Proxy (本地代理)

本地代理伺服器位於 `local-proxy` 目錄下，預設會將請求轉發到 `https://openrouter-workerxyz.xxxxxx.workers.dev` (可於 `local-proxy/proxy.js` 中修改 `WORKER_URL` 常數)。

**進入目錄:**
```bash
cd local-proxy
```

**安裝依賴:**
```bash
npm install
```

**啟動代理伺服器:**
```bash
node proxy.js
```

伺服器將會在 `http://localhost:3000` 啟動。

## 使用方式

當 Local Proxy 啟動後，你可以發送請求到 `http://localhost:3000`，它會透過 Cloudflare Worker 轉發到 OpenRouter。

### 支援功能
- **CORS 處理**: Worker 端已處理跨域請求。
- **一般 JSON 回應**: 適用於非串流請求，會完整印出 Response Body。
- **Streaming (SSE)**: 支援 `stream: true` 的請求，會即時回傳生成的內容 (Server-Sent Events)。


## 開發筆記

- `local-proxy/proxy.js` 會在控制台印出詳細的 `INCOMING REQUEST` 資訊 (Method, Path, Headers) 以及 Worker 的回應狀態，方便除錯。
- 如果需要更改轉發的目標 Worker，請編輯 `local-proxy/proxy.js` 中的 `WORKER_URL` 變數。


### OpenClaw json 需要改的地方 (主要加models 同改agents)
可參考sample_openclaw.json


