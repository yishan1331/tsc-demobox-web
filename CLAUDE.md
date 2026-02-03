# CLAUDE.md - DemoBox Machine Monitoring System

> **Documentation Version**: 2.0
> **Last Updated**: 2026-02-02
> **Project**: DemoBox Web Frontend

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager

This project uses **pnpm** as the package manager. All commands should use `pnpm` instead of `npm` or `yarn`.

### Core Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build production version (runs TypeScript compilation then Vite build)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint with auto-fix (should be run before commits)
- `pnpm type-check` - Run TypeScript type checking without emitting files

### Additional Commands

- `pnpm storybook` - Start Storybook development server on port 6006
- `pnpm build-storybook` - Build Storybook for production

## Project Architecture

### Technology Stack

- **Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Language**: TypeScript with strict mode
- **Build Tool**: Vite
- **UI Library**: Vuestic UI 1.10.2 (50+ components with theme support)
- **State Management**: Pinia
- **Routing**: Vue Router 4 (using hash history mode)
- **Styling**: SCSS + Tailwind CSS integrated with Vuestic UI themes
- **Internationalization**: Vue I18n with locales in `src/i18n/locales/`
- **HTTP Client**: Axios with service layer pattern
- **Testing**: Storybook for component development
- **Development**: ESLint, Prettier, Husky for git hooks

### Key Directory Structure

```
src/
├── components/          # Reusable Vue components
├── pages/              # Page-level components organized by feature
│   ├── auth/           # Authentication pages (Login)
│   ├── monitoring/     # Machine monitoring pages
│   ├── history/        # Historical data pages
│   └── settings/       # System settings pages
├── layouts/            # Page layout components
├── stores/             # Pinia state management
├── router/             # Vue Router configuration
├── services/           # API services and business logic
│   ├── APIs/           # API endpoint definitions
│   └── vuestic-ui/     # Vuestic UI global configuration
├── i18n/               # Internationalization files
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets (images, icons)
```

### Application Structure

This is a **DemoBox Machine Monitoring System** frontend for monitoring factory equipment sensors. The system monitors three types of manufacturing machines:

**Machine Types (Sensor Categories)**:
| 類型 | 英文 | 說明 |
|------|------|------|
| 打頭 | Heading | 打頭機感測器 |
| 輾牙 | Threading | 輾牙機感測器 |
| 熱處理 | Heat Treatment | 熱處理機感測器 |

**Main Modules**:
- **Authentication**: Login system with JWT authentication
- **Dashboard**: Machine overview and real-time status monitoring
- **History**: Historical sensor data query and visualization
- **Settings**: User management and system configuration

### Configuration Files

- **Vuestic UI**: Global config at `src/services/vuestic-ui/global-config.ts`
- **Themes**: Theme configuration at `src/services/vuestic-ui/themes.ts`
- **Icons**: Icon configuration at `src/services/vuestic-ui/icons-config/`
- **Aliases**: `@` maps to `src/`, `@types` maps to `src/types/`
- **Styling**: SCSS variables in `src/scss/main.scss`, Tailwind integrated with Vuestic themes

### Development Guidelines

- Use **Vue 3 Composition API** with `<script setup lang="ts">` syntax
- In a Vue Single File Component (.vue), the file structure convention is: Write `<template>` first, then `<script>`, and finally `<style>`.
- Follow **TypeScript strict mode** with proper type annotations
- Use **Vuestic UI components** as primary UI library before custom components
- Component naming: **PascalCase** for components, **kebab-case** for files
- Always run `pnpm lint` and `pnpm type-check` before commits
- Use Pinia stores for state management with proper TypeScript typing
- Leverage the existing service layer pattern for API calls
- **API呼叫**: 務必使用axiosAPI來呼叫API，參考UsersPage.vue的標準流程
- Support internationalization using Vue I18n
    - Use t() from useI18n() for translations in scripts and templates.
    - Do not use this.$t inside scripts when using the Composition API.
- Development formatting must follow the .prettierrc configuration

### 🔍 查詢條件卡片組件 (Query Card Components)

> **⚠️ 所有查詢/篩選功能必須使用統一的 QueryCard 組件**

#### **組件位置**

- `src/components/common/QueryCard.vue` - 查詢卡片容器
- `src/components/common/FormGroup.vue` - 表單欄位群組

#### **基本用法**

