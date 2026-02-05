import { MockMethod } from 'vite-plugin-mock'

export const generatePieceworkRecords = () => {
	const records: any[] = []
	const workers = [
		{ name: '王小明', id: 'EMP0001' },
		{ name: '李小華', id: 'EMP0002' },
		{ name: '張大同', id: 'EMP0003' },
		{ name: '陳美麗', id: 'EMP0004' },
		{ name: '林志強', id: 'EMP0005' },
		{ name: '黃淑芬', id: 'EMP0006' },
		{ name: '劉建國', id: 'EMP0007' },
		{ name: '吳雅婷', id: 'EMP0008' },
	]
	const processes = [
		'鞋面裁切',
		'鞋底成型',
		'球拍穿線',
		'護膝縫製',
		'運動服印刷',
		'背包組裝',
		'品質檢測',
		'包裝作業',
	]
	const products = ['運動鞋', '籃球', '網球拍', '護膝', '運動T恤', '運動背包', '足球', '羽球拍']
	const countries = ['台灣', '中國', '越南', '印尼', '泰國']

	// 為每個員工生成多筆記錄，確保每個人都有資料
	workers.forEach((worker, workerIndex) => {
		const recordsPerWorker = Math.floor(Math.random() * 8) + 5 // 每人5-12筆記錄

		for (let j = 0; j < recordsPerWorker; j++) {
			const i = workerIndex * 10 + j + 1
			const workOrderNo = `WO2025${String(Math.floor(Math.random() * 30) + 1).padStart(3, '0')}`
			const processName = processes[Math.floor(Math.random() * processes.length)]
			const productName = products[Math.floor(Math.random() * products.length)]
			const quantity = Math.floor(Math.random() * 100) + 20
			const unitPrice = Math.floor(Math.random() * 50) + 10
			const totalAmount = quantity * unitPrice
			const workDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
			const country = countries[Math.floor(Math.random() * countries.length)]

			records.push({
				id: i,
				recordNo: `PC2025${String(i).padStart(4, '0')}`,
				workerName: worker.name,
				employeeId: worker.id, // 使用固定的員工ID
				workerId: worker.id, // 向下相容
				employeeName: worker.name, // 額外加上employeeName欄位
				department: '製造部',
				workOrderNo,
				productName,
				processName,
				processCode: `SP${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
				quantity,
				unitPrice,
				totalAmount,
				workDate: workDate.toISOString().split('T')[0], // 只保留日期部分
				workHours: Math.floor(Math.random() * 8) + 1,
				efficiency: Math.floor(Math.random() * 40) + 80, // 80-120%
				qualityGrade: Math.random() > 0.1 ? 'A' : Math.random() > 0.5 ? 'B' : 'C',
				overtime: Math.random() > 0.7,
				overtimeHours: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0,
				bonus: Math.random() > 0.8 ? Math.floor(Math.random() * 500) + 100 : 0,
				deduction: Math.random() > 0.9 ? Math.floor(Math.random() * 200) + 50 : 0,
				status: Math.random() > 0.1 ? '已確認' : '待確認',
				country,
				subtotal: totalAmount,
				confirmedBy:
					Math.random() > 0.2 ? `主管${Math.floor(Math.random() * 3) + 1}` : null,
				confirmedAt:
					Math.random() > 0.2
						? new Date(workDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
						: null,
				remarks: Math.random() > 0.8 ? '運動用品趕急單' : '',
				createdAt: workDate.toISOString(),
			})
		}
	})

	return records
}

const generateErpUpdateRecords = () => {
	const records: any[] = []
	const protocols = ['HTTP', 'HTTPS', 'FTP', 'SFTP']
	const ips = ['192.168.1.100', '10.0.0.50', '172.16.10.25', '192.168.100.200', '10.1.1.150']
	const ports = [8080, 443, 80, 21, 22]
	const dataTypes = ['users', 'process', 'workorder', 'material', 'product']
	const dataTypeDescriptions = {
		users: '使用者資料同步至ERP系統',
		process: '製程資料更新至生產管理模組',
		workorder: '工單資料傳送至訂單管理系統',
		material: '物料資訊同步至庫存管理系統',
		product: '產品資料更新至產品資訊管理系統',
	}

	// 確保每種資料類型都有一筆記錄
	dataTypes.forEach((dataType, index) => {
		const protocol = protocols[index % protocols.length]
		const ip = ips[index % ips.length]
		const port = ports[index % ports.length]

		records.push({
			id: index + 1,
			protocol,
			ip,
			port,
			uri: `/api/erp/${dataType}/sync`,
			parameters: `token=auth_key&format=json&type=${dataType}`,
			description: dataTypeDescriptions[dataType as keyof typeof dataTypeDescriptions],
			dataType,
			lastUpdateTime: new Date(
				Date.now() - Math.random() * 24 * 60 * 60 * 1000
			).toISOString(),
			status: Math.random() > 0.8 ? 'failed' : 'active',
			createdAt: new Date(
				Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
			).toISOString(),
		})
	})

	return records
}

const generateEmployeeUpdateRecords = () => {
	const records: any[] = []
	const updateTypes = ['新增員工', '異動資料', '離職處理', '薪資調整', '部門調動']
	const statuses = ['已處理', '處理中', '待審核', '已駁回']
	const departments = [
		'鞋類製造部',
		'球類用品部',
		'運動服飾部',
		'護具製造部',
		'包裝部',
		'管理部',
		'人事部',
	]
	const positions = [
		'運動用品作業員',
		'體育用品技術員',
		'生產組長',
		'製造主管',
		'運動用品工程師',
		'體育用品經理',
	]
	const workers = [
		'王小明',
		'李小華',
		'張大同',
		'陳美麗',
		'林志強',
		'黃淑芬',
		'劉建國',
		'吳雅婷',
		'許志明',
		'蔡美玲',
	]

	for (let i = 1; i <= 35; i++) {
		const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)]
		const status = statuses[Math.floor(Math.random() * statuses.length)]
		const updateTime = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)

		records.push({
			id: i,
			updateId: `EMP2025${String(i).padStart(4, '0')}`,
			employeeId: `EMP${String(Math.floor(Math.random() * 200) + 1).padStart(3, '0')}`,
			employeeName: workers[Math.floor(Math.random() * workers.length)],
			updateType,
			department: departments[Math.floor(Math.random() * departments.length)],
			position: positions[Math.floor(Math.random() * positions.length)],
			oldData: updateType === '異動資料' ? '舊部門：鞋類製造部' : null,
			newData: updateType === '異動資料' ? '新部門：球類用品部' : null,
			effectiveDate: new Date(
				updateTime.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
			).toISOString(),
			status,
			requestedBy: `人事專員${Math.floor(Math.random() * 3) + 1}`,
			approvedBy: status === '已處理' ? `人事主管${Math.floor(Math.random() * 2) + 1}` : null,
			requestTime: updateTime.toISOString(),
			processedTime:
				status === '已處理'
					? new Date(
							updateTime.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
						).toISOString()
					: null,
			reason: '運動用品生產線組織調整需要',
			attachments: Math.random() > 0.7 ? ['身分證影本.pdf', '在職證明.pdf'] : [],
			priority: Math.random() > 0.8 ? '高' : Math.random() > 0.5 ? '中' : '低',
			remarks: Math.random() > 0.8 ? '運動用品旺季緊急處理' : '',
			createdAt: updateTime.toISOString(),
		})
	}

	return records
}

export default [
	// 按件計酬管理
	{
		url: '/mock/api/settings/piecework/records',
		method: 'get',
		response: (params: any) => {
			const { page = 1, pageSize = 10, filters = {} } = params.query || {}
			const allRecords = generatePieceworkRecords()

			let filteredRecords = allRecords

			if (filters.workerName) {
				filteredRecords = filteredRecords.filter((r) =>
					r.workerName.includes(filters.workerName)
				)
			}

			if (filters.workOrderNo) {
				filteredRecords = filteredRecords.filter((r) =>
					r.workOrderNo.includes(filters.workOrderNo)
				)
			}

			if (filters.department) {
				filteredRecords = filteredRecords.filter((r) => r.department === filters.department)
			}

			if (filters.status) {
				filteredRecords = filteredRecords.filter((r) => r.status === filters.status)
			}

			if (filters.dateRange) {
				const { startDate, endDate } = filters.dateRange
				filteredRecords = filteredRecords.filter((r) => {
					const workDate = new Date(r.workDate)
					return workDate >= new Date(startDate) && workDate <= new Date(endDate)
				})
			}

			const startIndex = (page - 1) * pageSize
			const endIndex = startIndex + pageSize
			const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

			return {
				Response: 'success',
				Data: paginatedRecords,
				pagination: {
					page,
					perPage: pageSize,
					total: filteredRecords.length,
					totalPages: Math.ceil(filteredRecords.length / pageSize),
				},
			}
		},
	},
	// 確認按件計酬
	{
		url: '/mock/api/settings/piecework/confirm',
		method: 'post',
		response: (params: any) => {
			const { recordId, confirmerId } = params.body || {}

			return {
				Response: 'success',
				Data: {
					recordId,
					confirmerId,
					confirmedAt: new Date().toISOString(),
					status: '已確認',
				},
			}
		},
	},
	// 按件計酬統計
	{
		url: '/mock/api/settings/piecework/stats',
		method: 'post',
		response: (params: any) => {
			const { dateRange } = params.body || {}
			const records = generatePieceworkRecords()

			let filteredRecords = records
			if (dateRange) {
				const { startDate, endDate } = dateRange
				filteredRecords = records.filter((r) => {
					const workDate = new Date(r.workDate)
					return workDate >= new Date(startDate) && workDate <= new Date(endDate)
				})
			}

			const totalRecords = filteredRecords.length
			const totalAmount = filteredRecords.reduce((sum, r) => sum + r.totalAmount, 0)
			const confirmedRecords = filteredRecords.filter((r) => r.status === '已確認').length
			const pendingRecords = totalRecords - confirmedRecords
			const averageAmount = Math.round(totalAmount / totalRecords)

			return {
				Response: 'success',
				Data: {
					totalRecords,
					confirmedRecords,
					pendingRecords,
					totalAmount,
					averageAmount,
					confirmationRate: Math.round((confirmedRecords / totalRecords) * 100),
				},
			}
		},
	},
	// ERP更新（工單撥料）
	{
		url: '/mock/api/settings/erp-update/legacy-records',
		method: 'post',
	},
	// ERP更新記錄 - 新的API路徑
	{
		url: '/mock/api/settings/erp-update/records',
		method: 'get',
		response: (params: any) => {
			const { page = 1, perPage = 10 } = params.query || {}
			const allRecords = generateErpUpdateRecords()
			let filteredRecords = allRecords

			// 根據新的資料格式進行過濾
			const filters = params.query || {}
			if (filters.protocol) {
				filteredRecords = filteredRecords.filter((r) => r.protocol === filters.protocol)
			}
			if (filters.ip) {
				filteredRecords = filteredRecords.filter((r) => r.ip.includes(filters.ip))
			}
			if (filters.port) {
				filteredRecords = filteredRecords.filter(
					(r) => r.port.toString() === filters.port.toString()
				)
			}
			if (filters.dataType) {
				filteredRecords = filteredRecords.filter((r) => r.dataType === filters.dataType)
			}

			const startIndex = (page - 1) * perPage
			const endIndex = startIndex + perPage
			const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

			return {
				Response: 'success',
				Data: {
					responseData: paginatedRecords,
					pagination: {
						page,
						perPage,
						total: filteredRecords.length,
						totalPages: Math.ceil(filteredRecords.length / perPage),
					},
				},
			}
		},
	},
	// ERP更新操作 - 新的API路徑
	{
		url: '/mock/api/settings/erp-update/update',
		method: 'post',
		response: (params: any) => {
			const { id, dataType } = params.body || {}

			return {
				Response: 'success',
				Data: {
					updateId: `ERP2025${String(Math.floor(Math.random() * 9999) + 1000).padStart(4, '0')}`,
					recordId: id,
					dataType,
					status: '處理中',
					startedAt: new Date().toISOString(),
					estimatedDuration: Math.floor(Math.random() * 300) + 60,
				},
			}
		},
	},
	// 執行ERP更新
	{
		url: '/mock/api/settings/erp-update/execute',
		method: 'post',
		response: (params: any) => {
			const { updateType, module, dataIds } = params.body || {}

			return {
				Response: 'success',
				Data: {
					updateId: `ERP2025${String(Math.floor(Math.random() * 9999) + 1000).padStart(4, '0')}`,
					updateType,
					module,
					totalRecords: dataIds?.length || Math.floor(Math.random() * 100) + 10,
					status: '處理中',
					startedAt: new Date().toISOString(),
					estimatedDuration: Math.floor(Math.random() * 300) + 60, // 秒
				},
			}
		},
	},
	// 重試失敗的ERP更新
	{
		url: '/mock/api/settings/erp-update/retry',
		method: 'post',
		response: (params: any) => {
			const { updateId } = params.body || {}

			return {
				Response: 'success',
				Data: {
					updateId,
					retryCount: Math.floor(Math.random() * 3) + 1,
					status: '處理中',
					retriedAt: new Date().toISOString(),
				},
			}
		},
	},
	// 員工更新
	{
		url: '/mock/api/settings/employees/update-records',
		method: 'post',
		response: (params: any) => {
			const { page = 1, pageSize = 10, filters = {} } = params.body || {}
			const allRecords = generateEmployeeUpdateRecords()

			let filteredRecords = allRecords

			if (filters.employeeName) {
				filteredRecords = filteredRecords.filter((r) =>
					r.employeeName.includes(filters.employeeName)
				)
			}

			if (filters.updateType) {
				filteredRecords = filteredRecords.filter((r) => r.updateType === filters.updateType)
			}

			if (filters.status) {
				filteredRecords = filteredRecords.filter((r) => r.status === filters.status)
			}

			if (filters.department) {
				filteredRecords = filteredRecords.filter((r) => r.department === filters.department)
			}

			if (filters.dateRange) {
				const { startDate, endDate } = filters.dateRange
				filteredRecords = filteredRecords.filter((r) => {
					const requestDate = new Date(r.requestTime)
					return requestDate >= new Date(startDate) && requestDate <= new Date(endDate)
				})
			}

			const startIndex = (page - 1) * pageSize
			const endIndex = startIndex + pageSize
			const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

			return {
				Response: 'success',
				Data: paginatedRecords,
				pagination: {
					page,
					perPage: pageSize,
					total: filteredRecords.length,
					totalPages: Math.ceil(filteredRecords.length / pageSize),
				},
			}
		},
	},
	// 創建員工更新申請
	{
		url: '/mock/api/settings/employees/update-requests',
		method: 'post',
		response: (params: any) => {
			const { employeeId, updateType, requestedBy } = params.body || {}

			return {
				Response: 'success',
				Data: {
					updateId: `EMP2025${String(Math.floor(Math.random() * 9999) + 1000).padStart(4, '0')}`,
					employeeId,
					updateType,
					status: '待審核',
					requestedBy,
					requestTime: new Date().toISOString(),
				},
			}
		},
	},
	// 審核員工更新
	{
		url: '/mock/api/settings/employees/approve-update',
		method: 'post',
		response: (params: any) => {
			const { updateId, action, approvedBy, remarks } = params.body || {}

			return {
				Response: 'success',
				Data: {
					updateId,
					status: action === 'approve' ? '已處理' : '已駁回',
					approvedBy,
					processedTime: new Date().toISOString(),
					remarks,
				},
			}
		},
	},
	// 獲取員工更新統計
	{
		url: '/mock/api/settings/employees/update-stats',
		method: 'post',
		response: () => {
			const records = generateEmployeeUpdateRecords()
			const totalRequests = records.length
			const processedRequests = records.filter((r) => r.status === '已處理').length
			const pendingRequests = records.filter((r) => r.status === '待審核').length
			const processingRequests = records.filter((r) => r.status === '處理中').length
			const rejectedRequests = records.filter((r) => r.status === '已駁回').length

			const updateTypeStats = {
				newEmployee: records.filter((r) => r.updateType === '新增員工').length,
				dataChange: records.filter((r) => r.updateType === '異動資料').length,
				resignation: records.filter((r) => r.updateType === '離職處理').length,
				salaryAdjustment: records.filter((r) => r.updateType === '薪資調整').length,
				transfer: records.filter((r) => r.updateType === '部門調動').length,
			}

			return {
				Response: 'success',
				Data: {
					totalRequests,
					processedRequests,
					pendingRequests,
					processingRequests,
					rejectedRequests,
					processingRate: Math.round((processedRequests / totalRequests) * 100),
					updateTypeStats,
					lastUpdateTime: new Date().toISOString(),
				},
			}
		},
	},
	// ===== 帳號管理 API (Users Management) - 新版 TSC/1.0 =====
	// GET /TSC/1.0/users - 取得用戶列表（含分頁）
	{
		url: '/mock/api/TSC/1.0/users',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: [
					{
						user_id: 1,
						username: 'admin',
						full_name: '管理者',
						email: 'admin@example.com',
						role: 'ADMIN',
						status: 'active',
						created_at: '2024-11-23T14:35:17.000Z',
						updated_at: '2024-11-23T14:35:17.000Z',
					},
					{
						user_id: 2,
						username: 'operator',
						full_name: '操作員',
						email: 'operator@example.com',
						role: 'OPERATOR',
						status: 'active',
						created_at: '2024-12-01T10:00:00.000Z',
						updated_at: '2024-12-01T10:00:00.000Z',
					},
					{
						user_id: 3,
						username: 'viewer',
						full_name: '訪客',
						email: 'viewer@example.com',
						role: 'VIEWER',
						status: 'active',
						created_at: '2024-12-15T08:30:00.000Z',
						updated_at: '2024-12-15T08:30:00.000Z',
					},
				],
				Pagination: {
					page: 1,
					per_page: 10,
					total: 3,
					total_pages: 1,
				},
			}
		},
	},
	// POST /TSC/1.0/user - 新增用戶
	{
		url: '/mock/api/TSC/1.0/user',
		method: 'post',
		response: () => {
			return {
				Response: 'success',
				Data: {
					user_id: Math.floor(Math.random() * 1000) + 100,
					message: 'User created successfully',
				},
			}
		},
	},
	// PATCH /TSC/1.0/user/:id - 更新用戶
	{
		url: /\/mock\/api\/TSC\/1\.0\/user\/(\d+)/,
		method: 'patch',
		response: () => {
			return {
				Response: 'success',
				Data: {
					message: 'User updated successfully',
				},
			}
		},
	},
	// DELETE /TSC/1.0/user/:id - 刪除用戶
	{
		url: /\/mock\/api\/TSC\/1\.0\/user\/(\d+)/,
		method: 'delete',
		response: () => {
			return {
				Response: 'success',
				Data: {
					message: 'User deleted successfully',
				},
			}
		},
	},
	// ===== 舊版帳號管理 API (保留向下相容) =====
	{
		url: '/mock/api/settings/users',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: {
					responseData: [],
					total: 0,
				},
			}
		},
	},
	{
		url: '/mock/api/settings/users/list',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: [],
			}
		},
	},
	{
		url: '/mock/api/settings/permissions',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: {
					responseData: [],
					total: 0,
				},
			}
		},
	},
	{
		url: '/mock/api/settings/users/sensor-area',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: [],
			}
		},
	},
	{
		url: '/mock/api/settings/users',
		method: 'post',
		response: () => {
			return {
				Response: 'success',
				Data: {
					userID: Math.floor(Math.random() * 1000) + 1,
				},
			}
		},
	},
	{
		url: /\/api\/settings\/users\/(\d+)/,
		method: 'patch',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	{
		url: /\/api\/settings\/users\/(\d+)/,
		method: 'delete',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	{
		url: '/mock/api/settings/permissions',
		method: 'post',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	{
		url: /\/api\/settings\/permissions\/(\d+)/,
		method: 'patch',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	{
		url: /\/api\/settings\/permissions\/(\d+)/,
		method: 'delete',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	// ===== 按件計酬管理 API (Piecework Management) =====
	{
		url: '/mock/api/settings/piecework/rate-configs',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: [],
			}
		},
	},
	{
		url: '/mock/api/settings/piecework/records',
		method: 'post',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	{
		url: /\/api\/settings\/piecework\/records\/(\d+)/,
		method: 'patch',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	{
		url: /\/api\/settings\/piecework\/records\/(\d+)/,
		method: 'delete',
		response: () => {
			return {
				Response: 'success',
				Data: {},
			}
		},
	},
	// ===== ERP 更新管理 API (ERP Update Management) =====
	{
		url: '/mock/api/settings/erp-update/sync-logs',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: [],
			}
		},
	},
	{
		url: '/mock/api/settings/erp-update/sync',
		method: 'post',
		response: () => {
			return {
				Response: 'success',
				Data: {
					syncId: `SYNC${Math.floor(Math.random() * 9999) + 1000}`,
					status: '處理中',
				},
			}
		},
	},
	{
		url: /\/api\/settings\/erp-update\/retry\/(\d+)/,
		method: 'post',
		response: (params: any) => {
			const recordId = params.url.split('/').pop()
			return {
				Response: 'success',
				Data: {
					recordId,
					retryCount: 1,
					status: '處理中',
				},
			}
		},
	},
] as MockMethod[]
