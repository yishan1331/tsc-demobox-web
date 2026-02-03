import { ref } from 'vue'
import { useToast } from 'vuestic-ui'
import { commonService } from '@/services/CommonService'
import { TOAST_LIFE_TIME } from '@/constants'
import { storeToRefs } from 'pinia'
import { useUserAuthStore } from '@/stores/userAuth.store'

interface User {
	user_id: number
	username: string
	full_name?: string
}

interface UserOption {
	text: string
	value: string | number
}

interface UseUsersDataOptions {
	adminOnly?: boolean
	returnAsOptions?: boolean
	customFilter?: Record<string, any>
}

/**
 * 使用者資料管理的共用邏輯
 */
export const useUsersData = (options: UseUsersDataOptions = {}) => {
	const { init: notify } = useToast()
	const { fetchTableData } = commonService()
	const AuthStore = useUserAuthStore()
	const { userData } = storeToRefs(AuthStore)

	const users = ref<Record<number, { username: string; full_name?: string }>>({})
	const userOptions = ref<UserOption[]>([])
	const loadingState = ref(false)

	/**
	 * 載入所有使用者資料
	 * @param onlyCurrentUserFilter - 是否只查詢當前使用者資料
	 */
	const loadAllUsers = async (onlyCurrentUserFilter = false) => {
		loadingState.value = true
		try {
			// 建構過濾條件
			let filter: Record<string, any> = {
				ac_type: { op: '=', value: 0 },
			}

			// 如果需要根據使用者權限過濾
			if (
				onlyCurrentUserFilter &&
				userData.value &&
				!userData.value.roles?.includes('ADMIN')
			) {
				filter.user_id = { op: '=', value: userData.value.userID }
			}

			// 合併自訂過濾條件
			if (options.customFilter) {
				filter = { ...filter, ...options.customFilter }
			}

			const result = await fetchTableData('users', {
				get_all: 'yes',
				filter,
			})

			if (!result.success) {
				// 如果錯誤已由 EventService 處理（如網路錯誤），不重複顯示 toast
				if (!result.handled) {
					notify({
						message: '載入人員資料失敗',
						color: 'warning',
						duration: TOAST_LIFE_TIME,
					})
				}
				return { success: false, users: {}, options: [] }
			}

			if (result.data.results) {
				const userData = result.data.results as User[]

				// 轉換為字典格式
				users.value = userData.reduce(
					(acc, user) => {
						acc[user.user_id] = {
							username: user.username,
							full_name: user.full_name,
						}
						return acc
					},
					{} as Record<number, { username: string; full_name?: string }>
				)

				// 如果需要選項格式
				if (options.returnAsOptions) {
					userOptions.value = userData.map((user) => ({
						text: user.full_name || user.username,
						value: String(user.user_id),
					}))
				}
			}

			return { success: true, users: users.value, options: userOptions.value }
		} catch (error) {
			// catch 區塊只處理程式碼錯誤，不顯示 toast
			// 網路錯誤已由 EventService 全域處理
			console.error('載入人員資料時發生非預期錯誤:', error)
			return { success: false, users: {}, options: [], handled: true }
		} finally {
			loadingState.value = false
		}
	}

	/**
	 * 取得使用者名稱的輔助函數
	 */
	const getUserName = (userId: number | string): string => {
		const id = typeof userId === 'string' ? parseInt(userId) : userId
		if (isNaN(id)) return '未知用戶'

		const user = users.value[id]
		return user?.full_name || user?.username || `用戶 ${id}`
	}

	/**
	 * 取得使用者顯示名稱（優先顯示全名）
	 */
	const getUserDisplayName = (userId: number | string): string => {
		const id = typeof userId === 'string' ? parseInt(userId) : userId
		if (isNaN(id)) return '未知用戶'

		const user = users.value[id]
		if (user?.full_name) {
			return `${user.full_name} (${user.username})`
		}
		return user?.username || `用戶 ${id}`
	}

	return {
		users,
		userOptions,
		loadingState,
		loadAllUsers,
		getUserName,
		getUserDisplayName,
	}
}