```vue
<template>
  <QueryCard :title="t('filter.queryModule')" icon="search" collapsible>
    <!-- 固定搜尋欄位 -->
    <FormGroup :label="t('user.username')">
      <VaInput v-model="searchUsername" :placeholder="t('user.username')" clearable />
    </FormGroup>

    <FormGroup :label="t('user.full_name')">
      <VaInput v-model="searchFullName" :placeholder="t('user.full_name')" clearable />
    </FormGroup>

    <!-- 下拉選擇 -->
    <FormGroup :label="t('history.sensorType')">
      <VaSelect
        v-model="sensorType"
        :options="sensorTypeOptions"
        :placeholder="t('history.selectSensorType')"
        value-by="value"
        text-by="label"
        clearable
      />
    </FormGroup>

    <!-- 日期選擇 -->
    <FormGroup :label="t('history.startDate')">
      <VaDateInput v-model="startDate" :placeholder="t('history.selectStartDate')" clearable />
    </FormGroup>

    <!-- 操作按鈕（使用 #actions slot） -->
    <template #actions>
      <VaButton :loading="isLoading" @click="handleQuery">
        <template #prepend>
          <VaIcon name="search" />
        </template>
        {{ t('history.query') }}
      </VaButton>
      <VaButton preset="secondary" @click="handleReset">
        <template #prepend>
          <VaIcon name="refresh" />
        </template>
        {{ t('common.reset') }}
      </VaButton>
    </template>
  </QueryCard>
</template>

<script setup lang="ts">
import QueryCard from '@/components/common/QueryCard.vue'
import FormGroup from '@/components/common/FormGroup.vue'
</script>
```

#### **QueryCard Props**

| Prop | Type | Default | 說明 |
|------|------|---------|------|
| `title` | `string` | - | 卡片標題 |
| `icon` | `string` | - | 標題圖標（Material Icons） |
| `collapsible` | `boolean` | `false` | 是否可摺疊 |
| `initialCollapsed` | `boolean` | `false` | 初始是否摺疊 |

#### **QueryCard Slots**

| Slot | 說明 |
|------|------|
| `default` | 表單內容（FormGroup 組件） |
| `actions` | 操作按鈕區域 |

#### **FormGroup Props**

| Prop | Type | 說明 |
|------|------|------|
| `label` | `string` | 欄位標籤 |

#### **使用範例頁面**

- `src/pages/history/History.vue` - 歷史資料查詢
- `src/pages/settings/users/UsersPage.vue` - 帳號管理搜尋

#### **設計規範**

1. **固定搜尋欄位**：每個欄位獨立呈現，不使用下拉選擇搜尋欄位
2. **Grid 佈局**：自動響應式排列（桌面多欄、手機單欄）
3. **可摺疊功能**：使用 `collapsible` prop 啟用
4. **統一樣式**：標題背景漸層、一致的間距和圓角

### Mock Data

- Mock API responses are configured in `src/mock/`
- Mock server runs automatically in development mode via vite-plugin-mock
- Authentication mocking available in `src/mock/auth.ts`
- mock資料的格式，通常遵循 `{status: 200, data: {QueryTableData: {}}}` 結構

### Build and Deployment

- Production builds are optimized with esbuild minification
- Source maps are disabled in production
- Console logs and debuggers are stripped in production builds
- GitLab CI/CD pipeline configured for automated testing and building
- Artifacts are stored in `dist/` folder with 1-week expiration

### 🎨 色彩設計系統 (COLOR DESIGN SYSTEM)

> **⚠️ MANDATORY COLOR PALETTE - 所有UI設計必須遵循此色彩規範**

#### 🏢 **TSC Logo 色系參考** (LOGO COLOR REFERENCE)

> Logo 檔案位置：`src/assets/tsc_logo.png`

| 色系 | 顏色範圍 | 用途 |
|------|----------|------|
| **藍色漸層** | 深藍 `#1a4b8c` → 天藍 `#4fc3dc` | Logo 文字 "tSC" 主體 |
| **紫紅漸層** | 紫色 `#7b2d8e` → 洋紅 `#e91e63` | Logo 背景雲朵造型 |
| **青色** | `#00bcd4` ~ `#4dd0e1` | Logo 字母 "C" 尾端 |
| **紫色** | `#6a1b9a` | Logo "Taiwan Signal Cloud" 文字 |

#### 🎯 **核心色彩規範** (CORE COLOR PALETTE)

**主色系** (PRIMARY COLORS):

- **主青藍色** (Primary Cyan-Blue): `#75daee` - 主要品牌色、重要按鈕、連結（呼應 Logo 青藍色調）
- **輔助灰色** (Secondary Grey): `#daddde` - 背景色、邊框、分隔線
- **純白色** (Pure White): `#FFFFFF` - 主要背景、卡片背景
- **純黑色** (Pure Black): `#000000` - 主要文字色

**Logo 延伸色系** (LOGO-DERIVED COLORS):

