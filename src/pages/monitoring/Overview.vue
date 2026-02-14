<template>
	<div class="sensor-overview">
		<!-- 頂部狀態圖例與更新時間 -->
		<div class="header-bar">
			<!-- 狀態圖例（使用統一常數） -->
			<div class="status-legend">
				<div v-for="item in statusLegend" :key="item.key" class="legend-item">
					<span class="legend-dot" :style="{ backgroundColor: item.color }" />
					<span class="legend-text">{{ item.label }}</span>
				</div>
			</div>

			<!-- 更新時間 -->
			<div class="update-time-container">
				<span class="text-sm text-gray-600">
					{{ t('sensor.lastUpdate') }}： {{ formattedLastUpdate }}
				</span>
				<button
					class="polling-toggle"
					:class="{ 'is-polling': isPolling }"
					:title="isPolling ? t('machine.stopAutoRefresh') : t('machine.startAutoRefresh')"
					@click="togglePolling"
				>
					<VaIcon :name="isPolling ? 'sync' : 'sync_disabled'" size="18px" />
				</button>
			</div>
		</div>

		<!-- Loading 狀態 -->
		<div v-if="isLoading && !sensorData" class="loading-state">
			<VaInnerLoading :loading="true">
				<div class="h-64 flex items-center justify-center">
					<span class="text-gray-500">{{ t('sensor.loading') }}</span>
				</div>
			</VaInnerLoading>
		</div>

		<!-- 錯誤狀態 -->
		<div v-else-if="errorMessage && !sensorData" class="error-state">
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

		<template v-else>
			<!-- 三欄並排顯示 -->
			<div class="sensor-sections-container">
				<div
					v-for="sensorType in sensorTypes"
					:key="sensorType"
					class="sensor-section-card"
				>
					<!-- 區塊標題 -->
					<h2 class="section-title">{{ getSensorTypeName(sensorType) }}</h2>

					<!-- 機台網格 -->
					<div class="machine-grid">
						<div
							v-for="sensor in getSensorsByType(sensorType)"
							:key="sensor.sensor_id"
							class="machine-card"
							:style="getMachineCardStyle(sensor.machine_status)"
							role="button"
							tabindex="0"
							:aria-label="`${formatMachineName(sensor).replace('\n', ' ')} - ${getStatusLabel(sensor.machine_status)}`"
							@click="handleSensorClick(sensor)"
							@keydown.enter="handleSensorClick(sensor)"
							@keydown.space.prevent="handleSensorClick(sensor)"
						>
							<div class="machine-label">
								{{ formatMachineName(sensor) }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSensorOverview } from '@/composables/sensor/useSensorOverview'
import type { SensorStatus, MachineStatus } from '@/services/SensorService'
import { MACHINE_STATUS_LIST, MACHINE_STATUS_COLORS } from '@/constants'

const { t } = useI18n()
const router = useRouter()

const {
	sensorData,
	isLoading,
	errorMessage,
	sensorTypes,
	formattedLastUpdate,
	isPolling,
	getSensorsByType,
	getSensorTypeName,
	togglePolling,
	refresh,
} = useSensorOverview({pollingInterval: 5000})

// 狀態圖例（使用統一常數）
const statusLegend = computed(() =>
	MACHINE_STATUS_LIST.map((item) => ({
		key: item.key,
		label: t(`machine.status${item.key.charAt(0).toUpperCase() + item.key.slice(1)}`),
		color: item.color,
	}))
)

/**
 * 取得機台卡片樣式（根據 machine_status）
 */
const getMachineCardStyle = (status: MachineStatus) => {
	const color = MACHINE_STATUS_COLORS[status] || MACHINE_STATUS_COLORS.unknown
	return {
		backgroundColor: color,
		borderColor: adjustColor(color, -20),
	}
}

/**
 * 調整顏色亮度
 */
const adjustColor = (hex: string, percent: number): string => {
	const num = parseInt(hex.replace('#', ''), 16)
	const r = Math.min(255, Math.max(0, (num >> 16) + percent))
	const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
	const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * 取得狀態標籤文字
 */
const getStatusLabel = (status: MachineStatus): string => {
	return t(`machine.status${status.charAt(0).toUpperCase() + status.slice(1)}`)
}

/**
 * 格式化機台名稱顯示
 * Demo 機: "Demo\n打頭" (兩行)
 * 一般機: "打頭2" (單行)
 */
const formatMachineName = (sensor: SensorStatus) => {
	const typeName = getSensorTypeName(sensor.sensor_type)

	// 檢查是否為 Demo 機
	if (sensor.sensor_id.endsWith('_demo')) {
		return `Demo\n${typeName}`
	}

	// 一般機台：取得編號
	const parts = sensor.sensor_id.split('_')
	const num = parts[parts.length - 1]

	// 轉換編號格式 (01 -> 1, 10 -> 10)
	const numInt = parseInt(num, 10)
	return `${typeName}${numInt}`
}

const handleSensorClick = (sensor: SensorStatus) => {
	router.push({
		name: 'monitoringMachine',
		query: {
			type: sensor.sensor_type,
			id: sensor.sensor_id,
		},
	})
}
</script>

<style scoped lang="scss">
@use '@/scss/variables' as *;

.sensor-overview {
	padding: 0.5rem;
}

// ===== 頂部狀態欄 =====
.header-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
	flex-wrap: wrap;
	gap: 1rem;
}

