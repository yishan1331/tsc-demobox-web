/**
 * SensorService - 感測器業務邏輯層
 *
 * 職責：
 * - 純業務邏輯實作
 * - API 呼叫封裝
 * - 資料轉換與驗證
 *
 * 規範：
 * - 使用 Class 靜態方法
 * - 不包含響應式狀態（不使用 ref、reactive）
 * - 不直接操作 Store、Toast 或 Router
 * - 返回 Promise，不返回響應式物件
 */

import {
	getSensorStatus,
	getSensorRealtime,
	getSensorHistory,
	getSensorList,
	type SensorType,
	type SensorStatus,
	type SensorStatusResponse,
	type SensorRealtimeResponse,
	type SensorHistoryResponse,
	type SensorData,
	type GenericSensorData,
	type SensorLight,
	type MachineStatus,
	type WorkTimeStatus,
	type WorkTimeSegment,
} from './APIs/sensor.api'
import { formatDateTime } from '@/utils/timer.utils'
import {
	MACHINE_STATUS_NAMES_ZH,
	getMachineStatusColor as getStatusColor,
	getWorkTimeStatusColor as getWorkTimeColor,
} from '@/constants'

export class SensorService {
	// ===== 機台總覽相關 =====

	/**
	 * 取得所有感測器狀態
	 * @throws Error 當 API 回傳錯誤時
	 */
	static async fetchAllSensorStatus(): Promise<SensorStatusResponse> {
		const result = await getSensorStatus()
		if (result.status === 'error') {
			throw new Error(result.message || '取得感測器狀態失敗')
		}
		return result.data
	}

	/**
	 * 取得特定類型的感測器列表
	 */
	static async fetchSensorListByType(sensorType: SensorType): Promise<SensorStatus[]> {
		const result = await getSensorList(sensorType)
		if (result.status === 'error') {
			throw new Error(result.message || '取得感測器列表失敗')
		}
		return result.data
	}

	// ===== 即時狀態相關 =====

	/**
	 * 取得單一感測器即時數據
	 */
	static async fetchSensorRealtime(
		sensorType: SensorType,
		sensorId: string
	): Promise<SensorRealtimeResponse> {
		const result = await getSensorRealtime(sensorType, sensorId)
		if (result.status === 'error') {
			throw new Error(result.message || '取得即時數據失敗')
		}
		return result.data
	}

	// ===== 歷史資料相關 =====

	/**
	 * 取得感測器歷史數據
	 */
	static async fetchSensorHistory(
		sensorType: SensorType,
		sensorId: string,
		params: {
			start_date?: string
			end_date?: string
			page?: number
			limit?: number
		}
	): Promise<SensorHistoryResponse> {
		const result = await getSensorHistory(sensorType, sensorId, params)
		if (result.status === 'error') {
			throw new Error(result.message || '取得歷史數據失敗')
		}
		return result.data
	}

	// ===== 資料轉換工具 =====

	/**
	 * 取得機台類型的顯示名稱
	 */
	static getSensorTypeName(type: SensorType): string {
		const typeNames: Record<SensorType, string> = {
			heading: '打頭機',
			threading: '輾牙機',
			heat_treatment: '熱處理機',
		}
		return typeNames[type] || type
	}

	/**
	 * 取得機台類型的英文名稱
	 */
	static getSensorTypeEnglishName(type: SensorType): string {
		const typeNames: Record<SensorType, string> = {
			heading: 'Heading',
			threading: 'Threading',
			heat_treatment: 'Heat Treatment',
		}
		return typeNames[type] || type
	}

	/**
	 * 判斷感測器是否在線（基於最後更新時間）
	 * @param lastUpdate ISO datetime string
	 * @param thresholdMinutes 閾值分鐘數，超過視為離線
	 */
	static isSensorOnline(lastUpdate: string | null, thresholdMinutes: number = 5): boolean {
		if (!lastUpdate) return false

		const lastUpdateTime = new Date(lastUpdate).getTime()
		const now = Date.now()
		const diffMinutes = (now - lastUpdateTime) / (1000 * 60)

		return diffMinutes <= thresholdMinutes
	}

