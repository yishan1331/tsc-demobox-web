/**
 * useSensorHistory - 感測器歷史資料 Composable 層
 *
 * 職責：
 * - 管理響應式狀態 (ref, reactive, computed)
 * - 處理 Toast 通知
 * - 處理 Loading 狀態
 * - 整合 Vue 生態系統 (i18n 等)
 * - 呼叫 Service 層方法
 */

import { ref, computed, readonly, watch } from 'vue'
import { useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import {
	SensorService,
	type SensorType,
	type SensorStatus,
	type SensorHistoryResponse,
	type SensorData,
} from '@/services/SensorService'
import { TOAST_LIFE_TIME } from '@/constants'

export interface UseSensorHistoryOptions {
	/** 預設每頁筆數 */
	defaultPageSize?: number
}

export const useSensorHistory = (options: UseSensorHistoryOptions = {}) => {
	const { defaultPageSize = 20 } = options

	const { init: notify } = useToast()
	const { t } = useI18n()

	// ===== 響應式狀態 =====

	// 查詢條件
	const selectedSensorType = ref<SensorType | null>(null)
	const selectedSensorId = ref<string | null>(null)
	const startDate = ref<Date | null>(null)
	const endDate = ref<Date | null>(null)

	// 感測器列表 (依據選擇的類型)
	const sensorList = ref<SensorStatus[]>([])
	const isLoadingSensorList = ref(false)

	// 歷史資料
	const historyData = ref<SensorHistoryResponse | null>(null)
	const isLoading = ref(false)
	const errorMessage = ref<string | null>(null)

	// 分頁
	const currentPage = ref(1)
	const pageSize = ref(defaultPageSize)

	// ===== 計算屬性 =====

	/** 感測器類型選項 */
	const sensorTypeOptions = computed(() => {
		const types = SensorService.getAllSensorTypes()
		return types.map((type) => ({
			value: type,
			label: SensorService.getSensorTypeName(type),
		}))
	})

	/** 感測器選項 (依據選擇的類型) */
	const sensorOptions = computed(() => {
		return sensorList.value.map((sensor) => ({
			value: sensor.sensor_id,
			label: sensor.sensor_name,
		}))
	})

	/** 歷史資料列表 */
	const historyRecords = computed<SensorData[]>(() => {
		return historyData.value?.data || []
	})

	/** 分頁資訊 */
	const pagination = computed(() => {
		return (
			historyData.value?.pagination || {
				current_page: 1,
				total_pages: 1,
				total_records: 0,
				page_size: defaultPageSize,
			}
		)
	})

	/** 總筆數 */
	const totalRecords = computed(() => pagination.value.total_records)

	/** 總頁數 */
	const totalPages = computed(() => pagination.value.total_pages)

	/** 是否可以查詢 */
	const canQuery = computed(() => {
		return selectedSensorType.value && selectedSensorId.value && startDate.value && endDate.value
	})

	/** 取得當前感測器名稱 */
	const currentSensorName = computed(() => {
		return historyData.value?.sensor_name || ''
	})

	/** 取得當前感測器類型名稱 */
	const currentSensorTypeName = computed(() => {
		if (!selectedSensorType.value) return ''
		return SensorService.getSensorTypeName(selectedSensorType.value)
	})

	/** 根據感測器類型取得欄位定義 */
	const tableColumns = computed(() => {
		if (!selectedSensorType.value) return []

		const baseColumns = [{ key: 'timestamp', label: t('history.timestamp'), sortable: true }]

		switch (selectedSensorType.value) {
			case 'heading':
				return [
					...baseColumns,
					{ key: 'pwr_light', label: t('history.columns.pwrLight') },
					{ key: 'OPR', label: t('history.columns.opr') },
					{ key: 'air_press_light', label: t('history.columns.airPressLight') },
					{ key: 'in_lube', label: t('history.columns.inLube') },
					{ key: 'sf_door', label: t('history.columns.sfDoor') },
					{ key: 'end_lube_press', label: t('history.columns.endLubePress') },
					{ key: 'cnt', label: t('history.columns.count') },
				]
			case 'threading':
				return [
					...baseColumns,
					{ key: 'pwr_light', label: t('history.columns.pwrLight') },
					{ key: 'OPR', label: t('history.columns.opr') },
					{ key: 'rate', label: t('history.columns.rate') },
					{ key: 'cnt', label: t('history.columns.count') },
				]
			case 'heat_treatment':
				return [
					...baseColumns,
					{ key: 'pwr_light', label: t('history.columns.pwrLight') },
					{ key: 'OPR', label: t('history.columns.opr') },
					{ key: 'quench_furn_temp', label: t('history.columns.quenchFurnTemp') },
					{ key: 'quench_furn_temp_set', label: t('history.columns.quenchFurnTempSet') },
					{ key: 'tempering_furn_temp', label: t('history.columns.temperingFurnTemp') },
					{ key: 'tempering_furn_temp_set', label: t('history.columns.temperingFurnTempSet') },
					{ key: 'conv_freq', label: t('history.columns.convFreq') },
					{ key: 'conv_freq_set', label: t('history.columns.convFreqSet') },
				]
			default:
				return baseColumns
		}
	})

	// ===== 方法 =====

	/**
	 * 載入感測器列表
	 */
	const fetchSensorList = async (type: SensorType) => {
		isLoadingSensorList.value = true
		try {
			const list = await SensorService.fetchSensorListByType(type)
			sensorList.value = list
		} catch (error) {
			const message = error instanceof Error ? error.message : t('sensor.fetchError')
			notify({
				message,
				color: 'danger',
				duration: TOAST_LIFE_TIME,
			})
			sensorList.value = []
		} finally {
			isLoadingSensorList.value = false
		}
	}

	/**
	 * 查詢歷史資料
	 */
	const fetchHistory = async () => {
		if (!selectedSensorType.value || !selectedSensorId.value) {
			notify({
				message: t('history.selectSensorFirst'),
				color: 'warning',
				duration: TOAST_LIFE_TIME,
			})
			return
		}

		if (!startDate.value || !endDate.value) {
			notify({
				message: t('history.selectDateFirst'),
				color: 'warning',
				duration: TOAST_LIFE_TIME,
			})
			return
		}

		isLoading.value = true
		errorMessage.value = null

		try {
			const data = await SensorService.fetchSensorHistory(
				selectedSensorType.value,
				selectedSensorId.value,
				{
					start_date: formatDateForAPI(startDate.value),
					end_date: formatDateForAPI(endDate.value),
					page: currentPage.value,
					limit: pageSize.value,
				}
			)
			historyData.value = data
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
	 * 設定感測器類型
	 */
	const setSensorType = (type: SensorType | null) => {
		selectedSensorType.value = type
		selectedSensorId.value = null
		historyData.value = null

		if (type) {
			fetchSensorList(type)
		} else {
			sensorList.value = []
		}
	}

	/**
	 * 設定感測器
	 */
	const setSensor = (sensorId: string | null) => {
		selectedSensorId.value = sensorId
		historyData.value = null
	}

	/**
	 * 設定日期範圍
	 */
	const setDateRange = (start: Date | null, end: Date | null) => {
		startDate.value = start
		endDate.value = end
	}

	/**
	 * 切換頁面
	 */
	const goToPage = (page: number) => {
		currentPage.value = page
		fetchHistory()
	}

	/**
	 * 更新每頁筆數
	 */
	const setPageSize = (size: number) => {
		pageSize.value = size
		currentPage.value = 1
		if (historyData.value) {
			fetchHistory()
		}
	}

	/**
	 * 重置查詢條件
	 */
	const resetQuery = () => {
		selectedSensorType.value = null
		selectedSensorId.value = null
		startDate.value = null
		endDate.value = null
		currentPage.value = 1
		historyData.value = null
		sensorList.value = []
	}

	/**
	 * 匯出 Excel
	 */
	const exportToExcel = async () => {
		if (!historyRecords.value.length) {
			notify({
				message: t('history.noDataToExport'),
				color: 'warning',
				duration: TOAST_LIFE_TIME,
			})
			return
		}

		try {
			// 準備匯出資料
			const columns = tableColumns.value
			const headers = columns.map((col) => col.label)
			const rows = historyRecords.value.map((record) =>
				columns.map((col) => {
					const value = (record as unknown as Record<string, unknown>)[col.key]
					if (col.key === 'timestamp') {
						return SensorService.formatTimestamp(value as string)
					}
					return value ?? '-'
				})
			)

			// 建立 CSV 內容
			const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

			// 建立 BOM 以支援中文
			const BOM = '\uFEFF'
			const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

			// 下載檔案
			const link = document.createElement('a')
			const url = URL.createObjectURL(blob)
			const fileName = `${currentSensorName.value}_${formatDateForAPI(startDate.value!)}_${formatDateForAPI(endDate.value!)}.csv`

			link.setAttribute('href', url)
			link.setAttribute('download', fileName)
			link.style.visibility = 'hidden'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			notify({
				message: t('history.exportSuccess'),
				color: 'success',
				duration: TOAST_LIFE_TIME,
			})
		} catch (error) {
			notify({
				message: t('history.exportError'),
				color: 'danger',
				duration: TOAST_LIFE_TIME,
			})
		}
	}

	// ===== 工具函數 =====

	/**
	 * 格式化日期為 API 格式 (YYYY-MM-DD)
	 */
	const formatDateForAPI = (date: Date): string => {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	/**
	 * 格式化時間戳顯示
	 */
	const formatTimestamp = (timestamp: string): string => {
		return SensorService.formatTimestamp(timestamp)
	}

	/**
	 * 格式化燈號值顯示
	 */
	const formatLightValue = (value: number | null): string => {
		if (value === null) return '-'
		return value === 1 ? 'ON' : 'OFF'
	}

	// ===== 監聽 =====

	// 當感測器類型改變時載入感測器列表
	watch(selectedSensorType, (newType) => {
		if (newType) {
			fetchSensorList(newType)
		}
	})

	// ===== 返回 =====
	return {
		// 響應式狀態 (readonly)
		selectedSensorType: readonly(selectedSensorType),
		selectedSensorId: readonly(selectedSensorId),
		startDate: readonly(startDate),
		endDate: readonly(endDate),
		sensorList: readonly(sensorList),
		isLoadingSensorList: readonly(isLoadingSensorList),
		historyData: readonly(historyData),
		isLoading: readonly(isLoading),
		errorMessage: readonly(errorMessage),
		currentPage: readonly(currentPage),
		pageSize: readonly(pageSize),

		// 計算屬性
		sensorTypeOptions,
		sensorOptions,
		historyRecords,
		pagination,
		totalRecords,
		totalPages,
		canQuery,
		currentSensorName,
		currentSensorTypeName,
		tableColumns,

		// 方法
		fetchSensorList,
		fetchHistory,
		setSensorType,
		setSensor,
		setDateRange,
		goToPage,
		setPageSize,
		resetQuery,
		exportToExcel,

		// 工具函數
		formatTimestamp,
		formatLightValue,
	}
}
