import { generatePieceworkRecords } from './settings'

const generateWorkOrders = () => {
	const workOrders = []
	const statuses = ['pending', 'in-progress', 'completed', 'cancelled']
	const productNames = [
		'運動鞋組裝',
		'運動服飾製作',
		'球類製造',
		'健身器材組裝',
		'運動護具製作',
		'運動背包組裝',
	]
	const workers = ['王小明', '李小華', '張大同', '陳美麗', '林志強', '黃淑芬']
	const priorities = ['low', 'medium', 'high']

	for (let i = 1; i <= 25; i++) {
		const workOrderNo = `WO2025${String(i).padStart(3, '0')}`
		const processStep = Math.floor(Math.random() * 10) + 1
		const totalQuantity = Math.floor(Math.random() * 500) + 100
		const completedQuantity = Math.floor(Math.random() * totalQuantity)
		const createdTime = new Date(
			Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
		).toISOString()

		workOrders.push({
			workOrderNo,
			workOrderId: `WOI-${workOrderNo}`,
			orderNo: `ORD${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
			productName: productNames[Math.floor(Math.random() * productNames.length)],
			totalQuantity,
			completedQuantity,
			process: `工序${processStep}`,
			processStep,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			startTime:
				Math.random() > 0.3
					? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
					: null,
			endTime: Math.random() > 0.6 ? new Date().toISOString() : null,
			assignedWorker: workers[Math.floor(Math.random() * workers.length)],
			machineNo: `SM${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
			priority: priorities[Math.floor(Math.random() * priorities.length)],
			createdTime,
			updatedTime: new Date(
				new Date(createdTime).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
			).toISOString(),
			remark: Math.random() > 0.7 ? '優先處理' : null,
		})
	}

	return workOrders
}

const generateProductionReports = () => {
	const reports = []
	const statuses = ['working', 'paused', 'stopped', 'completed']
	const qualityStatuses = ['pass', 'fail', 'pending']
	const productNames = [
		'運動鞋組裝',
		'運動服飾製作',
		'球類製造',
		'健身器材組裝',
		'運動護具製作',
		'運動背包組裝',
	]
	const workers = [
		{ no: 'W001', name: '王小明' },
		{ no: 'W002', name: '李小華' },
		{ no: 'W003', name: '張大同' },
		{ no: 'W004', name: '陳美麗' },
		{ no: 'W005', name: '林志強' },
		{ no: 'W006', name: '黃淑芬' },
	]
	const machines = ['SM001', 'SM002', 'SM003', 'SM004', 'SM005']
	const stopReasons = ['運動器材故障', '運動材料不足', '品質異常', '人員調配', '臨時停機']

	for (let i = 1; i <= 30; i++) {
		const reportId = `RPT${String(i).padStart(4, '0')}`
		const workOrderNo = `WO2025${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`
		const processStep = Math.floor(Math.random() * 10) + 1
		const worker = workers[Math.floor(Math.random() * workers.length)]
		const completedQuantity = Math.floor(Math.random() * 200) + 10
		const workDuration = Math.floor(Math.random() * 480) + 60 // 60-540分鐘
		const status = statuses[Math.floor(Math.random() * statuses.length)]
		const qualityStatus = qualityStatuses[Math.floor(Math.random() * qualityStatuses.length)]
		const firstArticleCheck = Math.random() > 0.3
		const reportTime = new Date(
			Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
		).toISOString()
		const startTime = new Date(
			new Date(reportTime).getTime() - workDuration * 60 * 1000
		).toISOString()

		reports.push({
			reportId,
			workOrderNo,
			workOrderId: `WOI-${workOrderNo}`,
			productName: productNames[Math.floor(Math.random() * productNames.length)],
			processStep,
			processName: `工序${processStep}`,
			workerNo: worker.no,
			workerName: worker.name,
			machineNo:
				Math.random() > 0.2 ? machines[Math.floor(Math.random() * machines.length)] : null,
			startTime,
			endTime: status === 'completed' ? reportTime : null,
			workDuration: status === 'completed' ? workDuration : Math.floor(workDuration * 0.8),
			completedQuantity,
			qualityStatus,
			firstArticleCheck,
			firstArticleTime: firstArticleCheck
				? new Date(new Date(startTime).getTime() + 30 * 60 * 1000).toISOString()
				: null,
			firstArticleImage: firstArticleCheck ? '/images/first-article-sample.jpg' : null,
			pauseTime: status === 'paused' ? Math.floor(Math.random() * 60) + 5 : null,
			stopReason:
				status === 'stopped'
					? stopReasons[Math.floor(Math.random() * stopReasons.length)]
					: null,
			reportTime,
			status,
			remark: Math.random() > 0.7 ? '需要特別注意運動用品品質要求' : null,
		})
	}

	return reports
}

const generateInspectionItems = () => {
	const items = [
		{ id: 1, itemName: '外觀檢查', standard: '表面無刮痕、縫線平整', type: 'visual' },
		{ id: 2, itemName: '尺寸檢測', standard: '長度：270±3mm（運動鞋）', type: 'measurement' },
		{ id: 3, itemName: '重量檢測', standard: '重量：350±20g', type: 'measurement' },
		{ id: 4, itemName: '功能測試', standard: '彈性及抗壓測試合格', type: 'functional' },
		{ id: 5, itemName: '顏色檢查', standard: '顏色符合運動品牌色卡', type: 'visual' },
		{ id: 6, itemName: '材質檢測', standard: 'EVA運動材料', type: 'material' },
		{ id: 7, itemName: '包裝檢查', standard: '運動包裝完整無破損', type: 'visual' },
		{ id: 8, itemName: '標籤檢查', standard: '運動品牌標籤清晰完整', type: 'visual' },
	]

	return items
}

const generateInspectionReportsData = () => {
	const reports = []
	const inspectionTypes = ['首檢', '巡檢', '品檢']
	const results = ['合格', '不合格', '待檢']
	const inspectors = ['檢驗員A', '檢驗員B', '檢驗員C', '檢驗員D', '檢驗員E']
	const productNames = [
		'運動鞋組裝',
		'運動服飾製作',
		'球類製造',
		'健身器材組裝',
		'運動護具製作',
		'運動背包組裝',
	]

	for (let i = 1; i <= 50; i++) {
		const workOrderNo = `WO2025${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`
		const processNumber = Math.floor(Math.random() * 10) + 1
		const inspectionType = inspectionTypes[Math.floor(Math.random() * inspectionTypes.length)]
		const result = results[Math.floor(Math.random() * results.length)]
		const sampleSize = Math.floor(Math.random() * 20) + 5
		const passedCount = result === '合格' ? sampleSize : Math.floor(sampleSize * 0.8)

		reports.push({
			id: i,
			reportId: `QC${String(i).padStart(4, '0')}`,
			reportNo: `QC2025${String(i).padStart(4, '0')}`,
			workOrderNo,
			processNumber,
			processName: `工序${processNumber}`,
			productCode: `SP${workOrderNo.slice(-3)}`,
			productName: productNames[Math.floor(Math.random() * productNames.length)],
			inspectionType,
			inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
			sampleSize,
			passedCount,
			failedCount: sampleSize - passedCount,
			passRate: Math.round((passedCount / sampleSize) * 100),
			result,
			inspectionTime: new Date(
				Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
			).toISOString(),
			defectTypes: result === '不合格' ? ['縫線不良', '尺寸偏差', '材質不符'] : [],
			correctionActions: result === '不合格' ? ['重新縫製', '加強運動用品檢驗'] : [],
			remarks: Math.random() > 0.7 ? '需要持續關注運動用品品質標準' : '',
			createdAt: new Date(
				Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
			).toISOString(),
		})
	}

	return reports
}

const generateFirstArticleInspectionsData = () => {
	const inspections = []
	const productNames = [
		'運動鞋組裝',
		'運動服飾製作',
		'球類製造',
		'健身器材組裝',
		'運動護具製作',
		'運動背包組裝',
	]
	const inspectors = ['檢驗員A', '檢驗員B', '檢驗員C', '檢驗員D', '檢驗員E']
	const statuses = ['pending', 'completed', 'rejected']

	for (let i = 1; i <= 30; i++) {
		const workOrderNo = `WO2025${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`
		const processStep = Math.floor(Math.random() * 10) + 1
		const status = statuses[Math.floor(Math.random() * statuses.length)]

		inspections.push({
			id: i,
			workOrderNo,
			processStep,
			processName: `工序${processStep}`,
			productCode: `SP${workOrderNo.slice(-3)}`,
			productName: productNames[Math.floor(Math.random() * productNames.length)],
			inspector:
				status !== 'pending'
					? inspectors[Math.floor(Math.random() * inspectors.length)]
					: null,
			inspectionTime:
				status !== 'pending'
					? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
					: null,
			status,
			specifications: [
				'長度: 27-29cm (運動鞋)',
				'重量: 300-400g',
				'顏色: 依運動品牌規範',
				'材質: EVA運動材料',
			],
			inspectionItems: generateInspectionItems().map((item) => ({
				...item,
				result: status === 'completed' ? (Math.random() > 0.2 ? 'pass' : 'fail') : null,
				remarks: status === 'completed' && Math.random() > 0.7 ? '需要注意' : '',
			})),
			createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
		})
	}

	return inspections
}

const generateEmployeeUpdateRecords = () => {
	const records = []
	const updateTypes = ['personal_info', 'position', 'department', 'salary', 'skills', 'status']
	const updateStatuses = ['pending', 'approved', 'rejected', 'applied']
	const employeeNames = [
		'王小明',
		'李小華',
		'張大同',
		'陳美麗',
		'林志強',
		'黃淑芬',
		'趙大勇',
		'劉小萍',
		'楊志豪',
		'吳美慧',
	]
	const departments = ['生產部', '品管部', '倉儲部', '技術部', '管理部']
	const positions = ['操作員', '技術員', '品管員', '倉管員', '組長', '主管']

	for (let i = 1; i <= 30; i++) {
		const employeeName = employeeNames[Math.floor(Math.random() * employeeNames.length)]
		const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)]
		const updateStatus = updateStatuses[Math.floor(Math.random() * updateStatuses.length)]
		const requestTime = new Date(
			Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
		).toISOString()
		const processTime =
			updateStatus !== 'pending'
				? new Date(
						new Date(requestTime).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
					).toISOString()
				: null

		records.push({
			id: i,
			employeeId: `EMP${String(i).padStart(4, '0')}`,
			employeeName,
			updateType,
			updateStatus,
			requestTime,
			processTime,
			originalValue:
				updateType === 'position'
					? positions[Math.floor(Math.random() * positions.length)]
					: updateType === 'department'
						? departments[Math.floor(Math.random() * departments.length)]
						: updateType === 'salary'
							? `${Math.floor(Math.random() * 20000) + 30000}`
							: updateType === 'personal_info'
								? '原始個人信息'
								: '原始值',
			newValue:
				updateType === 'position'
					? positions[Math.floor(Math.random() * positions.length)]
					: updateType === 'department'
						? departments[Math.floor(Math.random() * departments.length)]
						: updateType === 'salary'
							? `${Math.floor(Math.random() * 20000) + 35000}`
							: updateType === 'personal_info'
								? '更新後個人信息'
								: '新值',
			requestReason: Math.random() > 0.3 ? '工作需要調整' : '績效考核結果',
			rejectReason: updateStatus === 'rejected' ? '資料不完整，需補充證明文件' : null,
			approver: updateStatus !== 'pending' ? 'admin' : null,
			appliedTime:
				updateStatus === 'applied'
					? new Date(
							new Date(processTime || requestTime).getTime() +
								Math.random() * 3 * 24 * 60 * 60 * 1000
						).toISOString()
					: null,
		})
	}

	return records
}

