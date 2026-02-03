<template>
	<div class="machine-detail">
		<!-- 頂部導航 -->
		<div class="header-section">
			<div class="flex items-center gap-4">
				<VaButton preset="plain" icon="arrow_back" @click="goBack">
					{{ t('common.back') }}
				</VaButton>
				<h1 class="page-title">{{ t('sensor.machine') }}</h1>
			</div>
			<div class="header-actions">
				<VaButton
					v-if="realtimeData"
					:preset="isEditMode ? 'primary' : 'secondary'"
					:icon="isEditMode ? 'check' : 'dashboard_customize'"
					size="small"
					@click="toggleEditMode"
				>
					{{ isEditMode ? t('machine.doneEditing') : t('machine.customizeLayout') }}
				</VaButton>
				<span v-if="realtimeData" class="update-time">
					{{ t('sensor.lastUpdate') }}： {{ formattedLastUpdate }}
				</span>
			</div>
		</div>

		<!-- 感測器選擇卡片（當沒有選擇時顯示） -->
		<QueryCard v-if="!currentSensorId && !isLoading" :title="t('filter.queryModule')" icon="search" collapsible>
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
				/>
			</FormGroup>

			<!-- 查詢按鈕 -->
			<template #actions>
				<VaButton :disabled="!localSensorType || !localSensorId" @click="handleSelectSensor">
					<template #prepend>
						<VaIcon name="search" />
					</template>
					{{ t('history.query') }}
				</VaButton>
			</template>
		</QueryCard>

		<!-- 編輯模式提示 -->
		<div v-if="isEditMode" class="edit-mode-hint">
			<VaIcon name="info" size="small" />
			<span>{{ t('machine.dragHint') }}</span>
			<VaButton preset="plain" size="small" @click="resetToDefault">
				{{ t('machine.resetLayout') }}
			</VaButton>
		</div>

		<!-- Loading 狀態 -->
		<div v-if="isLoading && !realtimeData" class="loading-state">
			<VaInnerLoading :loading="true">
				<div class="h-64 flex items-center justify-center">
					<span class="text-gray-500">{{ t('sensor.loading') }}</span>
				</div>
			</VaInnerLoading>
		</div>

		<!-- 錯誤狀態 -->
		<div v-else-if="errorMessage && !realtimeData" class="error-state">
			<VaCard>
				<VaCardContent class="text-center py-8">
					<VaIcon name="error_outline" size="48px" color="danger" />
					<p class="mt-4 text-gray-600">{{ errorMessage }}</p>
					<VaButton class="mt-4" @click="refresh">
						{{ t('sensor.refresh') }}
					</VaButton>
				</VaCardContent>
			</VaCard>
		</div>

		<!-- 主要內容 - 網格拖放區域 -->
		<template v-else-if="realtimeData">
			<VueDraggable
				v-model="applicableBlocks"
				:disabled="!isEditMode"
				handle=".drag-handle"
				ghost-class="drag-ghost"
				:animation="200"
				class="blocks-grid"
				@change="onDragChange"
			>
				<div
					v-for="element in applicableBlocks"
					:key="element.id"
					v-show="element.visible"
					class="block-wrapper"
					:class="[`col-span-${element.colSpan}`, { 'edit-mode': isEditMode }]"
				>
					<!-- 編輯模式工具列 -->
					<div v-if="isEditMode" class="block-toolbar">
						<div class="drag-handle">
							<VaIcon name="drag_indicator" />
						</div>
						<span class="block-title">{{ element.label }}</span>
						<div class="col-span-selector">
							<button
								v-for="col in 4"
								:key="col"
								class="col-btn"
								:class="{ active: element.colSpan === col }"
								:title="`${col} ${t('machine.columns')}`"
								@click="setBlockColSpan(element.id, col as ColSpan)"
							>
								{{ col }}
							</button>
						</div>
						<VaButton
							preset="plain"
							icon="visibility_off"
							size="small"
							color="secondary"
							@click="toggleBlockVisibility(element.id)"
						/>
					</div>

					<!-- 機台資訊區域 -->
					<VaCard v-if="element.id === 'machine-info'" class="dashboard-card">
						<VaCardContent>
							<div class="machine-info-grid" :class="{ compact: element.colSpan < 3 }">
								<div v-if="element.colSpan >= 2" class="machine-image">
									<VaIcon :name="getMachineIcon()" size="80px" color="tsc" />
								</div>
								<div class="machine-details">
									<div class="info-row">
										<span class="info-label">{{ t('machine.process') }}：</span>
										<span class="info-value">{{ sensorTypeName }}</span>
									</div>
									<div class="info-row">
										<span class="info-label">{{ t('machine.machineNo') }}：</span>
										<span class="info-value">{{ realtimeData.sensor_name }}</span>
									</div>
									<div class="info-row">
										<span class="info-label">{{ t('machine.status') }}：</span>
										<div class="status-badges">
											<span
												v-for="status in machineStatuses"
												:key="status.key"
												class="status-badge"
												:class="{ active: machineStatus === status.key }"
												:style="machineStatus === status.key ? { backgroundColor: status.color } : {}"
											>
												{{ status.label }}
											</span>
										</div>
									</div>
								</div>
							</div>
						</VaCardContent>
					</VaCard>

					<!-- 工時狀態進度條 -->
					<VaCard v-else-if="element.id === 'worktime'" class="dashboard-card">
						<VaCardContent>
							<h3 class="section-title">{{ t('machine.workTimeStatus') }}</h3>
							<div class="worktime-progress-container">
								<div class="worktime-progress-bar">
									<div
										v-for="(segment, index) in workTimeProgress"
										:key="index"
										class="worktime-segment"
										:style="{
											left: `${segment.start}%`,
											width: `${segment.width}%`,
											backgroundColor: segment.color,
										}"
										:title="`${getWorkTimeStatusName(segment.status)}`"
									/>
								</div>
								<div class="worktime-labels">
									<span
										v-for="(label, index) in timeLabels"
										:key="index"
										class="time-label"
										:style="{ left: `${(index / 24) * 100}%` }"
									>
										{{ label }}
									</span>
								</div>
							</div>
							<div class="worktime-legend">
								<div class="legend-item">
									<span class="legend-color" style="background-color: #4caf50" />
									<span>{{ t('machine.statusRunning') }}</span>
								</div>
								<div class="legend-item">
									<span class="legend-color" style="background-color: #ff9800" />
									<span>{{ t('machine.statusPaused') }}</span>
								</div>
								<div class="legend-item">
									<span class="legend-color" style="background-color: #9e9e9e" />
									<span>{{ t('machine.statusStopped') }}</span>
								</div>
								<div class="legend-item">
									<span class="legend-color" style="background-color: #f44336" />
									<span>{{ t('machine.statusError') }}</span>
								</div>
							</div>
						</VaCardContent>
					</VaCard>

					<!-- 支數顯示 -->
					<VaCard v-else-if="element.id === 'count'" class="dashboard-card">
						<VaCardContent>
							<h3 class="section-title text-center">{{ t('machine.count') }}</h3>
							<div class="count-display" :class="{ compact: element.colSpan === 1 }">
								<span class="count-number" :class="{ small: element.colSpan === 1 }">
									{{ formatCount(count) }}
								</span>
							</div>
						</VaCardContent>
					</VaCard>

					<!-- 熱處理機溫度顯示 -->
					<VaCard v-else-if="element.id === 'heat-treatment'" class="dashboard-card">
						<VaCardContent>
							<h3 class="section-title">{{ t('machine.temperatureData') }}</h3>
							<div class="temperature-grid" :class="{ compact: element.colSpan < 3 }">
								<div v-for="item in heatTreatmentData" :key="item.label" class="temperature-item">
									<div class="temp-label">{{ item.label }}</div>
									<div class="temp-values">
										<div class="temp-current">
											<span class="temp-value">{{ item.value ?? '-' }}</span>
											<span class="temp-unit">{{ item.unit }}</span>
										</div>
										<div class="temp-set">
											<span class="temp-set-label">設定值：</span>
											<span class="temp-set-value">{{ item.setValue ?? '-' }} {{ item.unit }}</span>
										</div>
									</div>
								</div>
							</div>
						</VaCardContent>
					</VaCard>

					<!-- 輾牙機速率顯示 -->
					<VaCard v-else-if="element.id === 'threading-rate'" class="dashboard-card">
						<VaCardContent>
							<h3 class="section-title">{{ t('machine.rateData') }}</h3>
							<div class="rate-display">
								<div v-for="item in threadingData" :key="item.label" class="rate-item">
									<span class="rate-label">{{ item.label }}</span>
									<span class="rate-value">{{ item.value ?? '-' }}</span>
									<span class="rate-unit">{{ item.unit }}</span>
								</div>
							</div>
						</VaCardContent>
					</VaCard>

					<!-- 感測器燈號 -->
					<VaCard v-else-if="element.id === 'sensor-lights'" class="dashboard-card">
						<VaCardContent>
							<h3 class="section-title">{{ t('machine.sensorLights') }}</h3>
							<div class="lights-grid" :class="{ compact: element.colSpan < 3 }">
								<div
									v-for="light in sensorLights"
									:key="light.name"
									class="light-item"
									:class="{ 'is-alarm': light.is_alarm }"
								>
									<div
										class="light-indicator"
										:class="{
											'light-on': light.value === 1,
											'light-off': light.value === 0 || light.value === null,
											'light-alarm': light.is_alarm && light.value === 1,
											small: element.colSpan === 1,
										}"
									/>
									<span class="light-label">{{ light.label }}</span>
								</div>
							</div>
						</VaCardContent>
					</VaCard>
				</div>
			</VueDraggable>

			<!-- 隱藏的區塊列表 (編輯模式時顯示) -->
			<div v-if="isEditMode && hiddenBlocks.length > 0" class="hidden-blocks">
				<h4 class="hidden-blocks-title">{{ t('machine.hiddenBlocks') }}</h4>
				<div class="hidden-blocks-list">
					<VaChip
						v-for="block in hiddenBlocks"
						:key="block.id"
						closeable
						@update:modelValue="toggleBlockVisibility(block.id)"
					>
						{{ block.label }}
						<template #close>
							<VaIcon name="add" size="small" />
						</template>
					</VaChip>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'
