import { MockMethod } from 'vite-plugin-mock'

// 這是一個示例模擬數據文件
// 請複製此文件並重命名為 index.ts，然後根據需要修改模擬數據

const mockData: MockMethod[] = [
	{
		url: '/mock/api/auth/login',
		method: 'post',
		response: () => {
			return {
				code: 200,
				data: {
					access_token: 'mock-token',
					user: {
						id: 1,
						username: 'test-user',
						email: 'test@example.com',
					},
				},
			}
		},
	},
	{
		url: '/mock/api/analytics/overview',
		method: 'post',
		response: () => {
			return {
				code: 200,
				data: {
					totalRevenue: 10000,
					totalClicks: 5000,
					totalImpressions: 100000,
				},
			}
		},
	},
]

export default mockData
