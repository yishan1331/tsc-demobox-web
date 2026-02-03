/**
 * useSensorOverview - 感測器總覽 Composable 層
 *
 * 職責：
 * - 管理響應式狀態 (ref, reactive, computed)
 * - 處理 Toast 通知
 * - 處理 Loading 狀態
 * - 整合 Vue 生態系統 (i18n, router 等)
 * - 呼叫 Service 層方法
 *
 * 規範：
 * - 只能呼叫 Service 層，不能直接呼叫 API
 * - 不包含業務邏輯（業務邏輯在 Service 層）
 */

import { ref, computed, readonly, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { SensorService, type SensorStatusResponse, type SensorType } from '@/services/SensorService'
import { TOAST_LIFE_TIME } from '@/constants'

interface UseSensorOverviewOptions {
	/** 自動載入資料，預設為 true */
	autoLoad?: boolean
	/** 自動輪詢間隔（毫秒），0 表示不輪詢，預設 30000 (30秒) */
	pollingInterval?: number
}

export const useSensorOverview = (options: UseSensorOverviewOptions = {}) => {
	const { autoLoad = true, pollingInterval = 30000 } = options

	const { init: notify } = useToast()
	const { t } = useI18n()

	// ===== 響應式狀態 =====
	const sensorData = ref<SensorStatusResponse | null>(null)
	const isLoading = ref(false)
	const lastUpdate = ref<Date | null>(null)
	const errorMessage = ref<string | null>(null)

	// 輪詢相關狀態
	let pollingTimer: ReturnType<typeof setInterval> | null = null
	const isPolling = ref(false)

	// ===== 計算屬性 =====

	/** 感測器統計資訊 */
	const stats = computed(() => {
		if (!sensorData.value) {
			return {
				total: 0,
				online: 0,
				offline: 0,
				byType: {
					heading: { total: 0, online: 0 },
					threading: { total: 0, online: 0 },
					heat_treatment: { total: 0, online: 0 },
				},
			}
		}
		return SensorService.calculateSensorStats(sensorData.value)
	})

	/** 所有感測器類型 */
	const sensorTypes = computed(() => SensorService.getAllSensorTypes())

	/** 格式化的最後更新時間 */
	const formattedLastUpdate = computed(() => {
		if (!lastUpdate.value) return '-'
		return SensorService.formatTimestamp(lastUpdate.value.toISOString())
	})

	// ===== 方法 =====

	/**
	 * 載入所有感測器狀態
	 */
	const fetchSensorStatus = async () => {
		isLoading.value = true
		errorMessage.value = null

		try {
			const data = await SensorService.fetchAllSensorStatus()
			sensorData.value = data
			lastUpdate.value = new Date()
		} catch (error) {
			const message = error instanceof Error ? error.message : t('sensor.fetchError')
			errorMessage.value = message
			notify({
				message,
				color: 'danger',
				duration: TOAST_LIFE_TIME,
			})
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * 取得特定類型的感測器列表
	 */
	const getSensorsByType = (type: SensorType) => {
		if (!sensorData.value) return []
		return sensorData.value[type] || []
	}

	/**
	 * 取得感測器類型的顯示名稱
	 */
	const getSensorTypeName = (type: SensorType) => {
		return SensorService.getSensorTypeName(type)
	}

	/**
	 * 取得感測器類型的英文名稱
	 */
	const getSensorTypeEnglishName = (type: SensorType) => {
		return SensorService.getSensorTypeEnglishName(type)
	}

	/**
	 * 啟動自動輪詢
	 */
	const startPolling = () => {
		if (pollingInterval <= 0 || pollingTimer) return

		pollingTimer = setInterval(() => {
			fetchSensorStatus()
		}, pollingInterval)
		isPolling.value = true
	}

	/**
	 * 停止自動輪詢
	 */
	const stopPolling = () => {
		if (pollingTimer) {
			clearInterval(pollingTimer)
			pollingTimer = null
		}
		isPolling.value = false
	}

	/**
	 * 切換自動輪詢狀態
	 */
	const togglePolling = () => {
		if (isPolling.value) {
			stopPolling()
		} else {
			startPolling()
		}
	}

	/**
	 * 手動重新載入
	 */
	const refresh = async () => {
		await fetchSensorStatus()
	}

	// ===== 生命週期 =====

	onMounted(() => {
		if (autoLoad) {
			fetchSensorStatus()
		}
		if (pollingInterval > 0) {
			startPolling()
		}
	})

	onUnmounted(() => {
		stopPolling()
	})

	// ===== 返回 =====
	return {
		// 響應式狀態 (readonly)
		sensorData: readonly(sensorData),
		isLoading: readonly(isLoading),
		lastUpdate: readonly(lastUpdate),
		errorMessage: readonly(errorMessage),
		isPolling: readonly(isPolling),

		// 計算屬性
		stats,
		sensorTypes,
		formattedLastUpdate,

		// 方法
		fetchSensorStatus,
		getSensorsByType,
		getSensorTypeName,
		getSensorTypeEnglishName,
		startPolling,
		stopPolling,
		togglePolling,
		refresh,
	}
}