import { useSensorRealtime } from '@/composables/sensor/useSensorRealtime'
import { useDashboardLayout, type ColSpan } from '@/composables/sensor/useDashboardLayout'
import { SensorService, type SensorType, type WorkTimeStatus } from '@/services/SensorService'
import QueryCard from '@/components/common/QueryCard.vue'
import FormGroup from '@/components/common/FormGroup.vue'

const { t } = useI18n()
const router = useRouter()

const {
	realtimeData,
	isLoading,
	errorMessage,
	currentSensorType,
	currentSensorId,
	machineStatus,
	sensorLights,
	count,
	workTimeProgress,
	timeLabels,
	sensorTypeName,
	formattedLastUpdate,
	heatTreatmentData,
	threadingData,
	refresh,
	setSensor,
} = useSensorRealtime({ pollingInterval: 5000 })

// ===== 感測器選擇相關狀態 =====
const localSensorType = ref<SensorType | null>(null)
const localSensorId = ref<string | null>(null)
const isLoadingSensorList = ref(false)
const sensorOptions = ref<{ label: string; value: string }[]>([])

// 感測器類型選項
const sensorTypeOptions = computed(() => [
	{ label: t('sensor.heading'), value: 'heading' },
	{ label: t('sensor.threading'), value: 'threading' },
	{ label: t('sensor.heat_treatment'), value: 'heat_treatment' },
])

