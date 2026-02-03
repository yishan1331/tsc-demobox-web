import { ApiResult } from '@/types'
import { api } from '@/utils/http-client'
import { formatResult } from './common.api'
import { API_SYSTEM } from '@/constants/api.constants'

// ===== 感測器類型定義 =====
export type SensorType = 'heading' | 'threading' | 'heat_treatment'

// ===== 機台狀態類型 =====
export type MachineStatus = 'running' | 'idle' | 'error' | 'offline' | 'unknown'

// ===== 工時狀態類型 (與機台狀態一致) =====
export type WorkTimeStatus = 'running' | 'idle' | 'error' | 'offline' | 'unknown'

export interface SensorStatus {
	sensor_id: string
	sensor_name: string
	sensor_type: SensorType
	is_online: boolean
	machine_status: MachineStatus
	last_update: string
}

export interface SensorStatusResponse {
	heading: SensorStatus[]
	threading: SensorStatus[]
	heat_treatment: SensorStatus[]
}

export interface WorkTimeSegment {
	start_time: string
	end_time: string
	status: WorkTimeStatus
}

// ===== 感測器燈號狀態 =====
export interface SensorLight {
	name: string
	label: string
	value: number | null // 0 = off, 1 = on, null = unknown
	is_alarm?: boolean // 是否為警報狀態
}

// ===== 打頭機感測器數據 =====
export interface HeadingSensorData {
	timestamp: string
	pwr_light: number | null // 電源燈
	OPR: number | null // 運轉中
	air_press_light: number | null // 氣壓燈
	in_lube: number | null // 進料潤滑
	sf_door: number | null // 安全門
	end_lube_press: number | null // 末端潤滑壓力
	cnt: string | null // 計數
}

// ===== 輾牙機感測器數據 =====
export interface ThreadingSensorData {
	timestamp: string
	pwr_light: number | null // 電源燈
	OPR: number | null // 運轉中
	rate: number | null // 速率
	cnt: number | null // 計數
}

// ===== 熱處理機感測器數據 =====
export interface HeatTreatmentSensorData {
	timestamp: string
	pwr_light: number | null // 電源燈
	OPR: number | null // 運轉中
	quench_furn_temp: number | null // 淬火爐溫度
	quench_furn_temp_set: number | null // 淬火爐溫度設定
	tempering_furn_temp: number | null // 回火爐溫度
	tempering_furn_temp_set: number | null // 回火爐溫度設定
	conv_freq: number | null // 輸送頻率
	conv_freq_set: number | null // 輸送頻率設定
}

// ===== 通用感測器數據 (聯合類型) =====
export type SensorData = HeadingSensorData | ThreadingSensorData | HeatTreatmentSensorData

// ===== 通用感測器數據 (動態欄位) =====
export interface GenericSensorData {
	timestamp: string
	[key: string]: number | string | null
}

export interface SensorRealtimeResponse {
	sensor_id: string
	sensor_name: string
	sensor_type: SensorType
	is_online: boolean
	machine_status: MachineStatus
	current_data: GenericSensorData | null
	recent_data: GenericSensorData[]
	work_time_segments: WorkTimeSegment[] // 24小時工時狀態
	count: number // 支數
}

export interface SensorHistoryResponse {
	sensor_id: string
	sensor_name: string
	sensor_type: SensorType
	data: SensorData[]
	pagination: {
		current_page: number
		total_pages: number
		total_records: number
		page_size: number
	}
}

// ===== 感測器 API =====

/**
 * 取得所有感測器狀態總覽
 */
export const getSensorStatus = async (): Promise<ApiResult<SensorStatusResponse>> => {
	const apiResult = await api.get(`${API_SYSTEM}/1.0/sensors/status`)
	return formatResult(apiResult) as ApiResult<SensorStatusResponse>
}

/**
 * 取得單一感測器即時數據
 */
export const getSensorRealtime = async (
	sensorType: SensorType,
	sensorId: string
): Promise<ApiResult<SensorRealtimeResponse>> => {
	const apiResult = await api.get(`${API_SYSTEM}/1.0/sensors/${sensorType}/${sensorId}/realtime`)
	return formatResult(apiResult) as ApiResult<SensorRealtimeResponse>
}

/**
 * 取得感測器歷史數據
 */
export const getSensorHistory = async (
	sensorType: SensorType,
	sensorId: string,
	params: {
		start_date?: string
		end_date?: string
		page?: number
		limit?: number
	}
): Promise<ApiResult<SensorHistoryResponse>> => {
	const apiResult = await api.get(`${API_SYSTEM}/1.0/sensors/${sensorType}/${sensorId}/history`, { params })
	return formatResult(apiResult) as ApiResult<SensorHistoryResponse>
}

/**
 * 取得特定類型的感測器列表
 */
export const getSensorList = async (sensorType: SensorType): Promise<ApiResult<SensorStatus[]>> => {
	const apiResult = await api.get(`${API_SYSTEM}/1.0/sensors/${sensorType}`)
	return formatResult(apiResult) as ApiResult<SensorStatus[]>
}
