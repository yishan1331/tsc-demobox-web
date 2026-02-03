<template>
	<!-- Loading state -->
	<div v-if="$props.loading" class="loading-container p-4 flex flex-col items-center justify-center" style="min-height: 300px;">
		<VaInnerLoading loading color="primary" />
		<p class="mt-4 text-gray-500">{{ t('common.loading') }}</p>
	</div>
	<!-- No data state -->
	<div v-else-if="tableData.length === 0" class="text-center py-8 text-gray-500">
		{{ t('common.noDataFound') }}
	</div>
	<!-- Table with data -->
	<template v-else>
		<VaDataTable
			v-model:sort-by="sortByVModel"
			v-model:sorting-order="sortingOrderVModel"
			:columns="columns"
			:items="tableData"
			:loading="$props.loading"
			sticky-header
			:height="`${dataTableHeight}px`"
			itemSize="10px"
			class="tsc-data-table"
		>
		<template #cell(user_id)="{ value }">
			<span class="block" :title="value">{{ value }}</span>
		</template>

		<template #cell(username)="{ value }">
			<span class="font-medium block" :title="value">{{ value }}</span>
		</template>

		<template #cell(full_name)="{ value }">
			<span class="font-medium block" :title="value">{{ value }}</span>
		</template>

		<template #cell(position)="{ value }">
			<span class="block" :title="value">{{ value || '-' }}</span>
		</template>

		<template #cell(dep_code)="{ value }">
			<span class="block" :title="value">{{ value || '-' }}</span>
		</template>

		<template #cell(email)="{ rowData }">
			<div class="ellipsis max-w-[230px]" :title="rowData.email || ''">
				{{ rowData.email }}
			</div>
		</template>

		<!-- Temporarily disabled - these fields don't exist in the new User structure -->
		<template #cell(roles)="{ rowData }">
			<div v-if="rowData.roles.length === 0">無設定權限</div>
			<template v-else>
				<div
					v-for="(value, index) in rowData.roles"
					:key="index"
					:class="{ 'mb-1': rowData.roles.length - 1 != index }"
				>
					<VaBadge
						:text="roleLabel[value.toLowerCase() as keyof typeof roleColors]"
						:color="
							roleColors[value.toLowerCase() as keyof typeof roleColors] || 'info'
						"
						style="font-size: 18px"
					/>
				</div>
			</template>
		</template>

		<template #cell(is_active)="{ rowData }">
			<VaBadge
				:text="rowData.is_active ? '啟用' : '未啟用'"
				:color="rowData.is_active ? 'success' : 'warning'"
				style="font-size: 18px"
			/>
		</template>

		<template #cell(modified_at)="{ value }">
			<span class="block" :title="value">{{ value || '-' }}</span>
		</template>

		<template #cell(actions)="{ rowData }">
			<div class="flex gap-2 justify-end">
				<VaButton
					preset="primary"
					size="small"
					icon="mso-edit"
					:aria-label="t('aria.editData')"
					@click="$emit('edit-data', rowData as User)"
				/>
				<VaButton
					preset="secondary"
					size="small"
					color="danger"
					icon="mso-key"
					:aria-label="t('user.changePassword')"
					@click="$emit('change-password', rowData as User)"
					:disabled="rowData.user_id <= 4"
				/>
			</div>
		</template>
		</VaDataTable>

		<AppTablePaginationBar :pagination="$props.pagination" />
	</template>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import { PropType, toRef } from 'vue'

import { useGlobalStore } from '@/stores/global.store'
import { User, Pagination, Sorting } from '@/types'
// Temporarily disabled - not used in current implementation
import { roleColors, roleLabel } from '@/utils/user.utils'
import AppTablePaginationBar from '@/components/table-pagination/AppTablePaginationBar.vue'

const { t } = useI18n()
const { dataTableHeight } = storeToRefs(useGlobalStore())

const columns = defineVaDataTableColumns([
	{
		label: t('user.user_id'),
		key: 'user_id',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{
		label: t('user.username'),
		key: 'username',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{
		label: t('user.full_name'),
		key: 'full_name',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{
		label: t('user.roles'),
		key: 'roles',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{
		label: t('user.email'),
		key: 'email',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{
		label: t('user.position'),
		key: 'position',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{
		label: t('user.dep_code'),
		key: 'dep_code',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	// {
	// 	label: t('user.address'),
	// 	key: 'address',
	// 	sortable: true,
	// 	sortingOptions: ['desc', 'asc'],
	// },
	{
		label: t('user.is_active'),
		key: 'is_active',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{
		label: t('user.modified_at'),
		key: 'modified_at',
		sortable: true,
		sortingOptions: ['desc', 'asc'],
	},
	{ label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
	tableData: {
		type: Array as PropType<User[]>,
		required: true,
	},
	loading: { type: Boolean, default: false },
	pagination: { type: Object as PropType<Pagination>, required: true },
	sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
	sortingOrder: {
		type: String as PropType<Sorting['sortingOrder']>,
		required: true,
	},
	users: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits<{
	(event: 'edit-data', data: User): void
	(event: 'delete-data', data: User): void
	(event: 'change-password', data: User): void
	(event: 'update:sortBy', sortBy: Sorting['sortBy']): void
	(event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const tableData = toRef(props, 'tableData')
// Temporarily disabled - not used in current implementation
// const users = toRef(props, 'users')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

// const { confirm } = useModal()

// const onDataDelete = async (user: User) => {
// 	const agreed = await confirm({
// 		title: `${t('table.delete')}${t('user.userID')}`,
// 		message: `${t('table.deleteConfirm')}${t('user.userID')}“${user.user_id}”嗎?`,
// 		okText: t('table.delete'),
// 		cancelText: t('table.cancel'),
// 		size: 'small',
// 		maxWidth: '380px',
// 	})

// 	if (agreed) {
// 		emit('delete-data', user)
// 	}
// }
</script>

<style lang="scss" scoped></style>
