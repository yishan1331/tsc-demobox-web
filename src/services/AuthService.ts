import { login, logout } from '@/services/APIs/auth.api'

export const authService = () => {
	const logIn = async (formData: { username: string; password: string }) => {
		try {
			const apiResult = await login(formData)
			console.log('Login API Result:', apiResult)
			if (!apiResult) return

			if (apiResult.status === 'error') {
				return {
					success: false,
					message: apiResult.message || '登入失敗',
					sessions: null,
					handled: apiResult.handled,
				}
			}

			if (apiResult.data) {
				const responseData = apiResult.data as any
				let sessions = {}
				console.log(responseData)

				if (responseData?.Data) {
					sessions = {
						...responseData.Data,
					}
				}
				return {
					success: true,
					message: apiResult.message || 'ok',
					sessions,
				}
			}
			throw new Error('Unexpected Error')
		} catch (error) {
			console.error('Login error:', error)
			return {
				success: false,
				message: '系統錯誤',
				sessions: null,
				handled: true,
			}
		}
	}

	const logOut = async (expired: boolean = false) => {
		try {
			const logoutResult = await logout(expired)
			console.log('Logout API Result:', logoutResult)
			if (!logoutResult) return

			if (logoutResult.status === 'error') {
				return {
					success: false,
					message: logoutResult?.message || '登出失敗',
					data: null,
					handled: logoutResult.handled,
				}
			}

			return {
				success: true,
				message: logoutResult.message || '登出成功',
				data: logoutResult.data,
			}
		} catch (error) {
			console.error('Logout error:', error)
			return {
				success: false,
				message: '系統錯誤',
				data: null,
				handled: true,
			}
		}
	}

	return {
		logIn,
		logOut,
	}
}
