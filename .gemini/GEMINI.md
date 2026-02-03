# 專案結構與開發指南

## 📂 目錄結構

```
src/                # 主要源代碼目錄
├─ assets/          # 靜態資源
├─ components/      # 可重用組件
├─ i18n/            # 國際化文件
├─ layouts/         # 主要頁面layout
├─ mock/            # Mock Data
├─ pages/           # 頁面組件
├─ router/          # 路由配置
├─ scss/            # style文件
├─ service/         # API Service
├─ stores/          # Pinia 狀態管理
├─ types/           # TypeScript 類型定義
├─ utils/           # 工具函數
├─ validators/      # validators
public/             # 靜態資源目錄
node_modules/       # 依賴包目錄
```

---

## ⚙️ 配置文件

- `package.json`：專案依賴與腳本
- `vite.config.ts`：Vite 構建工具配置
- `tsconfig.json`：TypeScript 配置
- `tailwind.config.js`：Tailwind CSS 配置
- `.eslintrc.cjs`：ESLint 配置
- `.prettierrc.json`：Prettier 配置

---

## 🏗️ 開發腳本

| 指令              | 功能                     |
| ----------------- | ------------------------ |
| `pnpm dev`        | 啟動開發環境             |
| `pnpm build`      | 構建生產版本             |
| `pnpm preview`    | 預覽生產版本             |
| `pnpm lint`       | 運行代碼檢查             |
| `pnpm type-check` | 運行 TypeScript 類型檢查 |

---

## 🔄 開發流程

1. `pnpm dev` 啟動開發服務器
2. 遵循 Git 工作流程
3. 提交前執行 `pnpm lint` 與 `pnpm type-check`
4. 使用 `pnpm build` 構建生產版本

---

## 🧰 技術堆疊

**核心框架**

- Vue 3 + Composition API
- TypeScript 5.0+
- Vite
- Tailwind CSS
- Vuestic UI 1.10.2 - UI 元件庫

**狀態管理與路由**

- Pinia
- Vue Router

**其他**

- Vue I18n：國際化
- Axios：HTTP 請求
- Chart.js：圖表
- Lodash：工具函數

**開發工具**

- ESLint - 代碼檢查
- Prettier - 代碼格式化
- TypeScript 嚴格模式

---

## ✨ 編碼風格

- 縮排：4 空格
- 私有類別成員：底線 `_` 前綴
- 嚴格相等：`===` / `!==`
- 檔案命名：`kebab-case`
- 組件命名：`PascalCase`
- 使用 `<script setup>` 語法
- 優先函數式程式設計
- SCSS 模塊化樣式

---

## 🛠️ 最佳實踐

- 使用 TypeScript 類型註解
- 使用 Vuesitc 與 Tailwind 集成
- 代碼提交前必跑 `lint` 與 `type-check`

---

## 📦 相依性規範

- 除非必要，避免引入新套件
- 若需新套件，須附理由

---

## 🎨 Vuestic 使用指南

**版本**：1.10.2
官方文件：[Vuestic UI](https://ui.vuestic.dev/)

**全域設定**

- 設定檔：`src/services/vuestic-ui/global-config.ts`
- 主題色彩：`src/services/vuestic-ui/themes.ts`
- Icon 設定：`src/services/vuestic-ui/icons-config/icons-config.ts`

**樣式覆寫**

- SCSS 變數可於 `src/scss/main.scss` 調整
- Tailwind 顏色已映射至 Vuestic 變數（見 `tailwind.config.js`）
- 優先使用 Vuestic UI 內建樣式，必要時再用 Tailwind 覆蓋

**組件使用規範**

- 組件命名採 PascalCase
- 優先使用 Vuestic UI 元件，必要時再自訂
- 主題切換建議用 `ThemeSwitcher.vue`
- Icon 建議用 `VaIcon` 並統一管理

**常用組件範例**

```vue
<VaButton color="primary">主要按鈕</VaButton>
<VaInput v-model="value" label="輸入欄位" />
<VaDataTable :items="items" />
```

**最佳實踐**

- 使用 `<script setup lang="ts">`
- 支援國際化（i18n）
- 支援無障礙（a11y）
- 善用全域設定與主題切換

**與 Tailwind CSS 集成**

1. 使用 `vuestic/tailwind` 包進行集成
2. 可以混合使用 Vuestic 和 Tailwind 的類名
3. 優先使用 Vuestic 的內置樣式，需要時再使用 Tailwind 進行覆蓋

---
