# VaIcon 使用指南

## 📋 概述

專案已全域修正了 VaIcon 的 Material Icons 顯示問題。現在整個專案都可以正常使用 VaIcon 組件。

## 🔧 修正內容

- 在 `src/scss/main.scss` 中添加了全域 CSS 修正
- 解決了 Vue scoped CSS 與 Material Icons 的衝突問題
- Material Icons 字體已在 `index.html` 中正確載入

## 🎯 常用圖示名稱

### ✅ 狀態圖示

```vue
<!-- 成功/完成 -->
<VaIcon name="check_circle" color="success" />
<VaIcon name="done" color="success" />

<!-- 錯誤/取消 -->
<VaIcon name="cancel" color="danger" />
<VaIcon name="error" color="danger" />
<VaIcon name="close" color="danger" />

<!-- 警告 -->
<VaIcon name="warning" color="warning" />
<VaIcon name="info" color="info" />
```

### 📄 功能圖示

```vue
<!-- 搜尋 -->
<VaIcon name="search" />

<!-- 編輯/設定 -->
<VaIcon name="edit" />
<VaIcon name="settings" />

<!-- 檔案/圖片 -->
<VaIcon name="image" />
<VaIcon name="folder" />
<VaIcon name="description" />

<!-- 導覽 -->
<VaIcon name="home" />
<VaIcon name="menu" />
<VaIcon name="arrow_back" />
<VaIcon name="arrow_forward" />
```

### ⏰ 時間/動作圖示

```vue
<!-- 時間 -->
<VaIcon name="schedule" />
<VaIcon name="access_time" />

<!-- 播放控制 -->
<VaIcon name="play_arrow" />
<VaIcon name="pause" />
<VaIcon name="stop" />
```

## 💡 使用方式

```vue
<template>
	<!-- 基本用法 -->
	<VaIcon name="圖示名稱" />

	<!-- 帶顏色和大小 -->
	<VaIcon name="check_circle" color="success" size="24px" />

	<!-- 動態圖示 -->
	<VaIcon
		:name="isCompleted ? 'check_circle' : 'cancel'"
		:color="isCompleted ? 'success' : 'danger'"
	/>
</template>
```

## 🚀 測試

如果圖示無法顯示，請檢查：

1. **圖示名稱**：使用正確的 Material Icons 名稱
2. **瀏覽器控制台**：查看是否有字體載入錯誤
3. **CSS 衝突**：確認沒有其他 CSS 覆蓋圖示樣式

## 📚 更多圖示

完整的 Material Icons 列表：https://fonts.google.com/icons
