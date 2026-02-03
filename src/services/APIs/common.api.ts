import { ApiResult } from '@/types'
import { api } from '@/utils/http-client'
import { API_SYSTEM } from '@/constants/api.constants'

// ===== 通用 API 回傳格式化函數 =====

/**
 * 格式化 API 回應 - 從 Data 欄位取得資料
 * 適用於回傳格式為 { Data: ... } 的 API
 */
export const formatResult = (apiResult: ApiResult): ApiResult => ({
	status: apiResult.status,
	message: apiResult.message || apiResult.status,
	data: (apiResult.data as any)?.Data || apiResult.data,
	handled: apiResult.handled,
})

/**
 * 格式化 API 回應 - 直接傳遞資料
 * 適用於回傳格式直接為資料的 API
 */
export const formatResultDirect = (apiResult: ApiResult): ApiResult => ({
	status: apiResult.status,
	message: apiResult.message || (apiResult.status === 'success' ? 'ok' : 'error'),
	data: apiResult.data,
	handled: apiResult.handled,
})

// ===== 通用資料表 API =====

export const tableQuery = async (tableName: string): Promise<ApiResult> => {
	const apiResult = await api.get(`${API_SYSTEM}/1.0/tables/${tableName}`)
	return formatResult(apiResult)
}

export const getTableDataWithConditions = async (
	tableName: string,
	conditions: {
		page?: number
		limit?: number
		order_by?: string
		order?: 'asc' | 'desc'
		filter?: Record<string, any>
	}
): Promise<ApiResult> => {
	console.log('Original conditions:', conditions)

	// 分離 filter 和其他參數
	const { filter, ...otherParams } = conditions || {}

	// 建構查詢參數
	const params: any = {
		...otherParams,
	}

	// 如果有 filter，將其轉換為 JSON 字串
	if (filter && Object.keys(filter).length > 0) {
		params.filter = JSON.stringify(filter)
	}

	console.log('Final params:', params)

	const apiResult = await api.get(`${API_SYSTEM}/1.0/tables/${tableName}`, { params })
	return formatResult(apiResult)
}

export const patchTableRecord = async (
	tableName: string,
	recordId: string | number,
	data: Record<string, any>
): Promise<ApiResult> => {
	const apiResult = await api.patch(`${API_SYSTEM}/1.0/tables/${tableName}/${recordId}`, data)
	return formatResultDirect(apiResult)
}
