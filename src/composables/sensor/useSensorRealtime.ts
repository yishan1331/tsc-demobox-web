/**
 * useSensorRealtime - 感測器即時狀態 Composable 層
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

import { ref, computed, readonly, onMounted, onUnmounted, watch } from 'vue'
import { useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
	SensorService,
	type SensorType,
	type SensorRealtimeResponse,
	type SensorLight,
	type MachineStatus,
	type GenericSensorData,
} from '@/services/SensorService'
import { TOAST_LIFE_TIME } from '@/constants'

interface UseSensorRealtimeOptions {
	/** 自動載入資料，預設為 true */
	autoLoad?: boolean
	/** 自動輪詢間隔（毫秒），0 表示不輪詢，預設 5000 (5秒) */
	pollingInterval?: number
}

export const useSensorRealtime = (options: UseSensorRealtimeOptions = {}) => {
	const { autoLoad = true, pollingInterval = 5000 } = options

	const { init: notify } = useToast()
	const { t } = useI18n()
	const route = useRoute()

	// ===== 響應式狀態 =====
	const realtimeData = ref<SensorRealtimeResponse | null>(null)
	const isLoading = ref(false)
	const lastUpdate = ref<Date | null>(null)
	const errorMessage = ref<string | null>(null)

	// 當前選擇的感測器
	const currentSensorType = ref<SensorType | null>(null)
	const currentSensorId = ref<string | null>(null)

	// 輪詢 Timer ID
	let pollingTimer: ReturnType<typeof setInterval> | null = null

	// ===== 計算屬性 =====

	/** 機台狀態 */
	const machineStatus = computed<MachineStatus>(() => {
		return realtimeData.value?.machine_status || 'offline'
	})

	/** 機台狀態名稱 */
	const machineStatusName = computed(() => {
		return SensorService.getMachineStatusName(machineStatus.value)
	})

	/** 機台狀態顏色 */
	const machineStatusColor = computed(() => {
		return SensorService.getMachineStatusColor(machineStatus.value)
	})

	/** 感測器燈號列表 */
	const sensorLights = computed<SensorLight[]>(() => {
		if (!currentSensorType.value || !realtimeData.value) return []
		return SensorService.getSensorLights(currentSensorType.value, realtimeData.value.current_data)
	})

	/** 支數 */
	const count = computed<number>(() => {
		return realtimeData.value?.count || 0
	})

	/** 工時進度條資料 */
	const workTimeProgress = computed(() => {
		if (!realtimeData.value?.work_time_segments) return []
		return SensorService.calculateWorkTimeProgress(realtimeData.value.work_time_segments)
	})

	/** 24小時時間軸標籤 */
	const timeLabels = computed(() => {
		return SensorService.generateTimeLabels()
	})

	/** 感測器類型名稱 */
	const sensorTypeName = computed(() => {
		if (!currentSensorType.value) return ''
		return SensorService.getSensorTypeName(currentSensorType.value)
	})

	/** 格式化的最後更新時間 */
	const formattedLastUpdate = computed(() => {
		if (!lastUpdate.value) return '-'
		return SensorService.formatTimestamp(lastUpdate.value.toISOString())
	})

	/** 當前感測器數據 */
	const currentData = computed<GenericSensorData | null>(() => {
		return realtimeData.value?.current_data || null
	})

	/** 熱處理機特殊數據 */
	const heatTreatmentData = computed(() => {
		if (currentSensorType.value !== 'heat_treatment') return []
		return SensorService.getHeatTreatmentDisplayData(currentData.value)
	})

	/** 輾牙機特殊數據 */
	const threadingData = computed(() => {
		if (currentSensorType.value !== 'threading') return []
		return SensorService.getThreadingDisplayData(currentData.value)
	})

	// ===== 方法 =====

	/**
	 * 從 URL Query 初始化感測器選擇
	 */
	const initFromRoute = () => {
		const type = route.query.type as SensorType | undefined
		const id = route.query.id as string | undefined

		if (type && id) {
			currentSensorType.value = type
			currentSensorId.value = id
		}
	}

	/**
	 * 載入即時數據
	 */
	const fetchRealtimeData = async () => {
		if (!currentSensorType.value || !currentSensorId.value) {
			return
		}

		isLoading.value = true
		errorMessage.value = null

		try {
			const data = await SensorService.fetchSensorRealtime(currentSensorType.value, currentSensorId.value)
			realtimeData.value = data
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
	 * 設定當前感測器
	 */
	const setSensor = (type: SensorType, id: string) => {
		currentSensorType.value = type
		currentSensorId.value = id
		fetchRealtimeData()
	}

	/**
	 * 啟動自動輪詢
	 */
	const startPolling = () => {
		if (pollingInterval <= 0 || pollingTimer) return

		pollingTimer = setInterval(() => {
			fetchRealtimeData()
		}, pollingInterval)
	}

	/**
	 * 停止自動輪詢
	 */
	const stopPolling = () => {
		if (pollingTimer) {
			clearInterval(pollingTimer)
			pollingTimer = null
		}
	}

	/**
	 * 手動重新載入
	 */
	const refresh = async () => {
		await fetchRealtimeData()
	}

	/**
	 * 取得感測器類型名稱
	 */
	const getSensorTypeName = (type: SensorType) => {
		return SensorService.getSensorTypeName(type)
	}

	// ===== 監聽 =====

	// 當感測器改變時重新載入
	watch([currentSensorType, currentSensorId], () => {
		if (currentSensorType.value && currentSensorId.value) {
			fetchRealtimeData()
		}
	})

	// ===== 生命週期 =====

	onMounted(() => {
		initFromRoute()

		if (autoLoad && currentSensorType.value && currentSensorId.value) {
			fetchRealtimeData()
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
		realtimeData: readonly(realtimeData),
		isLoading: readonly(isLoading),
		lastUpdate: readonly(lastUpdate),
		errorMessage: readonly(errorMessage),
		currentSensorType: readonly(currentSensorType),
		currentSensorId: readonly(currentSensorId),

		// 計算屬性
		machineStatus,
		machineStatusName,
		machineStatusColor,
		sensorLights,
		count,
		workTimeProgress,
		timeLabels,
		sensorTypeName,
		formattedLastUpdate,
		currentData,
		heatTreatmentData,
		threadingData,

		// 方法
		fetchRealtimeData,
		setSensor,
		startPolling,
		stopPolling,
		refresh,
		getSensorTypeName,
	}
}