- **深藍色** (Deep Blue): `#1a4b8c` - 深色強調、圖表主色
- **天藍色** (Sky Blue): `#4fc3dc` - 漸層過渡、次要元素
- **紫色** (Purple): `#7b2d8e` - 特殊強調、標題裝飾
- **洋紅色** (Magenta): `#e91e63` - 警示強調、重要通知

**機台狀態色彩** (MACHINE STATUS COLORS):

- **運行中** (Running): `#4CAF50` (綠色) - 機台正常運作
- **待機** (Idle): `#9E9E9E` (灰色) - 機台閒置
- **警告** (Warning): `#FF9800` (橙色) - 需要注意
- **異常** (Error): `#F44336` (紅色) - 機台故障或異常

**衍生色調** (DERIVED COLORS):

- **深青藍色** (Dark Cyan-Blue): `#4ab8dc` - hover狀態、active狀態
- **中青藍色** (Medium Cyan-Blue): `#5bc2e5` - 次要按鈕、輔助元素
- **極淺灰** (Light Grey): `#f8f9fa` - 卡片背景、區域背景
- **中性灰** (Neutral Grey): `#6c757d` - 次要文字、說明文字

#### 🚫 **絕對禁止** (ABSOLUTE PROHIBITIONS)

- **NEVER** 使用其他色系 (如 Material藍 #1976d2、Bootstrap色彩等)
- **NEVER** 使用未定義的灰色調 (如 #6b7280)
- **NEVER** 硬編碼顏色值 → 必須使用CSS變數或SCSS變數
- **NEVER** 創建新的色彩變數 → 使用現有定義的色彩系統

#### 🎨 **色彩使用指南** (COLOR USAGE GUIDE)

**CSS變數命名規範**:

```scss
// 主色系（呼應 Logo）
$tsc-blue: #75daee;           // 主青藍色
$tsc-blue-dark: #4ab8dc;      // 深青藍色
$tsc-blue-medium: #5bc2e5;    // 中青藍色
$tsc-blue-deep: #1a4b8c;      // Logo 深藍色
$tsc-blue-sky: #4fc3dc;       // Logo 天藍色

// Logo 延伸色系
$tsc-purple: #7b2d8e;         // Logo 紫色
$tsc-magenta: #e91e63;        // Logo 洋紅色

// 輔助灰色系
$tsc-grey: #daddde;           // 輔助灰色
$tsc-grey-light: #f8f9fa;     // 極淺灰
$tsc-grey-neutral: #6c757d;   // 中性灰

// 機台狀態色彩
$machine-running: #4CAF50;
$machine-idle: #9E9E9E;
$machine-warning: #FF9800;
$machine-error: #F44336;
```

## 分層架構規範

**IMPORTANT: 專案必須遵循統一的分層架構，確保程式碼品質、可維護性與測試性。**

### 🏗️ **標準四層架構（Store 可選）**

```
┌─────────────┐
│   Vue 元件   │ ← 模板渲染、事件處理、UI 狀態
└──────┬──────┘
       ↓
┌─────────────┐
│  Composable │ ← 響應式狀態、業務協調、Vue 生態整合
└──────┬──────┘
       ↓
┌─────────────┐
│   Service   │ ← 純業務邏輯、API 封裝、資料轉換
└──────┬──────┘
       ↓
┌─────────────┐
│     API     │ ← HTTP 請求封裝
└─────────────┘

┌─────────────┐
│    Store    │ ← 【可選】複雜全局狀態管理（Pinia）
└─────────────┘
```

### 📋 **各層職責定義**

#### **1. Vue 元件層（Presentation Layer）**

**職責**：
- 模板渲染與樣式
- 使用者事件綁定
- 純 UI 狀態管理（如 modal 顯示/隱藏、form validation）
- 組合 Composable 提供的功能

**規範**：
- 使用 `<script setup>` 語法
- 避免複雜的業務邏輯
- 不直接呼叫 Service 或 API
- Toast 只用於純 UI 操作反饋

**範例**：
```vue
<template>
    <button @click="handleSend" :disabled="sending">
        {{ t('send') }}
    </button>
</template>

<script setup lang="ts">
// ✅ 組合 Composable
const { sendQuestion, sending } = useInsightsAI()

// ✅ 純 UI 事件處理
const handleSend = async () => {
    await sendQuestion(inputValue.value)
    // 業務邏輯與反饋都在 Composable 層處理
}

// ❌ 避免：直接呼叫 Service
// const response = await InsightsAIService.askClaude(...)

// ❌ 避免：複雜業務邏輯
// const processComplexData = () => { ... }
</script>
```

#### **2. Composable 層（Business Coordination Layer）**

**職責**：
- 管理響應式狀態（ref、computed、watch）
- 整合 Vue 生態系統（Store、Router、i18n、Toast）
- 協調多個 Service 操作
- 統一的錯誤處理與使用者反饋
- 業務流程控制

**命名規範**：`use[Feature].ts`

**範例**：
```typescript
// src/composables/insights-ai/useInsightsAI.ts
export function useInsightsAI() {
    // ✅ 響應式狀態管理
    const loading = ref(false)
    const error = ref<Error | null>(null)

    // ✅ Vue 生態整合
    const store = useInsightsAIStore()
    const toast = useToast()
    const { t } = useI18n()

    // ✅ 業務流程協調
    const sendQuestion = async (question: string) => {
        loading.value = true
        try {
            // 呼叫純業務邏輯
            const response = await InsightsAIService.askClaude({
                question,
                account_id: store.selectedAccountId
            })

            // 更新狀態
            store.addMessage(response)

            // 業務成功反饋
            toast.add({
                severity: 'success',
                summary: t('insightsAI.questionSent')
            })

            return response
        } catch (error) {
            // 統一錯誤處理
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        // 只暴露必要的狀態與方法
        loading: readonly(loading),
        sendQuestion
    }
}
```

#### **3. Service 層（Business Logic Layer）**

**職責**：
- 純業務邏輯實作
- API 呼叫封裝
- 資料轉換與驗證
- 業務規則處理

**規範**：
- 使用 Class 靜態方法
- 不包含響應式狀態（不使用 ref、reactive）
- 不直接操作 Store
- 不處理 Toast 或路由導航
- 返回 Promise，不返回響應式物件

**命名規範**：`[Feature]Service.ts`

**範例**：
```typescript
// src/service/InsightsAIService.ts
export class InsightsAIService {
    // ✅ 純 API 封裝
    static async askClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
        const apiResult = await askClaudeAPI(
            request.question,
            request.account_id,
            request.include_sample_data
        )

        // ✅ 資料轉換
        if (apiResult.statusCode === 200 && apiResult.response) {
            return this.transformClaudeResponse(apiResult.response)
        }

        // ✅ 錯誤處理（拋出，讓上層處理）
        throw new Error(`API Error: ${apiResult.statusCode}`)
    }

    // ✅ 業務邏輯
    private static transformClaudeResponse(raw: any): ClaudeResponse {
        return {
            question: raw.question,
            response: raw.response,
            timestamp: new Date(raw.timestamp).toISOString()
        }
    }

    // ❌ 避免：響應式狀態
    // static loading = ref(false)

    // ❌ 避免：直接操作 Store
    // static updateStore(data) { store.setData(data) }
}
```

#### **4. API 層（Data Access Layer）**

**職責**：
- 純 HTTP 請求封裝
- 統一的請求/回應格式
- 網路層錯誤處理

**命名規範**：`[feature].api.ts`

**範例**：
```typescript
// src/service/APIs/insightsAI.api.ts
export const askClaude = async (
    question: string,
    accountId: string,
    includeData = true
): Promise<APIsResponse> => {
    // ✅ 純 HTTP 請求
    const apiResult = await api.post('/claude/ask', {
        question,
        account_id: accountId,
        include_sample_data: includeData
    })
    return apiResult
}
```

#### **5. Store 層（State Management Layer）【可選】**

**何時使用 Store**：
- ✅ **跨多個頁面共享狀態**（如使用者資訊、認證狀態）
- ✅ **複雜的狀態管理**（如購物車、表單草稿）
- ✅ **需要狀態持久化**（localStorage、sessionStorage）
- ✅ **深層元件樹狀態傳遞**（避免 props drilling）

**何時不使用 Store**：
- ❌ **單頁面內的狀態**（用 Composable 內部狀態即可）
- ❌ **簡單的 API 資料快取**（用 Composable 管理）
- ❌ **臨時 UI 狀態**（Modal 開關、Loading 狀態）

**職責**：
- 全局狀態管理
- 跨元件資料共享
- 狀態持久化

**規範**：
- 使用 Pinia options API 模式
- state、getters、actions 結構
- 只在必要時使用，避免過度設計

### 🎯 **Toast 處理規範**

#### **Composable 層處理 Toast 的情況**：
- ✅ API 呼叫結果反饋
- ✅ 業務邏輯執行結果
- ✅ 錯誤處理提示
- ✅ 多步驟操作反饋

#### **Vue 元件層處理 Toast 的情況**：
- ✅ 純 UI 操作（複製到剪貼簿、展開收合）
- ✅ 表單驗證即時反饋
- ✅ 使用者輸入提示

### 🔍 **架構判斷原則**

放在 **Composable** 如果需要：
- 響應式狀態（ref、computed、watch）
- Vue 生態整合（Router、i18n、Toast）
- 生命週期處理
- 協調多個操作

放在 **Service** 如果是：
- 純函數運算
- API 請求封裝
- 資料格式轉換
- 業務規則驗證
- 可在非 Vue 環境使用

### 📝 **實作範例對照**

#### **✅ 推薦架構（InsightsAI 模式）**

```typescript
// Vue 元件：專注 UI
const { sendQuestion, loading } = useInsightsAI()
const handleSend = () => sendQuestion(input.value)

// Composable：協調與狀態
const sendQuestion = async (question: string) => {
    loading.value = true
    const response = await InsightsAIService.askClaude(params)
    store.addMessage(response)
    toast.success('發送成功')
    loading.value = false
}

// Service：純業務邏輯
static async askClaude(params): Promise<Response> {
    const result = await api.post('/claude/ask', params)
    return this.transformResponse(result)
}
```

#### **❌ 需要改進架構（OptimizerAI 模式）**

```typescript
// Vue 元件：承擔過多職責
const handleApply = async () => {
    // 複雜業務邏輯在元件中...
    const data = transformData(items)
    const result = await optimizerService.apply(data)
    // 錯誤處理也在元件中...
}

// Service：返回響應式狀態
export const optimizerService = () => {
    const loading = ref(false) // ❌ Service 不應有響應式狀態
    return { loading, apply }
}
```

### 🚀 **重構指導原則**

1. **分離關注點**：每層只處理自己的職責
2. **狀態管理策略**：
   - 優先使用 Composable 內部狀態
   - 需要跨頁面共享時才使用 Store
   - 避免過度設計
3. **錯誤處理統一**：Service 拋出錯誤，Composable 處理反饋
4. **測試友好**：各層獨立，便於單元測試
5. **複用性**：Composable 和 Service 可跨元件使用

### 📊 **架構選擇指導**

1. **開始時優先使用 Composable**
   - 大部分狀態都可以在 Composable 內管理
   - 簡單、直接、容易測試

2. **需要時才加入 Store**
   - 當發現狀態需要跨頁面共享時
   - 當狀態管理變得複雜時

3. **避免過度設計**
   - 不要為了用 Store 而用 Store
   - 保持架構的簡潔性

### 🔄 **實際應用範例**

#### **✅ 適合用 Store（InsightsAI 範例）**
```typescript
// 跨頁面共享的平台資訊
export const useInsightsAIStore = defineStore('insightsAI', {
    state: () => ({
        platforms: [] as Platform[],        // 跨元件共享
        selectedPlatform: '',              // 需要持久化
        currentAccountId: ''               // 全局狀態
    })
})
```

#### **✅ 不需要 Store（簡單狀態）**
```typescript
// Composable 內部管理即可
export function useFileUpload() {
    const uploading = ref(false)           // 單一功能狀態
    const progress = ref(0)                // 臨時狀態
    const files = ref<File[]>([])          // 本地狀態

    // 不需要 Store，Composable 足夠
    return { uploading, progress, files, upload }
}
```

**後續所有功能開發必須遵循此分層架構規範，確保程式碼品質與維護性。**


### API Architecture

此專案使用三層 API 架構，確保代碼的可維護性和一致性：

#### 🏗️ API架構層次

```
Vue頁面層 → 服務層 → API定義層 → axiosAPI → 後端
    ↓         ↓         ↓
頁面使用   業務邏輯   API端點定義
```

#### 📁 目錄結構

- **API定義層**: `src/services/APIs/*.api.ts` - 定義具體的API端點和參數
- **服務層**: `src/services/*Service.ts` - 封裝業務邏輯和狀態管理
- **頁面使用**: Vue組件中導入並使用服務

#### 🔧 **標準API使用流程**

**參考範例**: `src/pages/settings/users/UsersPage.vue`

1. **導入服務**:

    ```typescript
    import { usersService } from '@/services/SettingsService'
    ```

2. **使用composable**:

    ```typescript
    const {
    	users: tableData,
    	isLoading,
    	statusCode,
    	response,
    	...usersAPI
    } = usersService({
    	sorting: makeUsersSortingRef(),
    })
    ```

3. **呼叫API方法**:

    ```typescript
    await usersAPI.fetch()
    await usersAPI.add(newUser)
    await usersAPI.update(updatedUser)
    await usersAPI.remove(userId)
    ```

#### 📋 **開發規範**

1. **絕對禁止**直接在Vue組件中使用axios或fetch
2. **必須**通過服務層調用API
3. **參考**UsersPage.vue的實作模式
4. **遵循**四層架構：API層 → Service層 → Composable層 → Vue元件層

---

## DemoBox 四層架構實作

> **⚠️ 所有 DemoBox 功能開發必須遵循此四層架構**

### 📁 **DemoBox 檔案結構**

```
src/
├── services/
│   └── APIs/
│       └── sensor.api.ts          # API 層：HTTP 請求封裝
│   └── SensorService.ts           # Service 層：純業務邏輯
├── composables/
│   └── sensor/
│       ├── useSensorOverview.ts   # Composable 層：機台總覽
│       ├── useSensorRealtime.ts   # Composable 層：即時狀態
│       └── useSensorHistory.ts    # Composable 層：歷史資料
├── pages/
│   └── monitoring/
│       ├── Overview.vue           # Vue 元件層：機台總覽頁面
│       └── Machine.vue            # Vue 元件層：即時狀態頁面
│   └── history/
│       └── History.vue            # Vue 元件層：歷史資料頁面
├── mock/
│   └── sensor.ts                  # Mock 資料
└── i18n/
    └── locales/
        └── tw.json                # 翻譯（demobox 區塊）
```

### 🔄 **四層架構調用流程**

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue 元件層 (Overview.vue)                 │
│  - 模板渲染、事件處理                                         │
│  - 使用 Composable 提供的狀態和方法                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               Composable 層 (useSensorOverview.ts)           │
│  - 響應式狀態 (ref, computed)                                │
│  - 業務流程協調                                              │
│  - Toast 通知、Loading 狀態                                  │
│  - 定時輪詢邏輯                                              │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                 Service 層 (SensorService.ts)                │
│  - 純業務邏輯（無響應式狀態）                                  │
│  - 資料轉換與驗證                                            │
│  - 呼叫 API 層                                               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   API 層 (sensor.api.ts)                     │
│  - 純 HTTP 請求封裝                                          │
│  - 統一回應格式                                              │
└─────────────────────────────────────────────────────────────┘
```

### 📋 **各層實作範例**

#### **1. API 層 (`src/services/APIs/sensor.api.ts`)**
```typescript
// 純 HTTP 請求，不含業務邏輯
export const getSensorStatus = async (): Promise<ApiResult<SensorStatusResponse>> => {
    const apiResult = await api.get('TSC/sensors/status')
    return formatResultDirect(apiResult)
}
```

#### **2. Service 層 (`src/services/SensorService.ts`)**
```typescript
// 純業務邏輯，無響應式狀態
export class SensorService {
    static async fetchAllSensorStatus(): Promise<SensorStatusResponse> {
        const result = await getSensorStatus()
        if (result.status === 'error') {
            throw new Error(result.message)
        }
        return result.data
    }

    static transformSensorData(raw: any): SensorStatus {
        return { /* 資料轉換邏輯 */ }
    }
}
```

#### **3. Composable 層 (`src/composables/sensor/useSensorOverview.ts`)**
```typescript
// 響應式狀態 + 業務協調
export function useSensorOverview() {
    const loading = ref(false)
    const sensorData = ref<SensorStatusResponse | null>(null)
    const lastUpdate = ref<string>('')
    const { t } = useI18n()
    const { init: notify } = useToast()

    const fetchData = async () => {
        loading.value = true
        try {
            sensorData.value = await SensorService.fetchAllSensorStatus()
            lastUpdate.value = new Date().toLocaleString()
        } catch (error) {
            notify({ message: t('common.error'), color: 'danger' })
        } finally {
            loading.value = false
        }
    }

    // 定時輪詢
    const startPolling = (interval = 30000) => { /* ... */ }

    return {
        loading: readonly(loading),
        sensorData: readonly(sensorData),
        lastUpdate: readonly(lastUpdate),
        fetchData,
        startPolling
    }
}
```

#### **4. Vue 元件層 (`src/pages/monitoring/Overview.vue`)**
```vue
<template>
    <div class="sensor-overview">
        <div v-if="loading">{{ t('common.loading') }}</div>
        <div v-else>
            <!-- 使用 sensorData 渲染 UI -->
        </div>
    </div>
</template>

<script setup lang="ts">
// ✅ 組合 Composable，不直接呼叫 Service 或 API
const { loading, sensorData, lastUpdate, fetchData, startPolling } = useSensorOverview()

onMounted(() => {
    fetchData()
    startPolling()
})
</script>
```

### ⚠️ **架構禁止事項**

| 層級 | ❌ 禁止 | ✅ 應該 |
|------|--------|--------|
| **Vue 元件** | 直接呼叫 Service/API | 只使用 Composable |
| **Vue 元件** | 複雜業務邏輯 | 純 UI 渲染和事件處理 |
| **Composable** | 直接呼叫 API | 透過 Service 層 |
| **Service** | 使用 ref/reactive | 純函數，返回 Promise |
| **Service** | 直接操作 Toast/Router | 拋出錯誤讓 Composable 處理 |
| **API** | 業務邏輯 | 純 HTTP 請求封裝 |

---

## DemoBox 系統功能規格

> **後端 API**: Flask-based PaaS 平台，運行於 Port 3687
> **感測器資料庫**: PostgreSQL (heading, threading, heat_treatment 表)

### 功能模組總覽

| 模組 | 路由 | 狀態 | 說明 |
|------|------|------|------|
| 登入 | `/auth/login` | ✅ 已完成 | JWT 認證登入 |
| 機台總覽 | `/monitoring/overview` | 🔴 待開發 | 顯示所有機台狀態概覽 |
| 機台即時狀態 | `/monitoring/machine` | 🔴 待開發 | 單一機台即時數據 |
| 歷史資料 | `/history` | 🔴 待開發 | 歷史感測器數據查詢 |
| 帳號管理 | `/settings/users` | ✅ 已完成 | 用戶 CRUD 管理 |

---

### A. 登入頁 [auth] ✅ 已完成

- [x] 登入 [login]：使用者登入頁面
    - JWT Token 認證
    - 自動重導向至首頁

---

### B. 儀表板 [monitoring]

#### B-1. 機台總覽 [monitoringOverview] 🔴 待開發

> **路由**: `/monitoring/overview`
> **檔案**: `src/pages/monitoring/Overview.vue`

**UI 設計** (參考截圖)：

```
┌─────────────────────────────────────────────────────────────────┐
│  Home / 儀表板 / 機台總覽                    更新時間: YYYY-MM-DD HH:mm:ss │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    打頭     │  │    輾牙     │  │   熱處理    │             │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤             │
│  │ [Demo打頭] │  │ [Demo輾牙] │  │[Demo熱處理]│             │
│  │ [打頭2]    │  │ [輾牙2]    │  │ [熱處理2]  │             │
│  │ [打頭3]    │  │ [輾牙3]    │  │ [熱處理3]  │             │
│  │ ...        │  │ ...        │  │ ...        │             │
│  │ [打頭10]   │  │ [輾牙10]   │  │ [熱處理10] │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**功能需求**：

1. 顯示三種機台類型：打頭、輾牙、熱處理
2. 每種類型顯示 10 台機器 (可配置)
3. 機台狀態以顏色區分：
   - 🟢 綠色：運行中 (有資料回傳)
   - ⚪ 灰色：待機/離線 (無資料)
4. 自動更新時間戳顯示
5. 點擊機台可跳轉至該機台的即時狀態頁面

**API 需求**：

```typescript
// GET /api/TSC/sensors/status
// 取得所有感測器狀態
interface SensorStatusResponse {
  heading: SensorStatus[]      // 打頭機狀態
  threading: SensorStatus[]    // 輾牙機狀態
  heat_treatment: SensorStatus[] // 熱處理機狀態
}

interface SensorStatus {
  sensor_id: string
  sensor_name: string
  is_online: boolean
  last_update: string // ISO datetime
}
```

**技術實作**：

- 使用 CSS Grid 或 Flexbox 排列機台卡片
- 使用 VaCard 組件顯示每台機器
- 定時輪詢 API 更新狀態 (建議 30 秒)
- 可選：使用 WebSocket/SocketIO 即時更新

---

#### B-2. 機台即時狀態 [monitoringMachine] 🔴 待開發

> **路由**: `/monitoring/machine?type={type}&id={id}`
> **檔案**: `src/pages/monitoring/Machine.vue`

**UI 設計**：

```
┌─────────────────────────────────────────────────────────────────┐
│  Home / 儀表板 / 機台即時狀態                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  機台選擇：[打頭 ▼] [Demo打頭 ▼]                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 即時數據                                       🟢 運行中     ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │                                                             ││
│  │  [即時折線圖/儀表板顯示感測器數據]                            ││
│  │                                                             ││
│  │  溫度: 25.6°C    濕度: 60%    壓力: 1.2 bar                 ││
│  │  轉速: 1200 RPM  電流: 5.2 A  振動: 0.3 mm/s               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  最近 10 筆數據：                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 時間              | 溫度   | 濕度  | 壓力  | 轉速   | ...   ││
│  │ 2026-02-02 10:00 | 25.6°C | 60%   | 1.2   | 1200   | ...   ││
│  │ 2026-02-02 09:59 | 25.4°C | 61%   | 1.2   | 1198   | ...   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**功能需求**：

1. 機台類型和機台名稱選擇下拉框
2. 即時顯示感測器數據
3. 即時數據視覺化 (折線圖或儀表板)
4. 顯示最近 N 筆數據的表格
5. 自動更新 (輪詢或 WebSocket)

**API 需求**：

```typescript
// GET /api/TSC/sensors/{type}/{sensor_id}/realtime
// 取得單一感測器即時數據
interface SensorRealtimeResponse {
  sensor_id: string
  sensor_name: string
  sensor_type: 'heading' | 'threading' | 'heat_treatment'
  is_online: boolean
  current_data: SensorData
  recent_data: SensorData[] // 最近 10 筆
}

interface SensorData {
  timestamp: string
  // 根據 sensor 類型有不同的欄位
  [key: string]: number | string
}
```

**技術實作**：

- 使用 VaSelect 組件做機台選擇
- 使用 Chart.js 或 ECharts 做數據視覺化
- 使用 VaDataTable 顯示歷史數據
- 定時輪詢 API (建議 5 秒)

---

### C. 歷史資料 [history] 🔴 待開發

> **路由**: `/history`
> **檔案**: `src/pages/history/History.vue`

**UI 設計**：

```
┌─────────────────────────────────────────────────────────────────┐
│  Home / 歷史資料                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  查詢條件：                                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 機台類型：[打頭 ▼]  機台：[Demo打頭 ▼]                       ││
│  │ 時間範圍：[2026-02-01] ~ [2026-02-02]  [查詢] [匯出 Excel]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  查詢結果：                                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ [歷史數據折線圖]                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 時間              | 溫度   | 濕度  | 壓力  | 轉速   | ...   ││
│  │ 2026-02-02 10:00 | 25.6°C | 60%   | 1.2   | 1200   | ...   ││
│  │ ...               | ...    | ...   | ...   | ...    | ...   ││
│  │                                              [分頁: 1/10]   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**功能需求**：

1. 機台類型和機台名稱選擇
2. 時間範圍選擇 (日期區間)
3. 查詢按鈕執行查詢
4. 歷史數據圖表視覺化
5. 歷史數據表格 (支援分頁)
6. 匯出 Excel 功能

**API 需求**：

```typescript
// GET /api/TSC/sensors/{type}/{sensor_id}/history
// Query params: start_date, end_date, page, limit
interface SensorHistoryResponse {
  sensor_id: string
  sensor_name: string
  sensor_type: string
  data: SensorData[]
  pagination: {
    current_page: number
    total_pages: number
    total_records: number
    page_size: number
  }
}
```

**技術實作**：

- 使用 VaSelect 組件做機台選擇
- 使用 VaDatePicker 做日期範圍選擇
- 使用 Chart.js 或 ECharts 做歷史圖表
- 使用 VaDataTable 顯示數據 (支援分頁)
- 使用 xlsx 或 file-saver 做 Excel 匯出

---

### D. 系統設定 [settings]

#### D-1. 帳號管理 [settingsUsers] ✅ 已完成

> **路由**: `/settings/users`
> **檔案**: `src/pages/settings/users/UsersPage.vue`

- [x] 用戶列表查詢
- [x] 新增用戶
- [x] 編輯用戶
- [x] 刪除用戶

---

## 感測器數據結構參考

根據 PaaS 後端定義，三種感測器的數據欄位可能包含：

### 打頭機 (Heading)
```typescript
interface HeadingSensorData {
  timestamp: string
  temperature?: number    // 溫度
  pressure?: number       // 壓力
  speed?: number          // 轉速
  current?: number        // 電流
  vibration?: number      // 振動
  // 其他自定義欄位...
}
```

### 輾牙機 (Threading)
```typescript
interface ThreadingSensorData {
  timestamp: string
  temperature?: number
  torque?: number         // 扭力
  speed?: number
  thread_count?: number   // 輾牙數量
  // 其他自定義欄位...
}
```

### 熱處理機 (Heat Treatment)
```typescript
interface HeatTreatmentSensorData {
  timestamp: string
  temperature?: number
  humidity?: number       // 濕度
  heating_time?: number   // 加熱時間
  cooling_rate?: number   // 冷卻速率
  // 其他自定義欄位...
}
```

> **注意**: 實際欄位需參考後端 Sensor 註冊時的 `sensor_attr` 定義。

---

## 開發優先順序

1. ✅ 登入頁 (已完成)
2. ✅ 帳號管理 (已完成)
3. 🔴 **機台總覽** - 優先開發
4. 🔴 **機台即時狀態** - 次優先
5. 🔴 **歷史資料** - 第三優先
