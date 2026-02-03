import { useI18n } from 'vue-i18n'

import { getTableDataWithConditions } from '@/services/APIs/common.api'

export const commonService = () => {
	const { t } = useI18n()

	const fetchTableData = async (
		tableName: string,
		conditions?: {
			page?: number
			limit?: number
			order_by?: string
			order?: 'asc' | 'desc'
			filter?: Record<string, any>
			get_all?: 'yes' | 'no'
		}
	) => {
		try {
			const apiResult = await getTableDataWithConditions(tableName, conditions || {})
			console.log(apiResult)
			if (apiResult.status === 'error') {
				return {
					success: false,
					message: apiResult.message || t('common.queryFailed'),
					handled: apiResult.handled,
				}
			}
			if (apiResult.data) {
				const responseData = apiResult.data as any
				return {
					success: true,
					message: apiResult.message || t('common.querySuccess'),
					data: responseData,
				}
			}
			throw new Error('Unexpected Error')
		} catch (error) {
			console.error('Failed to fetch table data:', error)
			// catch 區塊處理的是程式碼錯誤，不是已處理的網路錯誤
			return { success: false, message: error, handled: false }
		}
	}

	return {
		fetchTableData,
	}
}
