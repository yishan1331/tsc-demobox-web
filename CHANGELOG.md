# 更新日誌 (CHANGELOG)

## [2025-01-05] - 修復網路錯誤導致 isLoading 卡住問題

### 🐛 **Bug 修復：網路錯誤時 isLoading 無法重置**

#### 問題描述

當 API 請求遇到網路錯誤 (`ERR_NETWORK`) 時，`http-client.ts` 返回一個永不 resolve 的 Promise，導致：
- `await` 永遠掛起
- `finally` 塊永遠不執行
- `isLoading` 永遠保持 `true`
- 按鈕一直顯示 loading 狀態

#### 根本原因

```typescript
// 舊代碼 - 問題所在
if (error.code === 'ERR_NETWORK') {
    window.dispatchEvent(new Event('network-error'))
    return new Promise(() => {})  // ← 永不 resolve，導致 finally 不執行
}
```

#### 解決方案

1. **修改 Promise 處理**：將 `new Promise(() => {})` 改為 `Promise.reject(error)`
2. **新增 `handled` 屬性**：標記已由 EventService 處理的錯誤，避免重複顯示 toast

#### 📁 修改的文件

**類型定義**：
- `src/types/common.d.ts`：`ApiResult` 新增 `handled?: boolean` 屬性

**HTTP Client 層**：
- `src/utils/http-client.ts`：
  - `ERR_NETWORK` 處理改為 `Promise.reject(error)`
  - `session-expired` 處理改為 `Promise.reject(refreshError)`
  - `formatApiResponse` 標記網路錯誤 `handled: true`

**API 層**：
- `src/services/APIs/common.api.ts`：`getTableDataWithConditions`, `patchTableRecord` 傳遞 `handled`
- `src/services/APIs/quality-control.api.ts`：`submitFirstPhotoInspection` 傳遞 `handled`

**Service 層**：
- `src/services/MonitoringService.ts`：`assignMachine` 傳遞 `handled`
- `src/services/WarehouseService.ts`：`fetchWorkOrders`, `fetchWorkOrderMaterialsDetails`, `submitMaterialIssuance` 傳遞 `handled`
- `src/services/production-reporting/OrderBreakdownService.ts`：所有 API 方法傳遞 `handled`
- `src/services/production-reporting/WorkOrderService.ts`：`fetchWorkOrdersByPeriod` 傳遞 `handled`

**頁面層（檢查 `!result.handled`）**：
- `src/pages/prod-reporting/ProdLine.vue`：所有錯誤處理
- `src/pages/monitoring/MachineMgmt.vue`：錯誤處理
- `src/pages/prod-reporting/OrderBreakdown.vue`：錯誤處理
- `src/pages/warehouse/MaterialIssuance.vue`：錯誤處理
- `src/pages/scheduling/ScheduleQuery.vue`：錯誤處理

#### 🔄 錯誤處理流程

```
網路錯誤發生
    ↓
1. window.dispatchEvent('network-error')
   → EventService 顯示「網路錯誤」toast
    ↓
2. Promise.reject(error)
   → finally 塊執行，isLoading = false ✅
    ↓
3. formatApiResponse 返回 { status: 'error', handled: true }
    ↓
4. Service 層返回 { success: false, handled: true }
    ↓
5. 頁面層檢查 if (!result.handled)
   → 不重複顯示 toast ✅
```

#### ✅ 驗證項目

- [x] 網路錯誤時 `isLoading` 正確重置為 `false`
- [x] 網路錯誤時只顯示一次 toast（由 EventService 處理）
- [x] 頁面不會重複顯示錯誤訊息
- [x] TypeScript 類型檢查通過
- [x] ESLint 檢查通過
- [x] 向下兼容：`handled` 為 optional，未設置時行為與原本相同

---

## [2025-08-22] - Complete API Format Unification Project

### 🚀 **重大更新：全系統 API 格式統一**

完成了從 `axiosAPI` 到統一 `ApiResult` 格式的全面轉換，這是 MES 系統的重大架構升級。

#### 📊 **轉換規模**

- **114+ API 函數**：跨 7 個 API 文件完全轉換
- **22+ Vue 組件**：所有相關組件完成適配
- **7 個 Service 文件**：服務層完整更新

#### 🔄 **格式轉換對照表**