// 當感測器類型變更時載入感測器列表
const handleSensorTypeChange = async (type: SensorType | null) => {
	localSensorId.value = null
	sensorOptions.value = []

	if (!type) return

	isLoadingSensorList.value = true
	try {
		const sensors = await SensorService.fetchSensorListByType(type)
		sensorOptions.value = sensors.map((s) => ({
			label: s.sensor_name,
			value: s.sensor_id,
		}))
	} catch (error) {
		console.error('Failed to fetch sensor list:', error)
	} finally {
		isLoadingSensorList.value = false
	}
}

// 選擇感測器後載入即時數據
const handleSelectSensor = () => {
	if (localSensorType.value && localSensorId.value) {
		setSensor(localSensorType.value, localSensorId.value)
	}
}

const {
	blocks,
	isEditMode,
	getApplicableBlocks,
	toggleEditMode,
	toggleBlockVisibility,
	setBlockColSpan,
	updateBlockOrder,
	resetToDefault,
} = useDashboardLayout()

// 根據當前感測器類型取得適用的區塊
const applicableBlocksComputed = computed(() => {
	return getApplicableBlocks(currentSensorType.value).value
})

// 可寫入的區塊陣列（供 draggable 使用）
const applicableBlocks = computed({
	get: () => applicableBlocksComputed.value,
	set: (newBlocks) => {
		// 更新整體區塊順序
		const newOrder = [...blocks.value]
		const applicableIds = newBlocks.map((b) => b.id)

		// 更新區塊資訊
		for (let i = 0; i < newOrder.length; i++) {
			if (applicableIds.includes(newOrder[i].id)) {
				const newBlockIndex = applicableIds.indexOf(newOrder[i].id)
				if (newBlockIndex !== -1) {
					newOrder[i] = { ...newOrder[i], ...newBlocks[newBlockIndex] }
				}
			}
		}

		// 根據新順序重新排列
		const reordered = applicableIds.map((id) => newOrder.find((b) => b.id === id)!)
		const nonApplicable = newOrder.filter((b) => !applicableIds.includes(b.id))

		// 合併排序
		updateBlockOrder([...reordered, ...nonApplicable])
	},
})

