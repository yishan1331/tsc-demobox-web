import { storeToRefs } from 'pinia'
import router from '@/router'

import { ApiResult } from '@/types'
import { api } from '@/utils/http-client'
import { useUserAuthStore } from '@/stores/userAuth.store'
import { formatResultDirect } from './common.api'

const AuthStore = useUserAuthStore()
const { addedRouteToRemove } = storeToRefs(AuthStore)

export const login = async (formData: {
	username: string
	password: string
}): Promise<ApiResult> => {
	const apiResult = await api.post('auth/login', formData)
	return formatResultDirect(apiResult)
}

export const logout = async (expired: boolean = false) => {
	let apiResult
	if (!expired) {
		apiResult = await api.post('auth/logout', {})
	}
	AuthStore.resetUserData()
	addedRouteToRemove.value
	router.push({ name: 'login' })
	return apiResult ? formatResultDirect(apiResult) : undefined
}

export const resetPassword = async (data: {
	target_user_id: number
	new_password: string
}): Promise<ApiResult> => {
	const apiResult = await api.put('auth/reset-password', data)
	return formatResultDirect(apiResult)
}
