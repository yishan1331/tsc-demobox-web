<template>
	<VaButton
		@click.prevent="exportAsCSV"
		color="tsc"
		class="ms-2"
		icon="download"
		preset="secondary"
		:disabled="downloadData.length == 0 || typeof downloadData === 'undefined'"
		>{{ t('table.exportCSV') }}</VaButton
	>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { downloadAsCSV } from '@/utils/toCSV.utils'

const { t } = useI18n()

const props = defineProps({
	downloadData: { type: Array as () => Record<string, any>[], required: true },
	downloadFilename: { type: String, required: true },
})

const downloadData = toRef(props, 'downloadData')
const downloadFilename = toRef(props, 'downloadFilename')

const exportAsCSV = () => {
	downloadAsCSV(downloadData.value, downloadFilename.value)
}
</script>

<style lang="scss" scoped></style>
