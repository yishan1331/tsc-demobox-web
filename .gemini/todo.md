# MES 系統功能 TODO

## A. 即時監控[monitoring]

- [] 廠區作業[monitoringFactoryMap]：顯示廠區區域 image，圖片裡會有各個機台的區塊，該頁面是要顯示各機台的狀態
- [] 生產看板[monitoringProductionDashboard]：顯示線上生產中的進度，以 div、card 顯示
- [] 機台管理[monitoringMachineManagement]：使用 table 顯示資料，提供 CUD - 區域與機台編號

## B. 生產報工系統[productionReporting]

- [] 生產線報工[productionReportingLine]：提供 新增 資料
- [] 委外報工[productionReportingOutsourcing]：提供 新增 資料
- [] 工單查詢[productionReportingWorkOrder]：使用 table 顯示資料
- [] 報工報表[productionReportingDashboard]：資料統整顯示

## C. 線邊倉管[warehouse]

- [] 入倉驗收[warehouseReceiving]：使用 table 顯示資料，提供 CU - 驗收並記錄存放位置
- [] 領料[warehousePicking]：使用 table 顯示資料，提供 CU - 現場人員領料操作
- [] 物料移倉[warehouseTransfer]：使用 table 顯示資料，提供 U - 調整倉位設定
- [] 查詢[warehouseQuery]：使用 table 顯示資料 - 物料與倉位查詢

## D. 品管檢測[qualityControl]

- [] 首檢[qualityControlFirstArticle]：提供 新增 資料 - 首件產品檢查，由針車組長執行
- [] 巡檢[qualityControlPatrol]：提供 新增 資料 - 每日進行二次或四次產線巡檢
- [] 品檢[qualityControlFinal]：提供 新增 資料 - 品檢作業
- [] 品檢報告[qualityControlReport]：使用 table 顯示資料

## E. 智慧排程[scheduling]

- [] 排程作業[schedulingOperation]：製程單生成與排程資料讀取（每 15 天自動更新）
- [] 排程修改[schedulingAdjustment]：排程可手動調整以應對實際情況
- [] 排程查詢[schedulingQuery]：提供查詢與顯示功能
- [] 生產進度[schedulingProgress]：查詢與顯示實際生產進度

## F. 系統設定[settings]

- [x] 帳號管理[settingsUsers]：設定人員帳號與權限
- [] 按件計酬管理[settingsPiecework]：生產工件薪酬記錄
- [] ERP 更新（工單撥料）[settingsErpUpdate]：從凌越手動更新資料

## G. 登入頁[auth]

- [x] 登入[login]：使用者登入頁面
