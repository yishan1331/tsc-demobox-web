import { type User, ApiResult } from '@/types'
import { api } from '@/utils/http-client'
import { formatResult } from './common.api'

// ===== 帳號管理 API (Users Management) =====

export const getUsersWithPagination = async (conditions?: {
	filter?: Record<string, any>
	page?: number
	limit?: number
	order_by?: string
	order?: 'asc' | 'desc'
	search?: string
}): Promise<ApiResult<any>> => {
	console.log('Original conditions:', conditions)

	const { filter, ...otherParams } = conditions || {}
	const params: any = { ...otherParams, ...filter, ac_type: 'active' }

	console.log('Final params:', params)
	const apiResult = await api.get('users', { params })
	return formatResult(apiResult)
}

export const addUser = async (user: Partial<User>): Promise<ApiResult> => {
	const apiResult = await api.post('users', user)
	return formatResult(apiResult)
}

export const updateUser = async (
	user_id: number,
	user: Partial<User> & { id: string }
): Promise<ApiResult> => {
	const apiResult = await api.patch(`user/${user_id}`, user)
	return formatResult(apiResult)
}

export const removeUser = async (id: number): Promise<ApiResult> => {
	const apiResult = await api.delete(`users/${id}`)
	return formatResult(apiResult)
}
