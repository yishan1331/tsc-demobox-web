<template>
	<div v-if="dateRange" class="date-range-display mb-2">
		<VaIcon name="date_range" color="tsc" class="mx-2" />
		資料範圍: {{ dateRange }}
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatPeriodToDateRange } from '@/utils/common.utils'

interface Props {
	period?: string
	startDate?: string
	endDate?: string
}

const props = defineProps<Props>()

const dateRange = computed(() => {
	if (props.startDate && props.endDate) {
		return `${props.startDate} ~ ${props.endDate}`
	}

	if (props.period) {
		return formatPeriodToDateRange(props.period)
	}

	return ''
})
</script>

<style scoped>
.date-range-display {
	display: flex;
	align-items: center;
	font-size: 1rem;
	color: #6c757d;
	/* padding: 8px 12px; */
	/* background-color: #f8f9fa; */
	/* border-radius: 8px; */
	/* border: 1px solid #e5e7eb; */
}
</style>
