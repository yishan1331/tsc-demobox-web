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
							@click="handleSensorClick(sensor)"
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
	padding: 1rem;
}

// ===== 三欄並排容器 =====
.sensor-sections-container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1.5rem;
	align-items: start;

	@media (max-width: 1024px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
}

// 每個區塊的卡片
.sensor-section-card {
	border: 1px solid $tsc-grey;
	border-radius: 8px;
	padding: 1.25rem;
	background: $tsc-white;
}

// 區塊標題
.section-title {
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 1rem;
	padding-bottom: 0.5rem;
}

// 機台網格
.machine-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
	gap: 0.75rem;
}

// 機台卡片
.machine-card {
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s ease;
	min-height: 70px;
	max-width: 100px;

	&:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	// 上線狀態 - 綠色
	&.is-online {
		background: $machine-running;

		.machine-label {
			color: $tsc-white;
		}
	}

	// 離線狀態 - 灰色
	&.is-offline {
		background: $machine-idle;

		.machine-label {
			color: $tsc-grey-neutral;
		}
	}

	.machine-label {
		font-size: 0.875rem;
		font-weight: 500;
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