const generateErpUpdateRecords = () => {
	const records = []
	const updateTypes = ['material_allocation', 'work_order_sync', 'inventory_sync']
	const updateStatuses = ['pending', 'processing', 'completed', 'failed']
	const workOrderNos = Array.from(
		{ length: 20 },
		(_, i) => `WO2025${String(i + 1).padStart(3, '0')}`
	)

	for (let i = 1; i <= 25; i++) {
		const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)]
		const updateStatus = updateStatuses[Math.floor(Math.random() * updateStatuses.length)]
		const workOrderNo = workOrderNos[Math.floor(Math.random() * workOrderNos.length)]
		const updateTime = new Date(
			Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
		).toISOString()
		const completedTime =
			updateStatus === 'completed'
				? new Date(
						new Date(updateTime).getTime() + Math.random() * 2 * 60 * 60 * 1000
					).toISOString()
				: null

		records.push({
			id: i,
			updateId: `ERP${String(i).padStart(4, '0')}`,
			updateType,
			updateStatus,
			workOrderNo: updateType === 'material_allocation' ? workOrderNo : null,
			materialCode:
				updateType === 'material_allocation'
					? `SPM${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`
					: null,
			quantity:
				updateType === 'material_allocation'
					? Math.floor(Math.random() * 1000) + 100
					: null,
			syncData:
				updateType === 'work_order_sync'
					? '運動用品工單主檔同步'
					: updateType === 'inventory_sync'
						? '運動材料庫存數量同步'
						: '運動用品物料配置更新',
			updateTime,
			completedTime,
			errorMessage: updateStatus === 'failed' ? '運動用品ERP系統連線逾時，請稍後重試' : null,
			retryCount: updateStatus === 'failed' ? Math.floor(Math.random() * 3) + 1 : 0,
			processedBy: updateStatus !== 'pending' ? 'system' : null,
		})
	}

	return records
}

