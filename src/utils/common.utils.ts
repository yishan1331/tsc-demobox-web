import { useToast } from 'vuestic-ui'
import { unref } from 'vue'

import { type Filters, type Sorting } from '@/types'

const { init: notify } = useToast()

export const sleep = (ms = 0) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export const errorAuthHandling = () => {
	notify({
		message: '登入逾時/已在另一裝置上登入，請重新登入',
		color: 'danger',
	})
	console.log('!!!!!!!!!!!!!!!')
	// Note: authService().logOut() requires userID parameter, but in auth error handling
	// we don't have access to userID, so we just use the useUserAuthStore directly
	// This will be handled by the auth.api.ts logout function
	console.log('!!!!!!!!!!!!!!!')
	return
}

export const getSortItem = (obj: any, sortBy: string) => {
	return obj[sortBy]
}

export const getFilterItem = (obj: any, condition: Filters) => {
	const category = Array.isArray(condition.category) ? condition.category[0] : condition.category
	if (Number.isInteger(parseInt(condition.search))) {
		return obj[category] == parseInt(condition.search)
	}
	return obj[category].toString().toLowerCase().includes(condition.search.toLowerCase())
}

export const filterSortingFn = (
	type: 'filters' | 'sorting',
	data: any,
	tempData: any,
	conditions: Partial<Filters> | Partial<Sorting>
) => {
	if (type === 'filters') {
		const condition = {
			...unref(conditions),
		} as Filters
		console.log(condition)
		if (tempData.length > 0) {
			data = tempData
		} else {
			tempData = data
		}
		if (condition.search != '' && condition.category) {
			data = data.filter((e: any) => getFilterItem(e, condition))
		}
	} else {
		const condition = {
			...unref(conditions),
		} as Sorting
		if (condition.sortBy && condition.sortingOrder) {
			data = data.sort((a: any, b: any) => {
				const first = getSortItem(a, condition.sortBy as string)
				const second = getSortItem(b, condition.sortBy as string)
				if (first > second) {
					return condition.sortingOrder === 'asc' ? 1 : -1
				}
				if (first < second) {
					return condition.sortingOrder === 'asc' ? -1 : 1
				}
				return 0
			})
		}
	}
	return {
		data: data,
		tempData: tempData,
	}
}

export const errorHandling = (response: string, table?: string) => {
	if (response != 'ok') {
		console.log('%%%%%%%%%%%%')
		let notify_response = response
		let caseKey = ''
		if (
			response.includes(
				'Cannot delete or update a parent row: a foreign key constraint fails'
			)
		) {
			caseKey = 'ForeignKeyConstraintError'
		} else if (response.includes('Duplicate entry')) {
			caseKey = 'DuplicateKeyConstraintError'
		}
		console.log(caseKey)
		switch (caseKey) {
			case 'ForeignKeyConstraintError':
				if (table == 'accessPermission' && response.includes('user_ibfk_1'))
					notify_response = '此權限名稱已有帳戶建立，無法做刪除'
				break
			default:
				break
		}
		notify({
			message: notify_response,
			color: 'danger',
			dangerouslyUseHtmlString: true,
		})
	}
}

// 生成可用期別
export const fetchAvailablePeriods = () => {
	const periods: { text: string; value: string }[] = []
	const currentDate = new Date()
	const currentYear = currentDate.getFullYear()
	const currentMonth = currentDate.getMonth() + 1

	for (let monthOffset = -6; monthOffset <= 6; monthOffset++) {
		const targetDate = new Date(currentYear, currentMonth - 1 + monthOffset, 1)
		const year = targetDate.getFullYear()
		const month = targetDate.getMonth() + 1

		const yearStr = (year % 100).toString().padStart(2, '0')
		const monthStr = month.toString().padStart(2, '0')

		periods.push({
			text: `${yearStr}${monthStr}01`,
			value: `${yearStr}${monthStr}01`,
		})
		periods.push({
			text: `${yearStr}${monthStr}02`,
			value: `${yearStr}${monthStr}02`,
		})
	}

	return periods
}

// 格式化期別為日期範圍
export const formatPeriodToDateRange = (period: string): string => {
	if (!period || period.length !== 6) return ''

	const yearPrefix = period.substring(0, 2)
	const monthStr = period.substring(2, 4)
	const periodNum = period.substring(4, 6)

	const fullYear = 2000 + parseInt(yearPrefix)
	const month = parseInt(monthStr)

	if (periodNum === '01') {
		// 01 期別：當月1日～15日
		const startDate = `${fullYear}-${monthStr}-01`
		const endDate = `${fullYear}-${monthStr}-15`
		return `${startDate}~${endDate}`
	} else if (periodNum === '02') {
		// 02 期別：當月16日～月底
		const startDate = `${fullYear}-${monthStr}-16`
		// 計算月底日期
		const lastDay = new Date(fullYear, month, 0).getDate()
		const endDate = `${fullYear}-${monthStr}-${lastDay.toString().padStart(2, '0')}`
		return `${startDate}~${endDate}`
	}

	return ''
}

// 狀態相關方法
export const getStatusColor = (status: string): string => {
	const statusColors: Record<string, string> = {
		DRAFT: 'info',
		RELEASED: 'tsc',
		SCHEDULED: 'primary',
		IN_PROGRESS: 'success',
		PAUSED: 'warning',
		COMPLETED: 'success',
	}
	return statusColors[status] || 'info'
}

export const getStatusText = (status: string): string => {
	const statusMap: Record<string, string> = {
		DRAFT: '草稿',
		RELEASED: '待排程',
		SCHEDULED: '已排程',
		IN_PROGRESS: '進行中',
		PAUSED: '暫停',
		COMPLETED: '已完成',
	}
	return statusMap[status] || status
}
