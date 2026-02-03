// Setup Mock.js for production
export function setupMock() {
	// Dynamic import to avoid bundling issues
	import('mockjs').then((Mock) => {
		const MockModule = Mock.default || Mock

		// Enable Mock.js for production
		MockModule.setup({
			timeout: '200-600',
		})

		// Import all mock modules dynamically
		Promise.all([
			import('./auth'),
			import('./monitoring'),
			import('./settings'),
			import('./common'),
			// RESTful API mock examples (for apiClient format)
			import('./users-restful'),
		]).then((modules) => {
			// Register all mock APIs
			modules.forEach((module) => {
				const mockApis = module.default
				mockApis.forEach((item: any) => {
					MockModule.mock(new RegExp(item.url), item.method || 'get', item.response)
				})
			})

			console.log('Mock server is running in production mode with all modules')
			console.log('- Legacy PHP format: /Login, /GetUsers, etc. (for axiosAPI)')
			console.log('- RESTful format: /users, /permissions, etc. (for apiClient)')
		})
	})
}