const generateInventoryItems = () => {
	const items = []
	const statuses = ['active', 'inactive', 'discontinued']
	const itemTypes = [
		{ name: '運動鞋底材', code: 'SOLE', category: 'raw-material', unit: 'pcs' },
		{ name: '運動布料', code: 'FABRIC', category: 'raw-material', unit: 'm' },
		{ name: '運動鞋面', code: 'UPPER', category: 'semifinished', unit: 'pcs' },
		{ name: '運動護具墊片', code: 'PAD', category: 'semifinished', unit: 'pcs' },
		{ name: '運動成品', code: 'SPORT', category: 'finished', unit: 'set' },
		{ name: '運動包裝盒', code: 'SBOX', category: 'consumable', unit: 'pcs' },
		{ name: '縫製針具', code: 'NEEDLE', category: 'tooling', unit: 'pcs' },
		{ name: '運動膠水', code: 'GLUE', category: 'consumable', unit: 'ml' },
		{ name: '彈性線材', code: 'THREAD', category: 'raw-material', unit: 'm' },
		{ name: '運動品牌標籤', code: 'SLBL', category: 'consumable', unit: 'pcs' },
	]
	const suppliers = ['供應商A', '供應商B', '供應商C', '外包廠D', '代工廠E']
	const locations = [
		'A區-1-1',
		'A區-1-2',
		'B區-2-1',
		'B區-2-2',
		'C區-3-1',
		'C區-3-2',
		'D區-4-1',
		'E區-5-1',
	]

	for (let i = 1; i <= 50; i++) {
		const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)]
		const currentStock = Math.floor(Math.random() * 1000) + 50
		const minStock = Math.floor(currentStock * 0.2) + 10
		const maxStock = Math.floor(currentStock * 1.5) + 100
		const averageCost = Math.floor(Math.random() * 500) + 10
		const totalValue = currentStock * averageCost
		const status = statuses[Math.floor(Math.random() * statuses.length)]
		const hasExpiry = itemType.category === 'consumable' && Math.random() > 0.5
		const hasBatch = Math.random() > 0.4

		const item = {
			itemId: `ITM${String(i).padStart(4, '0')}`,
			itemCode: `${itemType.code}${String(i).padStart(3, '0')}`,
			itemName: `${itemType.name}-${String(i).padStart(2, '0')}`,
			category: itemType.category,
			specification:
				Math.random() > 0.3
					? `規格: EU${Math.floor(Math.random() * 10) + 35}號 (運動鞋尺碼)`
					: null,
			unit: itemType.unit,
			currentStock,
			minStock,
			maxStock,
			averageCost,
			totalValue,
			location: locations[Math.floor(Math.random() * locations.length)],
			batchNo: hasBatch
				? `B${new Date().getFullYear()}${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`
				: null,
			expiryDate: hasExpiry
				? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split('T')[0]
				: null,
			supplierName:
				Math.random() > 0.2
					? suppliers[Math.floor(Math.random() * suppliers.length)]
					: null,
			lastInDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split('T')[0],
			lastOutDate:
				Math.random() > 0.3
					? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
							.toISOString()
							.split('T')[0]
					: null,
			status,
			remark: Math.random() > 0.8 ? '需要定期檢查運動用品品質狀況' : null,
		}

		items.push(item)
	}

	return items
}