	/**
	 * 格式化時間戳
	 * @returns YYYY-MM-DD HH:mm:ss 格式
	 */
	static formatTimestamp(timestamp: string): string {
		if (!timestamp) return '-'
		return formatDateTime(timestamp)
	}

	/**
	 * 取得所有感測器類型
	 */
	static getAllSensorTypes(): SensorType[] {
		return ['heading', 'threading', 'heat_treatment']
	}

	/**
	 * 計算感測器統計資訊
	 */
	static calculateSensorStats(data: SensorStatusResponse): {
		total: number
		online: number
		offline: number
		byType: Record<SensorType, { total: number; online: number }>
	} {
		const types: SensorType[] = ['heading', 'threading', 'heat_treatment']
		let total = 0
		let online = 0
		const byType: Record<SensorType, { total: number; online: number }> = {
			heading: { total: 0, online: 0 },
			threading: { total: 0, online: 0 },
			heat_treatment: { total: 0, online: 0 },
		}

		for (const type of types) {
			const sensors = data[type] || []
			byType[type].total = sensors.length
			byType[type].online = sensors.filter((s) => s.is_online).length
			total += byType[type].total
			online += byType[type].online
		}

		return {
			total,
			online,
			offline: total - online,
			byType,
		}
	}

	// ===== 燈號相關 =====

	/**
	 * 打頭機燈號定義
	 */
	static getHeadingLights(data: GenericSensorData | null): SensorLight[] {
		return [
			{ name: 'pwr_light', label: '電源', value: data?.pwr_light as number | null },
			{ name: 'OPR', label: '運轉燈', value: data?.OPR as number | null },
			{ name: 'air_press_light', label: '氣壓燈', value: data?.air_press_light as number | null },
			{ name: 'in_lube', label: '潤滑燈', value: data?.in_lube as number | null },
			{ name: 'sf_door', label: '安全門異常', value: data?.sf_door as number | null, is_alarm: true },
			{ name: 'end_lube_press', label: '油壓異常', value: data?.end_lube_press as number | null, is_alarm: true },
		]
	}

	/**
	 * 輾牙機燈號定義
	 */
	static getThreadingLights(data: GenericSensorData | null): SensorLight[] {
		return [
			{ name: 'pwr_light', label: '電源', value: data?.pwr_light as number | null },
			{ name: 'OPR', label: '運轉燈', value: data?.OPR as number | null },
		]
	}

	/**
	 * 熱處理機燈號定義
	 */
	static getHeatTreatmentLights(data: GenericSensorData | null): SensorLight[] {
		return [
			{ name: 'pwr_light', label: '電源', value: data?.pwr_light as number | null },
			{ name: 'OPR', label: '運轉燈', value: data?.OPR as number | null },
		]
	}

	/**
	 * 根據感測器類型取得燈號列表
	 */
	static getSensorLights(type: SensorType, data: GenericSensorData | null): SensorLight[] {
		switch (type) {
			case 'heading':
				return this.getHeadingLights(data)
			case 'threading':
				return this.getThreadingLights(data)
			case 'heat_treatment':
				return this.getHeatTreatmentLights(data)
			default:
				return []
		}
	}

	/**
	 * 取得機台狀態顯示名稱
	 */
	static getMachineStatusName(status: MachineStatus): string {
		return MACHINE_STATUS_NAMES_ZH[status] || status
	}

	/**
	 * 取得機台狀態顏色
	 */
	static getMachineStatusColor(status: MachineStatus): string {
		return getStatusColor(status)
	}

	/**
	 * 取得工時狀態顏色 (與機台狀態一致)
	 */
	static getWorkTimeStatusColor(status: WorkTimeStatus): string {
		return getWorkTimeColor(status)
	}

