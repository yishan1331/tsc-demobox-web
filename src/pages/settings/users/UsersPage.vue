<template>
	<div class="users-page">
		<h1 class="page-title">{{ t('sidebar.settings.users') }}</h1>

		<!-- 查詢條件卡片 -->
		<QueryCard :title="t('filter.queryModule')" icon="search" collapsible>
			<!-- 用戶名稱 -->
			<FormGroup :label="t('user.username')">
				<VaInput v-model="searchUsername" :placeholder="t('user.username')" clearable />
			</FormGroup>

			<!-- 姓名 -->
			<FormGroup :label="t('user.full_name')">
				<VaInput v-model="searchFullName" :placeholder="t('user.full_name')" clearable />
			</FormGroup>

			<!-- 查詢按鈕 -->
			<template #actions>
				<VaButton :loading="isLoading" @click="handleSearch">
					<template #prepend>
						<VaIcon name="search" />
					</template>
					{{ t('history.query') }}
				</VaButton>
				<VaButton preset="secondary" @click="handleReset">
					<template #prepend>
						<VaIcon name="refresh" />
					</template>
					{{ t('common.reset') }}
				</VaButton>
			</template>
		</QueryCard>

		<!-- 數據表格卡片 -->
		<VaCard class="data-card">
			<VaCardContent>
				<DataTable
					v-model:sort-by="sorting.sortBy"
					v-model:sorting-order="sorting.sortingOrder"
					:tableData="filteredTableData"
					:loading="isLoading"
					:pagination="pagination"
					@editData="showEditDataModal"
					@deleteData="onDataDelete"
					@changePassword="showChangePasswordModal"
					:users="users"
				/>
			</VaCardContent>
		</VaCard>

		<!-- 編輯用戶 Modal -->
		<VaModal
			v-slot="{ cancel, ok }"
			v-model="doShowEditDataModal"
			size="small"
			mobile-fullscreen
			close-button
			hide-default-actions
			:before-cancel="beforeEditFormModalClose"
		>
			<h1 class="va-h6">
				{{ dataToEdit ? t('user.editUser') : t('table.addUser') }}
			</h1>
			<EditUserForm
				ref="editFormRef"
				:user="dataToEdit"
				:save-button-label="dataToEdit ? t('table.save') : t('table.add')"
				@close="cancel"
				@save="
					(user) => {
						onDataSaved(user)
						ok()
					}
				"
			/>
		</VaModal>

		<!-- 修改密碼 Modal -->
		<VaModal
			v-slot="{ cancel, ok }"
			v-model="doShowChangePasswordModal"
			size="small"
			mobile-fullscreen
			close-button
			hide-default-actions
		>
			<h1 class="va-h6 mb-4">{{ t('user.changePassword') }}</h1>
			<VaForm v-slot="{ isValid }" class="flex flex-col gap-4">
				<div class="text-sm text-gray-600 mb-2">
					{{ t('user.username') }}: {{ userToChangePassword?.username }}
				</div>
				<div class="text-sm text-gray-600 mb-2">
					{{ t('user.full_name') }}: {{ userToChangePassword?.full_name }}
				</div>
				<VaInput
					v-model="newPassword"
					:label="t('user.newPassword')"
					type="password"
					:rules="[validators.required, validators.passwordLength]"
					color="tscDark"
				/>
				<VaInput
					v-model="confirmNewPassword"
					:label="t('user.confirmNewPassword')"
					type="password"
					:rules="[validators.required, passwordMatchRule]"
					color="tscDark"
				/>
				<div class="flex gap-2 justify-end mt-4">
					<VaButton preset="plain" color="danger" icon="close" @click="cancel">
						{{ t('common.cancel') }}
					</VaButton>
					<VaButton :disabled="!isValid" icon="save" color="tsc" @click="onChangePassword(ok)">
						{{ t('table.save') }}
					</VaButton>
				</div>
			</VaForm>
		</VaModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue'