| 項目         | 舊格式 (axiosAPI)      | 新格式 (ApiResult)   |
| ------------ | ---------------------- | ---------------------- |
| **狀態檢查** | `statusCode === 200`   | `status === 'success'` |
| **錯誤狀態** | `statusCode !== 200`   | `status === 'error'`   |
| **回應訊息** | `response`             | `message`              |
| **資料存取** | `content.responseData` | `data`                 |
| **分頁資訊** | `content.pagination`   | `pagination`           |

#### 📁 **更新的 API 文件**

1. **`src/services/APIs/auth.api.ts`**
    - 更新 logout 函數
    - 移除 APIsResponse 依賴

2. **`src/services/APIs/settings.api.ts`** (28個函數)
    - 帳號管理 API
    - 權限管理 API
    - 按件計酬管理 API
    - ERP 更新管理 API

3. **`src/services/APIs/prod-reporting.api.ts`** (32個函數)
    - 工單拆單 API
    - 委外報工 API
    - 工單查詢 API
    - 報工報表 API

4. **`src/services/APIs/warehouse.api.ts`** (16個函數)
    - 庫存管理 API
    - 入倉驗收 API
    - 物料出料 API
    - 物料移倉 API

5. **`src/services/APIs/quality-control.api.ts`** (14個函數)
    - 首檢 API
    - 品檢報告 API
    - 檢驗報告 API

6. **`src/services/APIs/scheduling.api.ts`** (12個函數)
    - 排程作業 API
    - 排程修改 API
    - 排程查詢 API
    - 生產進度 API

7. **`src/services/APIs/monitoring.api.ts`** (10個函數)
    - 廠區佈局 API
    - 機台狀態 API
    - 機台管理 API

#### 🛠️ **Service 層更新**

所有 Service 文件已完成格式適配：

- **`AuthService.ts`**: 認證服務統一格式
- **`SettingsService.ts`**: 設定管理服務適配
- **`ProductionReportingService.ts`**: 生產報工服務更新
- **`WarehouseService.ts`**: 倉庫管理服務轉換
- **`QualityControlService.ts`**: 品管檢測服務適配
- **`MonitoringService.ts`**: 監控服務更新
- **`SchedulingService.ts`**: 排程服務轉換

#### 🎨 **Vue 組件適配**

**Auth 模組** (3個組件):

- `Login.vue`, `AppLayout.vue`, `AppNavbarActions.vue`

**Settings 模組** (4個組件):

- `UsersPage.vue`, `PermissionPage.vue`, `PieceworkManagement.vue`, `ErpUpdate.vue`

**Warehouse 模組** (4個組件):

- `InventoryQuery.vue`, `MaterialIssuance.vue`, `ReceivingInspection.vue`, `WarehouseTransfer.vue`

**Quality Control 模組** (2個組件):

- `FirstArticleInspection.vue`, `QualityReport.vue`

**Production Reporting 模組** (9個組件):

- `Workorder.vue`, `ProdLine.vue`, `ProcessBreakdown.vue`, `OrderBreakdown.vue`, `Report.vue`, `Outsourcing.vue`
- `FinalInspection.vue`, `PatrolInspection.vue`, `InspectionStepperBase.vue`

**Monitoring 模組** (2個組件):

- `FactoryOpStatus.vue`, `MachineMgmt.vue`

#### 🔧 **技術實現**

**API 層轉換範例**:

```typescript
// 舊格式 (axiosAPI)
const apiResult = await axiosAPI({
	methods: 'GET',
	whichFunction: 'GetUsers',
	params: { userID: userData.value.userID },
})

// 新格式 (統一 API)
const apiResult = await api.get('settings/users/list', {
	params: { userID: userData.value.userID },
})

return {
	status: apiResult.status,
	message: apiResult.message || 'ok',
	data: apiResult.data.Data,
}
```

**Service 層適配**:

```typescript
// Service 層提供向下兼容轉換
statusCode.value = apiResult.status === 'success' ? 200 : 500
response.value = apiResult.message || 'ok'
```

#### ✅ **品質保證**

- **TypeScript 類型安全**: 修復所有格式相關類型錯誤
- **ESLint 代碼品質**: 清理警告，提升代碼品質
- **向下兼容性**: Vue 組件使用方式保持不變
- **統一性驗證**: 全系統使用一致的 API 格式

#### 🚫 **棄用項目**

- ❌ **axiosAPI**: 舊的 API 調用方式已完全淘汰
- ❌ **APIsResponse**: 舊的回應格式類型已移除
- ❌ **whichFunction**: 舊的功能識別參數不再使用

#### 📈 **架構優勢**

此次轉換帶來的核心優勢：

