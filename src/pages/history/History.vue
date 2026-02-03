<template>
	<div class="history-page">
		<h1 class="page-title">{{ t('sensor.history') }}</h1>

		<!-- 查詢條件卡片 -->
		<QueryCard :title="t('filter.queryModule')" icon="search" collapsible>
			<!-- 機台類型選擇 -->
			<FormGroup :label="t('history.sensorType')">
				<VaSelect
					v-model="localSensorType"
					:options="sensorTypeOptions"
					:placeholder="t('history.selectSensorType')"
					value-by="value"
					text-by="label"
					clearable
					@update:modelValue="handleSensorTypeChange"
				/>
			</FormGroup>

			<!-- 機台選擇 -->
			<FormGroup :label="t('history.sensor')">
				<VaSelect
					v-model="localSensorId"
					:options="sensorOptions"
					:placeholder="t('history.selectSensor')"
					:disabled="!localSensorType || isLoadingSensorList"
					:loading="isLoadingSensorList"
					value-by="value"
					text-by="label"
					clearable
					@update:modelValue="handleSensorChange"
				/>
			</FormGroup>

			<!-- 開始日期 -->
			<FormGroup :label="t('history.startDate')">
				<VaDateInput
					v-model="localStartDate"
					:placeholder="t('history.selectStartDate')"
					clearable
					@update:modelValue="handleDateChange"
				/>
			</FormGroup>

			<!-- 結束日期 -->
			<FormGroup :label="t('history.endDate')">
				<VaDateInput
					v-model="localEndDate"
					:placeholder="t('history.selectEndDate')"
					clearable
					@update:modelValue="handleDateChange"
				/>
			</FormGroup>

			<!-- 查詢按鈕 -->
			<template #actions>
				<VaButton :disabled="!canQuery || isLoading" :loading="isLoading" @click="handleQuery">
					<template #prepend>
						<VaIcon name="search" />
					</template>
					{{ t('history.query') }}
				</VaButton>
				<VaButton preset="secondary" :disabled="!historyRecords.length" @click="exportToExcel">
					<template #prepend>
						<VaIcon name="download" />
					</template>
					{{ t('history.exportExcel') }}
				</VaButton>
			</template>
		</QueryCard>

		<!-- 查詢結果區域 -->
		<template v-if="historyData">
			<!-- 結果統計 -->
			<div class="result-summary">
				<span class="summary-text">
					{{ t('history.resultSummary', { sensor: currentSensorName, total: totalRecords }) }}
				</span>
				<span class="summary-page">
					{{ t('history.pageInfo', { current: currentPage, total: totalPages }) }}
				</span>
			</div>

			<!-- 數據表格 -->
			<VaCard class="data-card">
				<VaCardContent>
					<VaDataTable
						:items="historyRecords"
						:columns="tableColumns"
						:loading="isLoading"
						striped
						hoverable
					>
						<!-- 時間戳格式化 -->
						<template #cell(timestamp)="{ value }">
							{{ formatTimestamp(value) }}
						</template>

						<!-- 燈號值格式化 -->
						<template #cell(pwr_light)="{ value }">
							<VaChip :color="Number(value) === 1 ? 'success' : 'secondary'" size="small">
								{{ formatLightValue(Number(value)) }}
							</VaChip>
						</template>

						<template #cell(OPR)="{ value }">
							<VaChip :color="Number(value) === 1 ? 'success' : 'secondary'" size="small">
								{{ formatLightValue(Number(value)) }}
							</VaChip>
						</template>

						<template #cell(air_press_light)="{ value }">
							<VaChip :color="Number(value) === 1 ? 'success' : 'secondary'" size="small">
								{{ formatLightValue(Number(value)) }}
							</VaChip>
						</template>

						<template #cell(in_lube)="{ value }">
							<VaChip :color="Number(value) === 1 ? 'success' : 'secondary'" size="small">
								{{ formatLightValue(Number(value)) }}
							</VaChip>
						</template>

						<template #cell(sf_door)="{ value }">
							<VaChip :color="Number(value) === 1 ? 'danger' : 'secondary'" size="small">
								{{ formatLightValue(Number(value)) }}
							</VaChip>
						</template>

						<template #cell(end_lube_press)="{ value }">
							<VaChip :color="Number(value) === 1 ? 'danger' : 'secondary'" size="small">
								{{ formatLightValue(Number(value)) }}
							</VaChip>
						</template>

						<!-- 溫度值格式化 -->
						<template #cell(quench_furn_temp)="{ value }">
							<span v-if="value !== null">{{ value }} °C</span>
							<span v-else class="text-gray-400">-</span>
						</template>

						<template #cell(quench_furn_temp_set)="{ value }">
							<span v-if="value !== null">{{ value }} °C</span>
							<span v-else class="text-gray-400">-</span>
						</template>

						<template #cell(tempering_furn_temp)="{ value }">
							<span v-if="value !== null">{{ value }} °C</span>
							<span v-else class="text-gray-400">-</span>
						</template>

						<template #cell(tempering_furn_temp_set)="{ value }">
							<span v-if="value !== null">{{ value }} °C</span>
							<span v-else class="text-gray-400">-</span>
						</template>

						<!-- 頻率值格式化 -->
						<template #cell(conv_freq)="{ value }">
							<span v-if="value !== null">{{ value }} Hz</span>
							<span v-else class="text-gray-400">-</span>
						</template>

						<template #cell(conv_freq_set)="{ value }">
							<span v-if="value !== null">{{ value }} Hz</span>
							<span v-else class="text-gray-400">-</span>
						</template>

						<!-- 速率值格式化 -->
						<template #cell(rate)="{ value }">
							<span v-if="value !== null">{{ value }} rpm</span>
							<span v-else class="text-gray-400">-</span>
						</template>

						<!-- 計數格式化 -->
						<template #cell(cnt)="{ value }">
							<span class="font-mono">{{ value ?? '-' }}</span>
						</template>
					</VaDataTable>

					<!-- 分頁 -->
					<div v-if="totalPages > 1" class="pagination-wrapper">
						<VaPagination
							v-model="localCurrentPage"
							:pages="totalPages"
							:visible-pages="5"
							buttons-preset="secondary"
							@update:modelValue="handlePageChange"
						/>
					</div>
				</VaCardContent>
			</VaCard>
		</template>

		<!-- 空狀態 -->
		<VaCard v-else-if="!isLoading" class="empty-card">
			<VaCardContent class="empty-content">
				<VaIcon name="query_stats" size="64px" color="secondary" />
				<p class="empty-text">{{ t('history.emptyHint') }}</p>
			</VaCardContent>
		</VaCard>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSensorHistory } from '@/composables/sensor/useSensorHistory'
