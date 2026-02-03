<template>
	<VaButton
		@click.prevent="exportAsELSX"
		preset="primary"
		border-color="tsc"
		size="small"
		color="tsc"
		icon="download"
		:loading="isLoading"
		:disabled="isButtonDisabled"
		>{{ t('table.exportXLSX') }}</VaButton
	>
</template>

<script setup lang="ts">
import { toRef, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { downloadToExcel } from '@/utils/toXLSX.utils'

const { t } = useI18n()

const props = defineProps({
	downloadData: { type: Array as () => Record<string, any>[], required: true },
	downloadFilename: { type: String, required: true },
	i18nKey: { type: String, required: true },
	xlsxColumnOrder: { type: Array, required: false },
	disabled: { type: Boolean, default: false },
})

const isLoading = ref(false)

const isButtonDisabled = computed(() => {
	return (
		props.disabled ||
		isLoading.value ||
		props.downloadData.length === 0 ||
		typeof props.downloadData === 'undefined'
	)
})

const downloadData = toRef(props, 'downloadData')
const downloadFilename = toRef(props, 'downloadFilename')
const i18nKey = toRef(props, 'i18nKey')
const xlsxColumnOrder = toRef(props, 'xlsxColumnOrder')

const exportAsELSX = async () => {
	if (downloadData.value.length > 0) {
		isLoading.value = true
		try {
			await downloadToExcel(
				t,
				downloadData.value,
				downloadFilename.value,
				i18nKey.value,
				xlsxColumnOrder.value
			)
		} finally {
			isLoading.value = false
		}
	}
}
</script>

<style lang="scss" scoped></style>
