<template>
	<div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
		<div>
			{{ t('table.totalRecords', { count: $props.pagination.total }) }}
		</div>

		<div>
			{{ t('table.limit') }}
			<VaSelect
				v-model="$props.pagination.limit"
				class="!w-20"
				:options="[20, 50, 100]"
				color="tscDark"
			/>
		</div>

		<div class="flex">
			<VaButton
				preset="secondary"
				icon="va-arrow-left"
				color="tsc"
				:aria-label="t('table.previousPage')"
				:disabled="$props.pagination.page === 1"
				@click="$props.pagination.page--"
			/>
			<VaPagination
				v-model="$props.pagination.page"
				buttons-preset="secondary"
				:pages="totalPages"
				:visible-pages="5"
				:boundary-links="false"
				:direction-links="false"
				active-page-color="tsc"
				color="tsc"
			/>
			<VaButton
				class="mr-2"
				preset="secondary"
				color="tsc"
				icon="va-arrow-right"
				:aria-label="t('table.nextPage')"
				:disabled="$props.pagination.page === totalPages"
				@click="$props.pagination.page++"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { type Pagination } from '@/types'

const { t } = useI18n()

const props = defineProps({
	pagination: { type: Object as PropType<Pagination>, required: true },
})

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.limit))
</script>

<style lang="scss" scoped></style>