	/**
	 * 取得熱處理機特殊數據顯示
	 */
	static getHeatTreatmentDisplayData(data: GenericSensorData | null): Array<{
		label: string
		value: number | null
		setValue: number | null
		unit: string
	}> {
		if (!data) return []
		return [
			{
				label: '淬火爐溫度',
				value: data.quench_furn_temp as number | null,
				setValue: data.quench_furn_temp_set as number | null,
				unit: '°C',
			},
			{
				label: '回火爐溫度',
				value: data.tempering_furn_temp as number | null,
				setValue: data.tempering_furn_temp_set as number | null,
				unit: '°C',
			},
			{
				label: '輸送頻率',
				value: data.conv_freq as number | null,
				setValue: data.conv_freq_set as number | null,
				unit: 'Hz',
			},
		]
	}

	/**
	 * 取得輾牙機特殊數據顯示
	 */
	static getThreadingDisplayData(data: GenericSensorData | null): Array<{
		label: string
		value: number | null
		unit: string
	}> {
		if (!data) return []
		return [
			{
				label: '速率',
				value: data.rate as number | null,
				unit: 'rpm',
			},
		]
	}

	/**
	 * 計算工時進度條位置 (08:00 ~ 隔天08:00, 共24小時)
	 * 使用時間戳差值計算，避免跨日計算問題
	 * 當沒有資料時，用「未知」狀態填滿從 08:00 到現在的時間
	 */
	static calculateWorkTimeProgress(segments: WorkTimeSegment[]): Array<{
		start: number // 百分比
		width: number // 百分比
		status: WorkTimeStatus
		color: string
	}> {
		const TOTAL_MS = 24 * 60 * 60 * 1000 // 24小時的毫秒數

		// 當沒有資料時，用「未知」狀態填滿從 08:00 到現在
		if (segments.length === 0) {
			const now = new Date()
			const workDayStart = new Date()

			// 計算今天的工作日開始時間 (08:00)
			workDayStart.setHours(8, 0, 0, 0)

			// 如果現在還沒到 08:00，則使用昨天的 08:00 作為開始
			if (now < workDayStart) {
				workDayStart.setDate(workDayStart.getDate() - 1)
			}

			const workDayStartTime = workDayStart.getTime()
			const nowTime = now.getTime()

			// 計算從 08:00 到現在的百分比
			const relativeNowMs = nowTime - workDayStartTime
			const widthPercent = (relativeNowMs / TOTAL_MS) * 100

			return [
				{
					start: 0,
					width: Math.max(0, Math.min(100, widthPercent)),
					status: 'unknown' as WorkTimeStatus,
					color: this.getWorkTimeStatusColor('unknown'),
				},
			]
		}

		// 計算工作日開始時間（第一個 segment 的開始時間應該是 08:00）
		const firstSegment = segments[0]
		const workDayStart = new Date(firstSegment.start_time)
		workDayStart.setHours(8, 0, 0, 0)
		const workDayStartTime = workDayStart.getTime()

		return segments.map((segment) => {
			const startTime = new Date(segment.start_time).getTime()
			const endTime = new Date(segment.end_time).getTime()

			// 計算相對於工作日開始的偏移（毫秒）
			const relativeStartMs = startTime - workDayStartTime
			const relativeEndMs = endTime - workDayStartTime

			// 轉換為百分比
			const startPercent = (relativeStartMs / TOTAL_MS) * 100
			const widthPercent = ((relativeEndMs - relativeStartMs) / TOTAL_MS) * 100

			return {
				start: Math.max(0, Math.min(100, startPercent)),
				width: Math.max(0, Math.min(100 - startPercent, widthPercent)),
				status: segment.status,
				color: this.getWorkTimeStatusColor(segment.status),
			}
		})
	}

	/**
	 * 產生 24 小時時間軸標籤 (08:00 ~ 隔天08:00)
	 */
	static generateTimeLabels(): string[] {
		const labels: string[] = []
		for (let i = 0; i < 24; i++) {
			const hour = (8 + i) % 24
			labels.push(`${hour.toString().padStart(2, '0')}:00`)
		}
		return labels
	}
}

// 匯出類型供其他模組使用
export type {
	SensorType,
	SensorStatus,
	SensorStatusResponse,
	SensorRealtimeResponse,
	SensorHistoryResponse,
	SensorData,
	GenericSensorData,
	SensorLight,
	MachineStatus,
	WorkTimeStatus,
	WorkTimeSegment,
}