// 隱藏的區塊
const hiddenBlocks = computed(() => {
	return applicableBlocksComputed.value.filter((b) => !b.visible)
})

// 拖放變更事件
const onDragChange = () => {
	// 拖放後自動保存（由 composable 的 watch 處理）
}

// 機台狀態列表
const machineStatuses = computed(() => [
	{ key: 'running', label: t('machine.statusRunning'), color: '#4CAF50' },
	{ key: 'idle', label: t('machine.statusIdle'), color: '#9E9E9E' },
	{ key: 'error', label: t('machine.statusError'), color: '#F44336' },
])

// 返回上一頁
const goBack = () => {
	router.push({ name: 'monitoringOverview' })
}

// 取得機台圖示
const getMachineIcon = () => {
	const icons: Record<string, string> = {
		heading: 'precision_manufacturing',
		threading: 'settings',
		heat_treatment: 'local_fire_department',
	}
	return icons[currentSensorType.value || ''] || 'memory'
}

// 格式化支數顯示
const formatCount = (num: number): string => {
	return num.toString().padStart(6, '0')
}

// 取得工時狀態名稱
const getWorkTimeStatusName = (status: WorkTimeStatus): string => {
	const names: Record<WorkTimeStatus, string> = {
		running: t('machine.statusRunning'),
		paused: t('machine.statusPaused'),
		stopped: t('machine.statusStopped'),
		error: t('machine.statusError'),
	}
	return names[status] || status
}
</script>

<style scoped lang="scss">
@use '@/scss/variables' as *;

.machine-detail {
	padding: 1rem;
}

.header-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
	gap: 1rem;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.page-title {
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
}

.update-time {
	font-size: 0.875rem;
	color: #6c757d;
}

// 編輯模式提示
.edit-mode-hint {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	margin-bottom: 1rem;
	background: rgba($tsc-blue, 0.15);
	border-radius: 8px;
	color: $tsc-blue-deep;
	font-size: 0.875rem;
}

// 網格佈局
.blocks-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1rem;

	@media (max-width: 1200px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
}