1. **統一性**: 全系統使用一致的 API 回應格式
2. **RESTful**: 符合現代 API 設計標準
3. **類型安全**: 完整的 TypeScript 類型定義
4. **維護性**: 清晰的分層架構，便於維護
5. **擴展性**: 標準化格式便於功能擴展

---

## [2025-08-22] - Warehouse Components API Response Format Update (已整合至上方主要更新)

### 🔄 **更改內容**

#### 更新 warehouse 相關 Vue 組件以適配新的 ApiResult 格式

**影響的文件：**

1. `src/pages/warehouse/InventoryQuery.vue` (warehouseQueryService)
2. `src/pages/warehouse/MaterialIssuance.vue` (materialIssuanceService)
3. `src/pages/warehouse/ReceivingInspection.vue` (warehouseReceivingService)
4. `src/pages/warehouse/WarehouseTransfer.vue` (warehouseTransferService)

### 📝 **主要變更點**

#### **1. 錯誤檢查邏輯更新**

- **變更前**: `statusCode.value === 200` / `statusCode.value !== 200`
- **變更後**: `status.value === 'success'` / `status.value !== 'success'`

#### **2. 回應資料更新**

- **變更前**: `response.value` 用於錯誤訊息
- **變更後**: `message.value` 用於錯誤訊息

#### **3. 資料存取路径更新**

- **變更前**: `content.responseData` / `QueryTableData`
- **變更後**: `data` (直接存取資料層級)

#### **4. 服務層響應式變數更新**

- **變更前**: 解構 `statusCode`, `response`
- **變更後**: 解構 `status`, `message`

### 🔧 **技術細節**

**InventoryQuery.vue 主要變更:**

```typescript
// Before
const { isLoading, statusCode, response } = queryService
if (statusCode.value === 200) {
	const data = (result as any)?.QueryTableData?.list || result || []
} else {
	errorHandling(response.value)
}

// After
const { isLoading, status, message } = queryService
if (status.value === 'success') {
	const data = (result as any)?.data?.list || result || []
} else {
	errorHandling(message.value)
}
```

**其他組件類似變更:**

- MaterialIssuance.vue: 更新服務層解構和錯誤檢查邏輯
- ReceivingInspection.vue: 更新服務層解構、錯誤檢查邏輯，以及直接 API 回應處理
- WarehouseTransfer.vue: 更新服務層解構和錯誤檢查邏輯

### ✅ **驗證項目**

更新後的組件現在符合新的 ApiResult 格式標準：

- [x] 使用 `status` 而非 `statusCode` 進行成功/失敗判斷
- [x] 使用 `message` 而非 `response` 取得回應訊息
- [x] 使用 `data` 路径存取回應資料
- [x] 保持所有現有功能和 UI 行為不變

### 🎯 **影響範圍**

- ✅ **向下兼容**: 所有現有功能保持正常運作
- ✅ **UI 一致性**: 用戶介面和互動行為無變化
- ✅ **錯誤處理**: 錯誤訊息顯示機制保持一致
- ✅ **資料流**: 資料獲取和顯示邏輯正確更新

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

---

## [2025-08-06] - 硬編碼顏色值完全替換為 CSS 變數

### 改善項目 🔧

#### 顏色系統標準化

- **完成硬編碼顏色值替換**: 將所有剩餘的硬編碼顏色值 (如 `#2c3e50`, `#1976d2`, `#6c757d`, `#4caf50`, `#424242` 等) 替換為 CSS 變數
- **統一顏色變數命名**: 全面使用 `var(--va-canmes-*)` 格式的顏色變數
- **改善代碼維護性**: 透過中央化的顏色管理，提升主題切換和顏色調整的便利性

#### 檔案更新清單

**頁面檔案**:

- `src/pages/monitoring/EBoard.vue`: 替換 4 個硬編碼顏色值
- `src/pages/prod-reporting/Report.vue`: 替換 15 個硬編碼顏色值和漸層背景
- `src/pages/prod-reporting/ProdLine.vue`: 替換邊框顏色

**組件檔案**:

- `src/components/prod-reporting/WorkorderCard.vue`: 替換邊框顏色
- `src/components/sidebar/AppSidebar.vue`: 替換 hover 顏色
- `src/components/sidebar/AppSidebarItems.vue`: 替換文字顏色
- `src/components/va-charts/vaChartConfigs.js`: 替換圖表文字顏色
- `src/components/va-charts/chart-types/Map.vue`: 替換地圖顏色函數

