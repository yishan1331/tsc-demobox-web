import { Ref, ref, unref, watch } from 'vue'
import { watchIgnorable } from '@vueuse/core'

import { filterSortingFn } from '@/utils/common.utils'
import { Filters, Pagination, Sorting, User } from '@/types'
import { makePaginationRef, makeSortingRef, makeFiltersRef } from '@/composables/common/condition'
import {
	getUsersWithPagination,
	addUser,
	updateUser,
	removeUser,
} from '@/services/APIs/settings.api'

// 使用者管理服務
export const usersService = (options?: {
	pagination?: Ref<Pagination>
	sorting?: Ref<Sorting>
	filters?: Ref<Partial<Filters>>
}) => {
	const isLoading = ref(false)
	const actionFromFilter = ref(false)
	const users = ref<User[]>([])
	const tempUsers = ref<User[]>([])

	const {
		filters = makeFiltersRef(),
		sorting = makeSortingRef(),
		pagination = makePaginationRef(),
	} = options || {}

	const fetch = async () => {
		isLoading.value = true
		const apiResult = await getUsersWithPagination({
			page: unref(pagination).page,
			limit: unref(pagination).limit,
			order_by: unref(sorting).sortBy,
			filter: unref(filters),
		})

		console.log(apiResult)
		if (apiResult.status === 'success') {
			const responseData = apiResult.data as any

			users.value = Array.isArray(responseData.results)
				? responseData.results
				: Array.isArray(responseData)
					? responseData
					: []

			ignoreUpdates(() => {
				pagination.value = responseData?.pagination
				console.log(pagination.value)
			})
		} else {
			users.value = []
			console.error('Failed to fetch users:', apiResult.message)
		}

		isLoading.value = false
	}

	const add = async (user: User) => {
		isLoading.value = true
		const apiResult = await addUser(user)
		if (apiResult.status === 'success') await fetch()
		isLoading.value = false
		return apiResult
	}

	const update = async (user_id: number, user: Partial<User>) => {
		isLoading.value = true
		const apiResult = await updateUser(user_id, user as Partial<User> & { id: string })
		if (apiResult.status === 'success') await fetch()
		isLoading.value = false
		return apiResult
	}

	const remove = async (userID: number) => {
		isLoading.value = true
		const apiResult = await removeUser(userID)
		if (apiResult.status === 'success') await fetch()
		isLoading.value = false
		return apiResult
	}

	// 監聽器設置
	watch(
		filters,
		() => {
			pagination.value.page = 1
			actionFromFilter.value = true
		},
		{ deep: true }
	)

	watch(
		sorting,
		() => {
			const { data, tempData } = filterSortingFn(
				'sorting',
				users.value,
				tempUsers.value,
				unref(sorting)
			)
			users.value = data
			tempUsers.value = tempData
		},
		{ deep: true }
	)

	// 監聽分頁和篩選變化
	const { ignoreUpdates } = watchIgnorable([pagination, filters], fetch, {
		deep: true,
	})

	return {
		isLoading,
		filters,
		sorting,
		pagination,
		users,
		fetch,
		add,
		update,
		remove,
	}
}

// 整合設定服務
export const settingsService = () => {
	const usersMgmt = usersService()

	return {
		users: usersMgmt,
	}
}