// ===== 狀態圖例 =====
.status-legend {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 0.375rem;
}

.legend-dot {
	width: 14px;
	height: 14px;
	border-radius: 3px;
	flex-shrink: 0;
}

.legend-text {
	font-size: 0.75rem;
	color: $text-secondary;
}

// ===== 更新時間區域 =====
.update-time-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.text-gray-600 {
	color: $text-secondary;
}

.polling-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border: none;
	border-radius: 50%;
	background: transparent;
	color: $text-secondary;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background: rgba($tsc-blue, 0.1);
		color: $tsc-blue;
	}

	&.is-polling {
		color: $tsc-blue;

		:deep(.va-icon) {
			animation: spin 2s linear infinite;
		}
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

// ===== 三欄並排容器 =====
.sensor-sections-container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1.5rem;
	align-items: start;

	@media (max-width: 1200px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
}

// 每個區塊的卡片
.sensor-section-card {
	border: 1px solid $border-color;
	border-radius: $radius-lg;
	padding: 1.25rem;
	background: $bg-primary;
	transition: $transition-fast;

	&:hover {
		border-color: $tsc-blue;
	}
}

// 區塊標題
.section-title {
	font-size: 1.25rem;
	font-weight: 600;
	color: $text-primary;
	margin-bottom: 1rem;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid $border-color;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	&::before {
		content: '';
		width: 4px;
		height: 1.25rem;
		background: $tsc-blue;
		border-radius: 2px;
	}
}

// 機台網格
.machine-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
	gap: 0.625rem;
}

// 機台卡片
.machine-card {
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: $radius-md;
	cursor: pointer;
	transition: all 0.15s ease;
	min-height: 65px;
	max-width: 90px;
	border: 2px solid transparent;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}

	// 上線狀態 - 科技綠
	&.is-online {
		background: $machine-running;
		border-color: darken($machine-running, 10%);

		.machine-label {
			color: #ffffff;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		}

		&:hover {
			background: darken($machine-running, 5%);
		}
	}

	// 離線狀態 - 深灰色（關機）
	&.is-offline {
		background: #616161;
		border-color: #4a4a4a;

		.machine-label {
			color: #ffffff;
		}

		&:hover {
			background: #525252;
		}
	}

	.machine-label {
		font-size: 0.8125rem;
		font-weight: 600;
		text-align: center;
		white-space: pre-line;
		line-height: 1.3;
	}
}

.loading-state,
.error-state {
	min-height: 300px;
}
</style>

<style lang="scss">
// ===== 暗色模式 (非 scoped，確保樣式正確套用) =====
body.dark-mode,
body.va-dark {
	.sensor-overview {
		.text-gray-600 {
			color: #94a3b8 !important;
		}

		.legend-text {
			color: #94a3b8 !important;
		}

		.polling-toggle {
			color: #64748b !important;

			&:hover {
				background: rgba(56, 189, 248, 0.15) !important;
				color: #38bdf8 !important;
			}

			&.is-polling {
				color: #38bdf8 !important;
			}
		}
	}

	// 區塊卡片 - 深色背景
	.sensor-section-card {
		background: #1e293b !important;
		border-color: #334155 !important;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;

		&:hover {
			border-color: #38bdf8 !important;
		}
	}

	// 標題 - 淺色文字
	.section-title {
		color: #f8fafc !important;
		border-bottom-color: #334155 !important;

		&::before {
			background: #38bdf8 !important;
		}
	}

	// 機台卡片顏色保持不變（狀態色彩）
	.machine-card {
		&.is-online {
			background: #22c55e !important;
			border-color: #16a34a !important;

			&:hover {
				background: #16a34a !important;
			}
		}

		&.is-offline {
			background: #616161 !important;
			border-color: #4a4a4a !important;

			&:hover {
				background: #475569 !important;
			}

			.machine-label {
				color: #ffffff !important;
			}
		}
	}
}
</style>
