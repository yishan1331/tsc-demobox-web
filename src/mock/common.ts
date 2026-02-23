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
]