import type { SensorType } from '@/services/SensorService'
import QueryCard from '@/components/common/QueryCard.vue'
import FormGroup from '@/components/common/FormGroup.vue'

const { t } = useI18n()

const {
	// 狀態
	selectedSensorType,
	selectedSensorId,
	startDate,
	endDate,
	isLoadingSensorList,
	historyData,
	isLoading,
	currentPage,

	// 計算屬性
	sensorTypeOptions,
	sensorOptions,
	historyRecords,
	totalRecords,
	totalPages,
	canQuery,
	currentSensorName,
	tableColumns,

	// 方法
	setSensorType,
	setSensor,
	setDateRange,
	fetchHistory,
	goToPage,
	exportToExcel,

	// 工具函數
	formatTimestamp,
	formatLightValue,
} = useSensorHistory()

// ===== 本地狀態 (用於 v-model 綁定) =====
const localSensorType = ref<SensorType | null>(null)
const localSensorId = ref<string | null>(null)
const localStartDate = ref<Date | null>(null)
const localEndDate = ref<Date | null>(null)
const localCurrentPage = ref(1)

// ===== 同步本地狀態與 composable 狀態 =====
watch(selectedSensorType, (val) => {
	localSensorType.value = val
})
watch(selectedSensorId, (val) => {
	localSensorId.value = val
})
watch(startDate, (val) => {
	localStartDate.value = val
})
watch(endDate, (val) => {
	localEndDate.value = val
})
watch(currentPage, (val) => {
	localCurrentPage.value = val
})

// ===== 事件處理 =====
const handleSensorTypeChange = (type: SensorType | null) => {
	setSensorType(type)
	localSensorId.value = null
}

const handleSensorChange = (sensorId: string | null) => {
	setSensor(sensorId)
}

const handleDateChange = () => {
	setDateRange(localStartDate.value, localEndDate.value)
}

const handleQuery = () => {
	fetchHistory()
}

const handlePageChange = (page: number) => {
	goToPage(page)
}
</script>

<style scoped lang="scss">
.history-page {
	padding: 1rem;
}

.page-title {
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 1.5rem;
}

// 結果統計
.result-summary {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
	padding: 0.75rem 1rem;
	background: #f8f9fa;
	border-radius: 8px;

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 0.5rem;
		text-align: center;
	}
}

.summary-text {
	font-size: 0.875rem;
	color: #333;
	font-weight: 500;
}

.summary-page {
	font-size: 0.875rem;
	color: #666;
}

// 數據卡片
.data-card {
	margin-bottom: 1.5rem;
}

.pagination-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 1.5rem;
	padding-top: 1rem;
	border-top: 1px solid #eee;
}

// 空狀態
.empty-card {
	min-height: 300px;
}

.empty-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
}

.empty-text {
	margin-top: 1rem;
	font-size: 1rem;
	color: #666;
	text-align: center;
}

// 字體樣式
.font-mono {
	font-family: 'Courier New', Courier, monospace;
}

.text-gray-400 {
	color: #9ca3af;
}
</style>
