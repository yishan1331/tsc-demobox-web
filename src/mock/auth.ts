// mock/auth.ts - DemoBox Authentication Mock
import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default [
	// POST /TSC/1.0/auth/login - 用戶登入
	{
		url: '/mock/api/TSC/1.0/auth/login',
		method: 'post',
		response: () => {
			return Mock.mock({
				Data: {
					fullname: '\u7ba1\u7406\u8005',
					login_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
					permissions: {
						// DemoBox - 機台監控
						monitoring: {
							authority: true,
							children: {
								monitoringOverview: {
									authority: true,
									function: {
										delete: true,
										export: true,
										read: true,
										write: true,
									},
								},
								monitoringMachine: {
									authority: true,
									function: {
										delete: true,
										export: true,
										read: true,
										write: true,
									},
								},
							},
						},
						// DemoBox - 歷史資料
						history: {
							authority: true,
							children: {
								historyData: {
									authority: true,
									function: {
										delete: true,
										export: true,
										read: true,
										write: true,
									},
								},
							},
						},
						// DemoBox - 系統設定
						settings: {
							authority: true,
							children: {
								settingsAccounts: {
									authority: true,
									function: {
										delete: true,
										export: true,
										read: true,
										write: true,
									},
								},
							},
						},
					},
					tokens: {
						access_token:
							'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNzU2MDI5NzUzLCJqdGkiOiIyNGU0YjkwNi0xYjVlLTQ3Y2EtYWNkZC02OTNmYjMxYmM0OGMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiMiIsIm5iZiI6MTc1NjAyOTc1MywiZXhwIjoxNzU2MDMxNTUzLCJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbF9uYW1lIjoiXHU3YmExXHU3NDA2XHU4MDA1Iiwicm9sZXMiOlsiQURNSU4iXX0.YySJWzNvqpQbg7Yg9feJQpYkRg5iIAzd7821qBCPoS0',
						expires_in: 1800,
						refresh_token:
							'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1NjAyOTc1MywianRpIjoiZDhjZDdkNTYtN2Y0Ni00NmQ4LWIwY2QtOTg2MDg1OGQ2MjkyIiwidHlwZSI6InJlZnJlc2giLCJzdWIiOjIsIm5iZiI6MTc1NjAyOTc1MywiZXhwIjoxNzU2MDcyOTUzLCJ1c2VybmFtZSI6ImFkbWluIn0.u8b53_jeFovDwvkpzKl27SlYSVlcIlXzcOhqXOoSfp4',
						token_type: 'Bearer',
					},
					user_id: 2,
					user_roles: ['ADMIN'],
					username: 'admin',
				},
				Response: 'success',
			})
		},
	},
	// POST /TSC/1.0/auth/logout - 用戶登出
	{
		url: '/mock/api/TSC/1.0/auth/logout',
		method: 'post',
		response: () => {
			return {
				Response: 'success',
				Data: {
					message: 'Logged out successfully',
				},
			}
		},
	},
	// PUT /TSC/1.0/auth/reset-password - 重設密碼
	{
		url: '/mock/api/TSC/1.0/auth/reset-password',
		method: 'put',
		response: () => {
			return {
				Response: 'success',
				Data: {
					message: 'Password reset successfully',
				},
			}
		},
	},
	// POST /TSC/1.0/auth/refresh - 刷新 Token
	{
		url: '/mock/api/TSC/1.0/auth/refresh',
		method: 'post',
		response: () => {
			return Mock.mock({
				Response: 'success',
				Data: {
					access_token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNzU2MDI5NzUzLCJqdGkiOiIyNGU0YjkwNi0xYjVlLTQ3Y2EtYWNkZC02OTNmYjMxYmM0OGMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiMiIsIm5iZiI6MTc1NjAyOTc1MywiZXhwIjoxNzU2MDMxNTUzLCJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbF9uYW1lIjoiXHU3YmExXHU3NDA2XHU4MDA1Iiwicm9sZXMiOlsiQURNSU4iXX0.YySJWzNvqpQbg7Yg9feJQpYkRg5iIAzd7821qBCPoS0',
					expires_in: 1800,
					token_type: 'Bearer',
				},
			})
		},
	},
] as MockMethod[]