// 欄位寬度
.col-span-1 {
	grid-column: span 1;

	@media (max-width: 1200px) {
		grid-column: span 1;
	}

	@media (max-width: 768px) {
		grid-column: span 1;
	}
}

.col-span-2 {
	grid-column: span 2;

	@media (max-width: 1200px) {
		grid-column: span 1;
	}

	@media (max-width: 768px) {
		grid-column: span 1;
	}
}

.col-span-3 {
	grid-column: span 3;

	@media (max-width: 1200px) {
		grid-column: span 2;
	}

	@media (max-width: 768px) {
		grid-column: span 1;
	}
}

.col-span-4 {
	grid-column: span 4;

	@media (max-width: 1200px) {
		grid-column: span 2;
	}

	@media (max-width: 768px) {
		grid-column: span 1;
	}
}

.block-wrapper {
	position: relative;
	transition: all 0.2s;

	&.edit-mode {
		border: 2px dashed $tsc-blue;
		border-radius: 12px;
		background: rgba($tsc-blue, 0.03);
		overflow: hidden;

		&:hover {
			border-color: $tsc-blue-dark;
			background: rgba($tsc-blue, 0.08);
		}

		// 編輯模式下讓卡片無圓角與工具列連接
		.dashboard-card {
			border-radius: 0 0 10px 10px;
		}
	}
}

.block-toolbar {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	background: $tsc-gradient-header;
	border-bottom: 1px solid rgba($tsc-blue, 0.3);
}

.drag-handle {
	cursor: grab;
	color: #9e9e9e;
	padding: 0.25rem;
	display: flex;
	align-items: center;

	&:active {
		cursor: grabbing;
	}
}

.block-title {
	flex: 1;
	font-size: 0.875rem;
	font-weight: 500;
	color: #666;
}

// 欄寬選擇器
.col-span-selector {
	display: flex;
	gap: 2px;
	background: #e0e0e0;
	border-radius: 4px;
	padding: 2px;
}

.col-btn {
	width: 24px;
	height: 24px;
	border: none;
	background: transparent;
	border-radius: 3px;
	font-size: 0.75rem;
	font-weight: 600;
	color: #666;
	cursor: pointer;
	transition: all 0.15s;

	&:hover {
		background: #fff;
	}

	&.active {
		background: $tsc-blue;
		color: $tsc-white;
	}
}

// 拖放 ghost 樣式
.drag-ghost {
	opacity: 0.5;
	background: rgba($tsc-blue, 0.3);
	border: 2px dashed $tsc-blue;
	border-radius: 12px;
}

// 隱藏的區塊
.hidden-blocks {
	margin-top: 1.5rem;
	padding: 1rem;
	background: #fafafa;
	border-radius: 8px;
}

.hidden-blocks-title {
	font-size: 0.875rem;
	font-weight: 600;
	color: #666;
	margin-bottom: 0.75rem;
}

.hidden-blocks-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

// 通用卡片樣式
.dashboard-card {
	height: 100%;
}

.section-title {
	font-size: 1.125rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 1rem;
}

// 機台資訊卡片
.machine-info-grid {
	display: flex;
	align-items: center;
	gap: 1.5rem;

	&.compact {
		flex-direction: column;
		align-items: flex-start;
	}
}

.machine-image {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 120px;
	height: 120px;
	background: $tsc-gradient-header;
	border-radius: 12px;
	border: 2px solid rgba($tsc-blue, 0.3);
}

