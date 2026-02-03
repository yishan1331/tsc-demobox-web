# DemoBox Web Frontend

DemoBox 機台監控系統前端，用於監控工廠設備感測器數據。

## 技術棧

- **框架**: Vue 3 + Composition API + `<script setup>`
- **語言**: TypeScript (strict mode)
- **建構工具**: Vite
- **UI 元件庫**: Vuestic UI 1.10.2
- **狀態管理**: Pinia
- **路由**: Vue Router 4
- **樣式**: SCSS + Tailwind CSS
- **國際化**: Vue I18n
- **HTTP Client**: Axios

## 開發指令

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建構生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 執行 ESLint 檢查
pnpm lint

# TypeScript 類型檢查
pnpm type-check
```

## 專案結構

```
src/
├── components/          # 可重用 Vue 元件
├── pages/              # 頁面級元件
│   ├── auth/           # 認證頁面 (登入)
│   ├── monitoring/     # 機台監控頁面
│   ├── history/        # 歷史資料頁面
│   └── settings/       # 系統設定頁面
├── layouts/            # 頁面佈局元件
├── stores/             # Pinia 狀態管理
├── router/             # Vue Router 配置
├── services/           # API 服務層
├── composables/        # Vue Composables
├── i18n/               # 國際化檔案
├── utils/              # 工具函數
├── types/              # TypeScript 類型定義
└── assets/             # 靜態資源
```

## 機台類型

| 類型 | 英文 | 說明 |
|------|------|------|
| 打頭 | Heading | 打頭機感測器 |
| 輾牙 | Threading | 輾牙機感測器 |
| 熱處理 | Heat Treatment | 熱處理機感測器 |

## 功能模組

- **登入系統**: JWT Token 認證
- **機台總覽**: 顯示所有機台狀態概覽
- **機台即時狀態**: 單一機台即時數據監控
- **歷史資料**: 歷史感測器數據查詢與匯出
- **帳號管理**: 用戶 CRUD 管理

## 開發規範

- 使用 `pnpm` 作為套件管理器
- 遵循 Vue 3 Composition API 與 `<script setup>` 語法
- 提交前執行 `pnpm lint` 和 `pnpm type-check`
- API 呼叫必須使用服務層模式

## License

MIT
