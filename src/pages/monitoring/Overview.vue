<template>
	<div class="sensor-overview">
		<!-- 頂部更新時間 -->
		<div class="flex justify-end items-center mb-4">
			<span class="text-sm text-gray-600">
				{{ t('sensor.lastUpdate') }}： {{ formattedLastUpdate }}
			</span>
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
							:class="{ 'is-online': sensor.is_online, 'is-offline': !sensor.is_online }"
							role="button"
							tabindex="0"
							:aria-label="`${formatMachineName(sensor).replace('\n', ' ')} - ${sensor.is_online ? t('sensor.online') : t('sensor.offline')}`"
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
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSensorOverview } from '@/composables/sensor/useSensorOverview'
import type { SensorStatus } from '@/services/SensorService'

const { t } = useI18n()
const router = useRouter()

const {
	sensorData,
	isLoading,
	errorMessage,
	sensorTypes,
	formattedLastUpdate,
	getSensorsByType,
	getSensorTypeName,
	refresh,
} = useSensorOverview()

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

// ===== 更新時間文字 =====
.text-gray-600 {
	color: $text-secondary;
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

	// 離線狀態 - 灰色
	&.is-offline {
		background: $machine-idle;
		border-color: darken($machine-idle, 10%);

		.machine-label {
			color: #ffffff;
		}

		&:hover {
			background: darken($machine-idle, 5%);
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
			background: #64748b !important;
			border-color: #475569 !important;

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
