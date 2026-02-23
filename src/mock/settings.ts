import { MockMethod } from 'vite-plugin-mock'

export default [
	// ===== 帳號管理 API (Users Management) - TSC/1.0 =====
	// GET /TSC/1.0/users - 取得用戶列表（含分頁）
	{
		url: '/mock/api/TSC/1.0/users',
		method: 'get',
		response: (options: { url: string; query?: Record<string, string> }) => {
			// 兼容 vite-plugin-mock 和 Mock.js
			const urlParams = new URLSearchParams(options.url.split('?')[1] || '')
			const query = options.query || {}
			const page = parseInt(query.page || urlParams.get('page') || '1')
			const limit = parseInt(query.limit || urlParams.get('limit') || '10')

			// Mock 用戶資料
			const allUsers = [
				{
					user_id: 1,
					username: 'admin',
					full_name: '管理者',
					email: 'admin@tsc.com',
					roles: ['ADMIN'],
					is_active: true,
					created_at: '2024-11-23T14:35:17.000Z',
					updated_at: '2024-11-23T14:35:17.000Z',
				},
				{
					user_id: 2,
					username: 'operator1',
					full_name: '王小明',
					email: 'operator1@tsc.com',
					roles: ['OPERATOR'],
					is_active: true,
					created_at: '2024-12-01T10:00:00.000Z',
					updated_at: '2024-12-01T10:00:00.000Z',
				},
				{
					user_id: 3,
					username: 'operator2',
					full_name: '李小華',
					email: 'operator2@tsc.com',
					roles: ['OPERATOR'],
					is_active: true,
					created_at: '2024-12-05T09:30:00.000Z',
					updated_at: '2024-12-05T09:30:00.000Z',
				},
				{
					user_id: 4,
					username: 'viewer1',
					full_name: '張大同',
					email: 'viewer1@tsc.com',
					roles: ['VIEWER'],
					is_active: true,
					created_at: '2024-12-15T08:30:00.000Z',
					updated_at: '2024-12-15T08:30:00.000Z',
				},
				{
					user_id: 5,
					username: 'viewer2',
					full_name: '陳美麗',
					email: 'viewer2@tsc.com',
					roles: ['VIEWER'],
					is_active: false,
					created_at: '2024-12-20T14:00:00.000Z',
					updated_at: '2024-12-20T14:00:00.000Z',
				},
			]

			// 分頁處理
			const startIndex = (page - 1) * limit
			const endIndex = startIndex + limit
			const paginatedUsers = allUsers.slice(startIndex, endIndex)

			return {
				Response: 'success',
				Data: {
					results: paginatedUsers,
					pagination: {
						page,
						limit,
						total: allUsers.length,
						total_pages: Math.ceil(allUsers.length / limit),
					},
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
] as MockMethod[]