export default [
	// ===== TSC/1.0/tables API - 通用資料表 API =====
	// GET /TSC/1.0/tables/:tableName - 查詢資料表
	{
		url: /\/mock\/api\/TSC\/1\.0\/tables\/(\w+)$/,
		method: 'get',
		response: ({ url, query }: { url: string; query: Record<string, string> }) => {
			const match = url.match(/\/mock\/api\/TSC\/1\.0\/tables\/(\w+)$/)
			const tableName = match ? match[1] : ''
			const page = parseInt(query.page) || 1
			const limit = parseInt(query.limit) || 10

			// 模擬不同資料表的回應
			const mockData: Record<string, any[]> = {
				users: [
					{
						user_id: 1,
						username: 'admin',
						full_name: '管理者',
						role: 'ADMIN',
						status: 'active',
					},
					{
						user_id: 2,
						username: 'operator',
						full_name: '操作員',
						role: 'OPERATOR',
						status: 'active',
					},
				],
				sensors: [
					{ sensor_id: 'heading_demo', sensor_name: '打頭 Demo', sensor_type: 'heading' },
					{ sensor_id: 'threading_demo', sensor_name: '輾牙 Demo', sensor_type: 'threading' },
				],
			}

			const data = mockData[tableName] || []

			return {
				Response: 'success',
				Data: data,
				Pagination: {
					page,
					per_page: limit,
					total: data.length,
					total_pages: Math.ceil(data.length / limit),
				},
			}
		},
	},
	// PATCH /TSC/1.0/tables/:tableName/:id - 更新資料表記錄
	{
		url: /\/mock\/api\/TSC\/1\.0\/tables\/(\w+)\/(\w+)$/,
		method: 'patch',
		response: () => {
			return {
				Response: 'success',
				Data: {
					message: 'Record updated successfully',
				},
			}
		},
	},
	// 通用分頁查詢 API - 處理工單查詢、品檢報告查詢等
	{
		url: '/mock/CommonPaginationQuery',
		method: 'post',
		response: (params: any) => {
			const {
				table,
				page = 1,
				perPage = 10,
				sortBy,
				sortingOrder,
				...filters
			} = params.body || {}

			// 處理工單表查詢
			if (table === 'work_orders') {
				const allWorkOrders = generateWorkOrders()
				let filteredData = allWorkOrders

				// 應用篩選條件
				if (filters.workOrderNo) {
					filteredData = filteredData.filter((item) =>
						item.workOrderNo.toLowerCase().includes(filters.workOrderNo.toLowerCase())
					)
				}
				if (filters.productName) {
					filteredData = filteredData.filter((item) =>
						item.productName.includes(filters.productName)
					)
				}
				if (filters.status) {
					filteredData = filteredData.filter((item) => item.status === filters.status)
				}
				if (filters.assignedWorker) {
					filteredData = filteredData.filter((item) =>
						item.assignedWorker?.includes(filters.assignedWorker)
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			// 處理生產報工表查詢
			if (table === 'production_report') {
				const allReports = generateProductionReports()
				let filteredData = allReports

				// 應用篩選條件
				if (filters.workOrderNo) {
					filteredData = filteredData.filter((item) =>
						item.workOrderNo.toLowerCase().includes(filters.workOrderNo.toLowerCase())
					)
				}
				if (filters.workerName) {
					filteredData = filteredData.filter((item) =>
						item.workerName.includes(filters.workerName)
					)
				}
				if (filters.status) {
					filteredData = filteredData.filter((item) => item.status === filters.status)
				}
				if (filters.qualityStatus) {
					filteredData = filteredData.filter(
						(item) => item.qualityStatus === filters.qualityStatus
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			// 處理庫存查詢表
			if (table === 'inventory') {
				const allItems = generateInventoryItems()
				let filteredData = allItems

				// 應用篩選條件
				if (filters.itemCode) {
					filteredData = filteredData.filter((item) =>
						item.itemCode.toLowerCase().includes(filters.itemCode.toLowerCase())
					)
				}
				if (filters.itemName) {
					filteredData = filteredData.filter((item) =>
						item.itemName.toLowerCase().includes(filters.itemName.toLowerCase())
					)
				}
				if (filters.category) {
					filteredData = filteredData.filter((item) => item.category === filters.category)
				}
				if (filters.location) {
					filteredData = filteredData.filter((item) =>
						item.location.toLowerCase().includes(filters.location.toLowerCase())
					)
				}
				if (filters.status) {
					filteredData = filteredData.filter((item) => item.status === filters.status)
				}
				if (filters.supplierName) {
					filteredData = filteredData.filter((item) =>
						item.supplierName
							?.toLowerCase()
							.includes(filters.supplierName.toLowerCase())
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			if (table === 'inspection_report') {
				const allReports = generateInspectionReportsData()
				let filteredData = allReports

				// 應用篩選條件
				if (filters.reportNo) {
					filteredData = filteredData.filter((item) =>
						item.reportNo.toLowerCase().includes(filters.reportNo.toLowerCase())
					)
				}
				if (filters.workOrderNo) {
					filteredData = filteredData.filter((item) =>
						item.workOrderNo.toLowerCase().includes(filters.workOrderNo.toLowerCase())
					)
				}
				if (filters.inspectionType) {
					filteredData = filteredData.filter(
						(item) => item.inspectionType === filters.inspectionType
					)
				}
				if (filters.result) {
					filteredData = filteredData.filter((item) => item.result === filters.result)
				}
				if (filters.inspector) {
					filteredData = filteredData.filter((item) =>
						item.inspector.includes(filters.inspector)
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			if (table === 'first_article_inspection') {
				const allInspections = generateFirstArticleInspectionsData()
				let filteredData = allInspections

				// 應用篩選條件
				if (filters.workOrderNo) {
					filteredData = filteredData.filter((item) =>
						item.workOrderNo.toLowerCase().includes(filters.workOrderNo.toLowerCase())
					)
				}
				if (filters.productName) {
					filteredData = filteredData.filter((item) =>
						item.productName.includes(filters.productName)
					)
				}
				if (filters.status) {
					filteredData = filteredData.filter((item) => item.status === filters.status)
				}
				if (filters.inspector) {
					filteredData = filteredData.filter((item) =>
						item.inspector?.includes(filters.inspector)
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			// 處理員工更新記錄查詢
			if (table === 'employee_update_records') {
				const allRecords = generateEmployeeUpdateRecords()
				let filteredData = allRecords

				// 應用篩選條件
				if (filters.employeeId) {
					filteredData = filteredData.filter((item) =>
						item.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
					)
				}
				if (filters.updateType) {
					filteredData = filteredData.filter(
						(item) => item.updateType === filters.updateType
					)
				}
				if (filters.updateStatus) {
					filteredData = filteredData.filter(
						(item) => item.updateStatus === filters.updateStatus
					)
				}
				if (filters.requestTime) {
					filteredData = filteredData.filter((item) =>
						item.requestTime.includes(filters.requestTime)
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			// 處理ERP更新記錄查詢
			if (table === 'erp_update_records') {
				const allRecords = generateErpUpdateRecords()
				let filteredData = allRecords

				// 應用篩選條件
				if (filters.updateType) {
					filteredData = filteredData.filter(
						(item) => item.updateType === filters.updateType
					)
				}
				if (filters.updateStatus) {
					filteredData = filteredData.filter(
						(item) => item.updateStatus === filters.updateStatus
					)
				}
				if (filters.workOrderNo) {
					filteredData = filteredData.filter((item) =>
						item.workOrderNo?.toLowerCase().includes(filters.workOrderNo.toLowerCase())
					)
				}
				if (filters.updateTime) {
					filteredData = filteredData.filter((item) =>
						item.updateTime.includes(filters.updateTime)
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			// 處理按件計酬記錄查詢
			if (table === 'piecework_records') {
				const allRecords = generatePieceworkRecords()
				let filteredData = allRecords

				// 應用篩選條件
				if (filters.employeeId) {
					filteredData = filteredData.filter((item) =>
						item.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
					)
				}
				if (filters.workOrderNo) {
					filteredData = filteredData.filter((item) =>
						item.workOrderNo.toLowerCase().includes(filters.workOrderNo.toLowerCase())
					)
				}
				if (filters.status) {
					filteredData = filteredData.filter((item) => item.status === filters.status)
				}
				if (filters.workDate) {
					filteredData = filteredData.filter((item) =>
						item.workDate.includes(filters.workDate)
					)
				}

				// 應用排序
				if (sortBy) {
					filteredData.sort((a, b) => {
						const aValue = a[sortBy as keyof typeof a]
						const bValue = b[sortBy as keyof typeof b]

						if (aValue == null) return 1
						if (bValue == null) return -1

						let comparison = 0
						if (aValue < bValue) comparison = -1
						if (aValue > bValue) comparison = 1

						return sortingOrder === 'desc' ? -comparison : comparison
					})
				}

				// 應用分頁
				const startIndex = (page - 1) * perPage
				const endIndex = startIndex + perPage
				const paginatedData = filteredData.slice(startIndex, endIndex)

				return {
					Response: 'success',
					Data: paginatedData,
					pagination: {
						page,
						perPage,
						total: filteredData.length,
						totalPages: Math.ceil(filteredData.length / perPage),
					},
				}
			}

			// 處理按件計酬配置查詢
			if (table === 'piecework_rate_configs') {
				const rateConfigs = [
					{
						id: 1,
						processName: '運動材料裁切',
						unitRate: 8,
						effectiveDate: '2025-01-01',
						status: 'active',
					},
					{
						id: 2,
						processName: '運動服飾縫製',
						unitRate: 12,
						effectiveDate: '2025-01-01',
						status: 'active',
					},
					{
						id: 3,
						processName: '運動器材組裝',
						unitRate: 15,
						effectiveDate: '2025-01-01',
						status: 'active',
					},
					{
						id: 4,
						processName: '運動用品包裝',
						unitRate: 6,
						effectiveDate: '2025-01-01',
						status: 'active',
					},
					{
						id: 5,
						processName: '運動品質檢驗',
						unitRate: 10,
						effectiveDate: '2025-01-01',
						status: 'active',
					},
					{
						id: 6,
						processName: '運動服飾整燙',
						unitRate: 9,
						effectiveDate: '2025-01-01',
						status: 'active',
					},
				]

				return {
					Response: 'success',
					Data: rateConfigs,
					pagination: {
						page: 1,
						perPage: 10,
						total: rateConfigs.length,
						totalPages: 1,
					},
				}
			}

			if (table == 'users') {
				return {
					Response: 'success',
					Data: [
						{
							createTime: '2024-12-22 13:12:59',
							creatorNo: 1,
							email: null,
							levelNo: 0,
							modifierNo: 1,
							pwd: 'ca4cc4960fbb21b4352828e472e1c268',
							remark: '\u50c5\u9650\u611f\u6e2c\u5668\u4f7f\u7528',
							sensorAreaSetting: 1,
							status: 99,
							updateTime: '2024-12-22 13:12:59',
							userID: 'area_b',
							userName: 'area_b',
							userNo: 6,
						},
						{
							createTime: '2024-12-22 13:12:42',
							creatorNo: 1,
							email: null,
							levelNo: 0,
							modifierNo: 1,
							pwd: '705cad8f1ae82df517cae51014a2a896',
							remark: '\u50c5\u9650\u611f\u6e2c\u5668\u4f7f\u7528',
							sensorAreaSetting: 1,
							status: 99,
							updateTime: '2024-12-22 13:12:42',
							userID: 'area_a',
							userName: 'area_a',
							userNo: 5,
						},
						{
							createTime: '2024-11-23 23:03:12',
							creatorNo: 1,
							email: null,
							levelNo: 3,
							modifierNo: 1,
							pwd: '1ac1ac8dc2fab7eed92d68ae8a0cfb83',
							remark: null,
							sensorAreaSetting: 1,
							status: 0,
							updateTime: '2024-11-23 23:05:36',
							userID: 'eric',
							userName: 'Eric',
							userNo: 2,
						},
						{
							createTime: '2024-11-23 14:35:17',
							creatorNo: null,
							email: null,
							levelNo: 1,
							modifierNo: null,
							pwd: '393e89b91ac4a14b6d38681db1a6e61c',
							remark: null,
							sensorAreaSetting: 1,
							status: 0,
							updateTime: '2024-11-23 14:35:17',
							userID: 'admin',
							userName: '\u7ba1\u7406\u8005',
							userNo: 1,
						},
						{
							createTime: '2024-11-23 14:35:17',
							creatorNo: 1,
							email: null,
							levelNo: 1,
							modifierNo: 1,
							pwd: '5f22611a53edee6c060f37286f2c4d8f',
							remark: null,
							sensorAreaSetting: 1,
							status: 0,
							updateTime: '2024-11-23 14:35:17',
							userID: 'devwei',
							userName: 'wei',
							userNo: 3,
						},
					],
					pagination: {
						page: 1,
						perPage: 10,
						total: 5,
						totalPages: 1,
					},
				}
			}

			if (table == 'access_permissions') {
				return {
					Response: 'success',
					Data: [
						{
							accessList:
								'{"dashboard":{"authority": false, "children": {"overview":{"authority": false}, "realtime":{"authority": false}}}, "logging":{"authority": false, "children":{"apiLogs":{"authority": false}, "systemLogs":{"authority": false}, "sensorLogs":{"authority": false, "children":{"errorMsg":{"authority": false}, "historyMsg":{"authority": false}}}}}, "settings":{"authority": false, "children": {"user":{"authority": false}, "permission":{"authority": false}, "sensorArea":{"authority": false}}}}',
							createTime: '2024-11-23 22:58:47',
							creatorNo: null,
							levelInfo: '\u7121\u4efb\u4f55\u6b0a\u9650',
							levelName: '\u96f6\u7d1a',
							levelNo: 0,
							modifierNo: null,
							remark: null,
							updateTime: '2024-11-23 22:59:30',
						},
						{
							accessList:
								'{"dashboard":{"authority": true, "children": {"overview":{"authority": true}, "realtime":{"authority": true}}}, "logging":{"authority": true, "children":{"apiLogs":{"authority": true}, "systemLogs":{"authority": true}, "sensorLogs":{"authority": true, "children":{"errorMsg":{"authority": true}, "historyMsg":{"authority": true}}}}}, "settings":{"authority": true, "children": {"user":{"authority": true}, "permission":{"authority": true}, "sensorArea":{"authority": true}}}}',
							createTime: '2024-11-22 21:11:54',
							creatorNo: null,
							levelInfo: '\u6700\u5927\u6b0a\u9650',
							levelName: 'A\u7d1a',
							levelNo: 1,
							modifierNo: null,
							remark: '',
							updateTime: '2024-11-23 14:35:57',
						},
						{
							accessList:
								'{"dashboard":{"authority": true, "children": {"overview":{"authority": true}, "realtime":{"authority": true}}}, "logging":{"authority": true, "children":{"apiLogs":{"authority": true}, "systemLogs":{"authority": true}, "sensorLogs":{"authority": true, "children":{"errorMsg":{"authority": true}, "historyMsg":{"authority": true}}}}}, "settings":{"authority": false, "children": {"user":{"authority": false}, "permission":{"authority": false}, "sensorArea":{"authority": false}}}}',
							createTime: '2024-11-23 23:02:07',
							creatorNo: null,
							levelInfo: null,
							levelName: 'B\u7d1a',
							levelNo: 2,
							modifierNo: null,
							remark: null,
							updateTime: '2024-11-23 23:02:07',
						},
						{
							accessList:
								'{"dashboard":{"authority": true, "children": {"overview":{"authority": true}, "realtime":{"authority": true}}}, "logging":{"authority": false, "children":{"apiLogs":{"authority": false}, "systemLogs":{"authority": false}, "sensorLogs":{"authority": false, "children":{"errorMsg":{"authority": false}, "historyMsg":{"authority": false}}}}}, "settings":{"authority": false, "children": {"user":{"authority": false}, "permission":{"authority": false}, "sensorArea":{"authority": false}}}}',
							createTime: '2024-11-23 23:02:07',
							creatorNo: null,
							levelInfo: null,
							levelName: 'C\u7d1a',
							levelNo: 3,
							modifierNo: null,
							remark: null,
							updateTime: '2024-11-23 23:02:07',
						},
					],
					pagination: {
						page: 1,
						perPage: 10,
						total: 4,
						totalPages: 1,
					},
				}
			}

			// 預設回應
			return {
				Response: 'success',
				Data: [],
				pagination: {
					page: 1,
					perPage: 10,
					total: 0,
					totalPages: 0,
				},
			}
		},
	},
	// CommonQueryIntervalData - 獲取單一品檢報告
	{
		url: '/mock/CommonQueryIntervalData',
		method: 'post',
		response: (params: any) => {
			const { table, attr, valueStart } = params.body || {}

			if (table === 'inspection_report' && attr === 'reportId') {
				const allReports = generateInspectionReportsData()
				const report = allReports.find((r) => r.reportId === valueStart)

				if (report) {
					return {
						Response: 'success',
						Data: report,
					}
				}
			}

			return {
				Response: 'error',
				Data: null,
			}
		},
	},

	// 處理員工同步日誌查詢
	// {
	// 	url: '/mock/CommonPaginationQuery',
	// 	method: 'post',
	// 	response: (params: any) => {
	// 		const { table } = params.body || {}

	// 		if (table === 'employee_sync_logs') {
	// 			const syncLogs = [
	// 				{
	// 					id: 1,
	// 					syncType: 'incremental',
	// 					startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
	// 					endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
	// 					totalEmployees: 150,
	// 					newEmployees: 5,
	// 					updatedEmployees: 12,
	// 					status: 'completed',
	// 					triggeredBy: 'admin',
	// 				},
	// 				{
	// 					id: 2,
	// 					syncType: 'full',
	// 					startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
	// 					endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
	// 					totalEmployees: 150,
	// 					newEmployees: 0,
	// 					updatedEmployees: 45,
	// 					status: 'completed',
	// 					triggeredBy: 'system',
	// 				},
	// 			]

	// 			return {
	// 				status: 200,
	// 				Data: {
	// 					Response: 'ok',
	// 					QueryTableData: syncLogs,
	// 					FilterCounts: syncLogs.length,
	// 				},
	// 			}
	// 		}

	// 		if (table === 'erp_sync_logs') {
	// 			const syncLogs = [
	// 				{
	// 					id: 1,
	// 					syncType: 'incremental',
	// 					startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
	// 					endTime: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
	// 					totalRecords: 500,
	// 					successCount: 485,
	// 					failedCount: 15,
	// 					status: 'completed',
	// 					triggeredBy: 'admin',
	// 				},
	// 				{
	// 					id: 2,
	// 					syncType: 'full',
	// 					startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
	// 					endTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
	// 					totalRecords: 2000,
	// 					successCount: 1990,
	// 					failedCount: 10,
	// 					status: 'completed',
	// 					triggeredBy: 'system',
	// 				},
	// 			]

	// 			return {
	// 				status: 200,
	// 				Data: {
	// 					Response: 'ok',
	// 					QueryTableData: syncLogs,
	// 					FilterCounts: syncLogs.length,
	// 				},
	// 			}
	// 		}

	// 		return {
	// 			status: 200,
	// 			Data: {
	// 				Response: 'ok',
	// 				QueryTableData: [],
	// 				FilterCounts: 0,
	// 			},
	// 		}
	// 	},
	// },
]