import { useModal, useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'

import DataTable from './widgets/UsersTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import QueryCard from '@/components/common/QueryCard.vue'
import FormGroup from '@/components/common/FormGroup.vue'
import { errorHandling } from '@/utils/common.utils'
import { Sorting, UserFilters, User } from '@/types'
import { usersService } from '@/services/SettingsService'
import { validators } from '@/validators/validator'
import { resetPassword } from '@/services/APIs/auth.api'

const { t } = useI18n()

const doShowEditDataModal = ref(false)
const doShowChangePasswordModal = ref(false)

const xlsxData = ref<User[]>([])
const users = ref<Record<number, string>>({})

// 搜尋相關
const searchUsername = ref('')
const searchFullName = ref('')

// 修改密碼相關
const userToChangePassword = ref<User | null>(null)
const newPassword = ref('')
const confirmNewPassword = ref('')

const passwordMatchRule = (v: string) => {
	return v === newPassword.value || t('validation.confirmpassword')
}

const makeUsersSortingRef = (): Ref<Sorting> =>
	ref<Sorting>({ sortBy: 'username', sortingOrder: 'asc' })
const makeUsersFilterRef = (): Ref<Partial<UserFilters>> => ref<Partial<UserFilters>>({ status: 'all' })

const {
	users: tableData,
	isLoading,
	filters,
	sorting,
	pagination,
	...usersAPI
} = usersService({
	sorting: makeUsersSortingRef(),
	filters: makeUsersFilterRef(),
})

// 過濾後的數據
const filteredTableData = computed(() => {
	if (!tableData.value) return []

	const usernameSearch = searchUsername.value.toLowerCase()
	const fullNameSearch = searchFullName.value.toLowerCase()

	// 如果兩個搜尋條件都為空，返回全部數據
	if (!usernameSearch && !fullNameSearch) return tableData.value

	return tableData.value.filter((user) => {
		const matchUsername = !usernameSearch || user.username?.toLowerCase().includes(usernameSearch)
		const matchFullName = !fullNameSearch || user.full_name?.toLowerCase().includes(fullNameSearch)
		return matchUsername && matchFullName
	})
})

const oldPassword = ref('')
const dataToEdit = ref<User | null>(null)

const showEditDataModal = (user: User) => {
	oldPassword.value = user.password_hash
	user.password_hash = '___NOT_CHANGE_PASSWORD___'
	dataToEdit.value = user
	doShowEditDataModal.value = true
}

const showChangePasswordModal = (user: User) => {
	userToChangePassword.value = user
	newPassword.value = ''
	confirmNewPassword.value = ''
	doShowChangePasswordModal.value = true
}

const onChangePassword = async (okCallback: () => void) => {
	if (!userToChangePassword.value) return

	const apiResult = await resetPassword({
		target_user_id: userToChangePassword.value.user_id,
		new_password: newPassword.value,
	})

	if (apiResult.status === 'error') {
		if (!apiResult.handled) {
			errorHandling(apiResult.message || '密碼修改失敗')
		}
		return
	}

	notify({
		message: t('user.passwordChangeSuccess'),
		color: 'tsc',
	})
	okCallback()
}

const { init: notify } = useToast()

const _getData = async () => {
	await usersAPI.fetch()
	if (typeof tableData.value != 'undefined') {
		tableData.value.map((u) => {
			users.value[u.user_id] = u.username
		})
	}
}

const handleSearch = () => {
	// 搜尋邏輯已由 computed 處理
}

const handleReset = () => {
	searchUsername.value = ''
	searchFullName.value = ''
}

const onDataSaved = async (user: User) => {
	let apiResult
	if (dataToEdit.value) {
		apiResult = await usersAPI.update(user.user_id, {
			is_active: user.is_active,
			roles: user.roles,
		})
	} else {
		apiResult = await usersAPI.add({
			...user,
		})
	}
	if (apiResult && apiResult.status === 'error') {
		if (!apiResult.handled) {
			errorHandling(apiResult.message || '操作失敗')
		}
		return
	}
	notify({
		message: `${dataToEdit.value ? t('table.update') : t('table.add')}${t('table.success')}`,
		color: 'tsc',
	})
}

const onDataDelete = async (user: User) => {
	const apiResult = await usersAPI.remove(Number(user.user_id))
	if (apiResult && apiResult.status === 'error') {
		if (!apiResult.handled) {
			errorHandling(apiResult.message || '刪除失敗')
		}
		return
	}
	notify({
		message: `${t('table.delete')}${t('table.success')}`,
		color: 'tsc',
	})
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
	if (editFormRef.value.isFormHasUnsavedChanges) {
		const agreed = await confirm({
			maxWidth: '380px',
			message: t('table.beforeEditFormModalClose'),
			size: 'small',
			okText: t('table.ok'),
			cancelText: t('table.cancel'),
		})
		if (agreed) {
			hide()
		}
	} else {
		hide()
	}
}

const organizeXLSXData = async () => {
	xlsxData.value = cloneDeep(tableData.value)
}

onMounted(() => {
	_getData()
})

watch(
	() => tableData.value,
	organizeXLSXData,
	{
		immediate: true,
		deep: true,
	}
)
</script>

<style scoped lang="scss">
.users-page {
	padding: 1rem;
}

.page-title {
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 1.5rem;
}

// 數據卡片
.data-card {
	margin-bottom: 1.5rem;
}
</style>
