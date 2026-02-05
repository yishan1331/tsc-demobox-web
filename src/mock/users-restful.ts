// Sample RESTful API Mock for apiClient usage
import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default [
	// GET /users - Get users with pagination
	{
		url: '/mock/users',
		method: 'post',
		response: ({ query }: any) => {
			const { page = 1, perPage = 10 } = query

			return Mock.mock({
				Response: 'success',
				Data: {
					'data|5-10': [
						{
							'userID|+1': 1,
							'userNo|+1': 1000,
							userAccount: '@word(5,10)',
							userName: '@cname',
							'levelNo|1-3': 1,
							levelName: '@pick(["A級", "B級", "C級"])',
							'active|1': [true, false],
							createTime: '@datetime',
							updateTime: '@datetime',
						},
					],
					pagination: {
						page: parseInt(page),
						perPage: parseInt(perPage),
						total: 50,
					},
				},
			})
		},
	},

	// GET /users/all - Get all users
	{
		url: '/mock/users/all',
		method: 'post',
		response: () => {
			return Mock.mock({
				Response: 'success',
				Data: {
					'data|10-20': [
						{
							'userID|+1': 1,
							'userNo|+1': 1000,
							userAccount: '@word(5,10)',
							userName: '@cname',
							'levelNo|1-3': 1,
							levelName: '@pick(["A級", "B級", "C級"])',
							'active|1': [true, false],
						},
					],
				},
			})
		},
	},

	// GET /permissions - Get access permissions
	{
		url: '/mock/permissions',
		method: 'post',
		response: () => {
			return Mock.mock({
				Response: 'success',
				Data: {
					data: [
						{
							levelNo: 1,
							levelName: 'A級',
							levelInfo: '最大權限',
							accessList: {
								settings: {
									authority: true,
									children: {
										settingsUsers: { authority: true },
										settingsPermission: { authority: true },
										settingsPiecework: { authority: true },
										settingsErpUpdate: { authority: true },
										settingsEmployeeUpdate: { authority: true },
									},
								},
								monitoring: {
									authority: true,
									children: {
										monitoringFactoryOpStatus: { authority: true },
										monitoringEBoard: { authority: true },
										monitoringMachineMgmt: { authority: true },
									},
								},
							},
						},
					],
				},
			})
		},
	},

	// GET /users/:id/settings - Get user sensor area settings
	{
		url: /^\/users\/\d+\/settings$/,
		method: 'post',
		response: () => {
			return Mock.mock({
				Response: 'success',
				Data: {
					data: [
						{
							userID: 1,
							sensorArea: '@pick(["Area1", "Area2", "Area3"])',
							preferences: {
								theme: '@pick(["light", "dark"])',
								language: '@pick(["tw", "en"])',
							},
						},
					],
				},
			})
		},
	},

	// POST /users - Create new user
	{
		url: '/mock/users',
		method: 'post',
		response: ({ body }: any) => {
			const userData = JSON.parse(body)

			return Mock.mock({
				Response: 'success',
				Data: {
					data: {
						userID: '@increment',
						userNo: '@increment(1000)',
						...userData,
						createTime: '@datetime',
						updateTime: '@datetime',
					},
				},
			})
		},
	},

	// PATCH /users/:id - Update user
	{
		url: /^\/users\/\d+$/,
		method: 'post',
		response: ({ body }: any) => {
			const userData = JSON.parse(body)

			return Mock.mock({
				Response: 'success',
				Data: {
					data: {
						...userData,
						updateTime: '@datetime',
					},
				},
			})
		},
	},

	// DELETE /users/:id - Delete user
	{
		url: /^\/users\/\d+$/,
		method: 'post',
		response: () => {
			return Mock.mock({
				Response: 'success',
				Data: {
					data: true,
				},
			})
		},
	},
] as MockMethod[]