**根檔案**:

- `src/App.vue`: 替換 Modal 標題顏色

#### 顏色對應表

- `#2c3e50` → `var(--va-canmes-black)`
- `#1976d2` → `var(--va-canmes-blue-dark)`
- `#6c757d` → `var(--va-canmes-grey-neutral)`
- `#4caf50` → `var(--va-canmes3)`
- `#424242` → `var(--va-canmes-black)`
- `#f8f9fa` → `var(--va-canmes-grey-light)`
- `#e0e0e0` → `var(--va-canmes-grey)`
- `#fff` → `var(--va-canmes-white)`
- `#000` → `var(--va-canmes-black)`
- `#ccc` → `var(--va-canmes-grey)`

### 技術特色 🎯

- ✅ 完全移除硬編碼顏色值
- ✅ 統一使用 CSS 變數系統
- ✅ 保持視覺一致性
- ✅ 提升主題切換能力
- ✅ 改善代碼可維護性

---

## [2025-08-06] - 報工報表多層級展開功能

### 新增功能 ✨

#### 報工報表 (Production Report)

- **多層級展開結構**: 實作三層架構的報工資料展示
    - 第一層：工單汇总列表 (Work Order Summary)
    - 第二層：工序詳細資訊 (Process Details)
    - 第三層：批次詳細資訊 (Process Batches)
- **首件資訊Modal**: 點擊首件明細可查看詳細的首件檢查資訊
- **查詢條件介面**: 支援產品條件、產品名稱、作業人員、日期等多重篩選
- **漸進式資料載入**: 只在展開時才載入下層資料，提升性能
- **美化界面設計**: 使用漸層背景、動畫效果、狀態標示等視覺元素

#### 技術架構 🛠️

- **新增TypeScript類型定義**:
    - `WorkOrderReportSummary` - 工單汇总資料結構
    - `ProcessDetail` - 工序詳細資料結構
    - `ProcessBatch` - 批次資料結構
    - `FirstArticleInfo` - 首件資訊結構
    - `FirstArticleImage` - 首件圖片結構

- **Mock資料支援**:
    - 新增 `/getWorkOrderReportSummary` API端點
    - 新增 `/getProcessDetails` API端點
    - 新增 `/getProcessBatches` API端點
    - 新增 `/getFirstArticleInfo` API端點

#### 組件架構 🧩

- **Report.vue**: 重新設計支援多層級展開的報工報表頁面
- **FirstArticleModal.vue**: 新增首件資訊彈窗組件
- **響應式設計**: 支援各種螢幕尺寸的適配

#### 國際化支援 🌐

- **繁體中文 (tw.json)**:
    - `productionReport.productCondition`: "產品條件"
    - `productionReport.date`: "日期"
    - `productionReport.queryResults`: "查詢結果"
    - `productionReport.noData`: "無資料"
    - `productionReport.firstArticleDetail`: "首件明細"
    - `productionReport.firstArticleInfo`: "首件資訊"
    - `productionReport.basicInfo`: "基本資訊"
    - `productionReport.checkDate`: "檢查日期"
    - `productionReport.checkTime`: "檢查時間"
    - `productionReport.checkerName`: "檢查員"
    - `productionReport.checkImages`: "檢查圖片"
    - `productionReport.firstArticleFeedback`: "首件回饋"
    - `common.query`: "查詢"
    - `common.advanced`: "進階"

- **英文 (en.json)**: 對應英文翻譯

### 改善項目 🔧

- **代碼品質**: 通過TypeScript嚴格模式檢查
- **代碼風格**: 通過ESLint檢查，符合專案規範
- **類型安全**: 完整的TypeScript類型定義，避免運行時錯誤

### 技術特色 🎯

- ✅ 符合現有Vuestic UI + Vue 3 + TypeScript架構
- ✅ 遵循Composition API + `<script setup>` 語法
- ✅ 支援國際化 (i18n)
- ✅ 響應式設計
- ✅ 美化界面設計
- ✅ 完整Mock資料支援
- ✅ 漸進式資料載入
- ✅ 類型安全保障

### 測試說明 🧪

運行 `pnpm dev` 後訪問生產報工 → 報工報表，可測試：

1. 查詢功能與多重篩選
2. 工單展開顯示工序列表
3. 工序展開顯示批次詳細
4. 點擊首件明細查看Modal
5. 多語言切換功能
6. 響應式界面適配

---

_此更新完全按照mockup設計實作，提供完整的多層級展開報工報表功能。_