.machine-details {
	.info-row {
		display: flex;
		align-items: center;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
		gap: 0.5rem;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.info-label {
		font-size: 0.875rem;
		color: #666;
		min-width: 60px;
	}

	.info-value {
		font-size: 1rem;
		font-weight: 600;
		color: #333;
	}
}

.status-badges {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.status-badge {
	padding: 0.25rem 0.75rem;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 500;
	background: #e0e0e0;
	color: #666;
	transition: all 0.2s;

	&.active {
		color: #fff;
	}
}

// 工時進度條
.worktime-progress-container {
	position: relative;
	padding-bottom: 2rem;
}

.worktime-progress-bar {
	position: relative;
	height: 40px;
	background: #f0f0f0;
	border-radius: 4px;
	overflow: hidden;
}

.worktime-segment {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.3s;
}

.worktime-labels {
	position: relative;
	height: 1.5rem;
	margin-top: 0.5rem;
}

.time-label {
	position: absolute;
	transform: translateX(-50%) rotate(-45deg);
	font-size: 0.625rem;
	color: #666;
	white-space: nowrap;
	transform-origin: top center;

	&:nth-child(even) {
		display: none;
	}
}

.worktime-legend {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 1.5rem;
	flex-wrap: wrap;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.75rem;
	color: #666;
}

.legend-color {
	width: 14px;
	height: 14px;
	border-radius: 3px;
}

// 支數顯示
.count-display {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1.5rem 1rem;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-radius: 8px;
	overflow: visible;

	&.compact {
		padding: 1rem 0.5rem;
	}
}

.count-number {
	font-family: 'Digital-7', 'Courier New', Courier, monospace;
	font-size: 4rem;
	font-weight: bold;
	letter-spacing: 0.2rem;
	color: #333;
	line-height: 1.2;

	&.small {
		font-size: 2.5rem;
		letter-spacing: 0.1rem;
	}
}

// 熱處理機溫度顯示
.temperature-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;

	&.compact {
		grid-template-columns: 1fr;
	}
}

.temperature-item {
	background: #f8f9fa;
	border-radius: 8px;
	padding: 1rem;
}

.temp-label {
	font-size: 0.875rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 0.5rem;
}

.temp-values {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.temp-current {
	display: flex;
	align-items: baseline;
	gap: 0.25rem;
}

.temp-value {
	font-size: 2rem;
	font-weight: bold;
	color: $tsc-blue;
}

.temp-unit {
	font-size: 1rem;
	color: #666;
}

.temp-set {
	font-size: 0.75rem;
	color: #666;
}

// 輾牙機速率顯示
.rate-display {
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	flex-wrap: wrap;
}

.rate-item {
	display: flex;
	align-items: baseline;
	gap: 0.5rem;
	background: #f8f9fa;
	padding: 1rem 1.5rem;
	border-radius: 8px;
}

.rate-label {
	font-size: 0.875rem;
	color: #666;
}

.rate-value {
	font-size: 2rem;
	font-weight: bold;
	color: $tsc-blue;
}

.rate-unit {
	font-size: 0.875rem;
	color: #666;
}

// 感測器燈號
.lights-grid {
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	flex-wrap: wrap;

	&.compact {
		gap: 1rem;
	}
}

.light-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.light-indicator {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	transition: all 0.3s;

	&.small {
		width: 40px;
		height: 40px;
	}

	&.light-off {
		background: linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%);
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	&.light-on {
		background: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
		box-shadow:
			0 0 15px rgba(76, 175, 80, 0.5),
			inset 0 2px 4px rgba(255, 255, 255, 0.3);
	}

	&.light-alarm {
		background: linear-gradient(135deg, #e57373 0%, #f44336 100%);
		box-shadow:
			0 0 15px rgba(244, 67, 54, 0.5),
			inset 0 2px 4px rgba(255, 255, 255, 0.3);
		animation: pulse-alarm 1s infinite;
	}
}

@keyframes pulse-alarm {
	0%,
	100% {
		transform: scale(1);
		box-shadow:
			0 0 15px rgba(244, 67, 54, 0.5),
			inset 0 2px 4px rgba(255, 255, 255, 0.3);
	}
	50% {
		transform: scale(1.05);
		box-shadow:
			0 0 25px rgba(244, 67, 54, 0.7),
			inset 0 2px 4px rgba(255, 255, 255, 0.3);
	}
}

.light-label {
	font-size: 0.75rem;
	color: #666;
	text-align: center;
}

.is-alarm .light-label {
	color: #f44336;
	font-weight: 500;
}

// Loading & Error states
.loading-state,
.error-state {
	min-height: 300px;
}
</style>
