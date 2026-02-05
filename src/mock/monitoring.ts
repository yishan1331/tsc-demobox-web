/**
 * DemoBox 感測器監控 Mock 數據
 *
 * 根據截圖，每種機台類型有 11 台機器：
 * - Demo（示範機）
 * - 01 ~ 10（編號機）
 *
 * 機台類型：
 * - heading (打頭)
 * - threading (輾牙)
 * - heat_treatment (熱處理)
 */

import { MockMethod } from 'vite-plugin-mock'

type SensorType = 'heading' | 'threading' | 'heat_treatment'
type MachineStatus = 'running' | 'idle' | 'error' | 'offline' | 'unknown'
type WorkTimeStatus = 'running' | 'idle' | 'error' | 'offline' | 'unknown'

interface SensorStatus {
	sensor_id: string
	sensor_name: string
	sensor_type: SensorType
	is_online: boolean
	machine_status: MachineStatus
	last_update: string
}

interface WorkTimeSegment {
	start_time: string
	end_time: string
	status: WorkTimeStatus
}

interface SensorData {
	timestamp: string
	[key: string]: number | string | null | undefined
}

/**
 * 產生感測器狀態資料
 */
/**
 * 根據 is_online 產生 machine_status
 */
const generateMachineStatus = (isOnline: boolean): MachineStatus => {
	if (!isOnline) return 'offline'

	// 在線時隨機產生狀態
	const statuses: MachineStatus[] = ['running', 'idle', 'error', 'unknown']
	const weights = [0.7, 0.2, 0.05, 0.05] // 運轉70%, 待機20%, 異常5%, 未知5%

	let random = Math.random()
	for (let i = 0; i < weights.length; i++) {
		random -= weights[i]
		if (random <= 0) {
			return statuses[i]
		}
	}
	return 'running'
}

const generateSensorStatus = (type: SensorType): SensorStatus[] => {
	const typeNames: Record<SensorType, string> = {
		heading: '打頭機',
		threading: '輾牙機',
		heat_treatment: '熱處理機',
	}

	const sensors: SensorStatus[] = []

	// Demo 機
	const demoIsOnline = Math.random() > 0.3 // 70% 機率在線
	sensors.push({
		sensor_id: `${type}_demo`,
		sensor_name: `${typeNames[type]} Demo`,
		sensor_type: type,
		is_online: demoIsOnline,
		machine_status: generateMachineStatus(demoIsOnline),
		last_update: new Date(Date.now() - Math.random() * 10 * 60 * 1000).toISOString(),
	})

	// 01 ~ 10 號機
	for (let i = 1; i <= 10; i++) {
		const paddedNum = String(i).padStart(2, '0')
		const isOnline = Math.random() > 0.4 // 60% 機率在線
		sensors.push({
			sensor_id: `${type}_${paddedNum}`,
			sensor_name: `${typeNames[type]} ${paddedNum}`,
			sensor_type: type,
			is_online: isOnline,
			machine_status: generateMachineStatus(isOnline),
			last_update: new Date(Date.now() - Math.random() * 10 * 60 * 1000).toISOString(),
		})
	}

	return sensors
}

/**
 * 產生打頭機即時數據
 */
const generateHeadingData = (): SensorData => {
	const isRunning = Math.random() > 0.3
	return {
		timestamp: new Date().toISOString(),
		pwr_light: 1, // 電源燈亮
		OPR: isRunning ? 1 : 0, // 運轉中
		air_press_light: isRunning ? 1 : 0, // 氣壓燈
		in_lube: isRunning ? 1 : 0, // 進料潤滑
		sf_door: Math.random() > 0.9 ? 1 : 0, // 安全門異常 (10% 機率)
		end_lube_press: Math.random() > 0.95 ? 1 : 0, // 末端潤滑壓力異常 (5% 機率)
		cnt: String(Math.floor(Math.random() * 900000 + 100000)), // 計數 6位數
	}
}

/**
 * 產生輾牙機即時數據
 */
const generateThreadingData = (): SensorData => {
	const isRunning = Math.random() > 0.3
	return {
		timestamp: new Date().toISOString(),
		pwr_light: 1,
		OPR: isRunning ? 1 : 0,
		rate: isRunning ? Math.round(Math.random() * 100 + 50) : 0, // 速率 50-150
		cnt: Math.floor(Math.random() * 500000 + 100000), // 計數
	}
}

/**
 * 產生熱處理機即時數據
 */
const generateHeatTreatmentData = (): SensorData => {
	const isRunning = Math.random() > 0.3
	const quenchTempSet = 850
	const temperingTempSet = 450
	const convFreqSet = 50
	return {
		timestamp: new Date().toISOString(),
		pwr_light: 1,
		OPR: isRunning ? 1 : 0,
		quench_furn_temp: isRunning ? quenchTempSet + Math.round((Math.random() - 0.5) * 20) : 25,
		quench_furn_temp_set: quenchTempSet,
		tempering_furn_temp: isRunning ? temperingTempSet + Math.round((Math.random() - 0.5) * 15) : 25,
		tempering_furn_temp_set: temperingTempSet,
		conv_freq: isRunning ? convFreqSet + Math.round((Math.random() - 0.5) * 5) : 0,
		conv_freq_set: convFreqSet,
	}
}

/**
 * 產生即時感測器數據
 */
const generateRealtimeData = (type: SensorType): SensorData | null => {
	switch (type) {
		case 'heading':
			return generateHeadingData()
		case 'threading':
			return generateThreadingData()
		case 'heat_treatment':
			return generateHeatTreatmentData()
		default:
			return null
	}
}

/**
 * 產生工時狀態資料 (08:00 ~ 隔天08:00)
 * 工作日從今天 08:00 開始，到明天 08:00 結束
 * 如果現在是凌晨（00:00~08:00），則工作日從昨天 08:00 開始
 */
const generateWorkTimeSegments = (): WorkTimeSegment[] => {
	const segments: WorkTimeSegment[] = []
	const now = new Date()
	const currentHour = now.getHours()

	// 計算工作日的開始時間
	const workDayStart = new Date()
	if (currentHour < 8) {
		// 凌晨時段：工作日從昨天 08:00 開始
		workDayStart.setDate(workDayStart.getDate() - 1)
	}
	workDayStart.setHours(8, 0, 0, 0)

	let currentTime = workDayStart.getTime()
	const endTime = currentTime + 24 * 60 * 60 * 1000 // 24小時後
	const nowTime = Date.now()

	while (currentTime < Math.min(endTime, nowTime)) {
		// 隨機產生狀態持續時間 (30分鐘 ~ 2小時)
		const duration = (Math.floor(Math.random() * 4) + 1) * 30 * 60 * 1000

		// 隨機選擇狀態 (與機台狀態一致)
		const statuses: WorkTimeStatus[] = ['running', 'idle', 'error', 'offline', 'unknown']
		const weights = [0.6, 0.18, 0.05, 0.12, 0.05] // 權重：運轉60%, 待機18%, 異常5%, 關機12%, 未知5%
		let random = Math.random()
		let status: WorkTimeStatus = 'running'
		for (let i = 0; i < weights.length; i++) {
			random -= weights[i]
			if (random <= 0) {
				status = statuses[i]
				break
			}
		}

		const segmentEnd = Math.min(currentTime + duration, endTime, nowTime)

		segments.push({
			start_time: new Date(currentTime).toISOString(),
			end_time: new Date(segmentEnd).toISOString(),
			status,
		})

		currentTime = segmentEnd
	}

	return segments
}

/**
 * 根據工時狀態判斷機台狀態 (狀態已統一，直接對應)
 */
const getMachineStatus = (segments: WorkTimeSegment[]): MachineStatus => {
	if (segments.length === 0) return 'offline'
	const lastSegment = segments[segments.length - 1]
	// WorkTimeStatus 與 MachineStatus 已統一，直接返回
	return lastSegment.status as MachineStatus
}

/**
 * 產生歷史感測器數據
 */
const generateHistoryData = (type: SensorType, count: number = 100): SensorData[] => {
	const data: SensorData[] = []
	const now = Date.now()

	for (let i = 0; i < count; i++) {
		const timestamp = new Date(now - i * 60 * 1000).toISOString() // 每分鐘一筆
		const realtimeData = generateRealtimeData(type)
		if (realtimeData) {
			data.push({
				...realtimeData,
				timestamp,
			})
		}
	}

	return data.reverse() // 由舊到新排序
}

export default [
	// GET /TSC/1.0/sensors/status - 取得所有感測器狀態
	{
		url: '/mock/api/TSC/1.0/sensors/status',
		method: 'get',
		response: () => {
			return {
				Response: 'success',
				Data: {
					heading: generateSensorStatus('heading'),
					threading: generateSensorStatus('threading'),
					heat_treatment: generateSensorStatus('heat_treatment'),
				},
			}
		},
	},

	// GET /TSC/1.0/sensors/:type - 取得特定類型的感測器列表
	{
		url: /\/mock\/api\/TSC\/1\.0\/sensors\/(heading|threading|heat_treatment)$/,
		method: 'get',
		response: ({ url }: { url: string }) => {
			const match = url.match(/\/mock\/api\/TSC\/1\.0\/sensors\/(heading|threading|heat_treatment)$/)
			if (!match) {
				return {
					Response: 'error',
					message: 'Invalid sensor type',
					Data: [],
				}
			}

			const sensorType = match[1] as SensorType
			return {
				Response: 'success',
				Data: generateSensorStatus(sensorType),
			}
		},
	},

	// GET /TSC/1.0/sensors/:type/:id/realtime - 取得單一感測器即時數據
	{
		url: /\/mock\/api\/TSC\/1\.0\/sensors\/(heading|threading|heat_treatment)\/[\w_]+\/realtime$/,
		method: 'get',
		response: ({ url }: { url: string }) => {
			const match = url.match(
				/\/mock\/api\/TSC\/1\.0\/sensors\/(heading|threading|heat_treatment)\/([\w_]+)\/realtime$/
			)
			if (!match) {
				return {
					Response: 'error',
					message: 'Invalid request',
					Data: null,
				}
			}

			const sensorType = match[1] as SensorType
			const sensorId = match[2]
			const typeNames: Record<SensorType, string> = {
				heading: '打頭機',
				threading: '輾牙機',
				heat_treatment: '熱處理機',
			}

			// 產生感測器名稱
			let sensorName: string
			if (sensorId.endsWith('_demo')) {
				sensorName = `${typeNames[sensorType]} Demo`
			} else {
				const num = sensorId.split('_').pop() || ''
				sensorName = `${typeNames[sensorType]} ${num}`
			}

			const isOnline = Math.random() > 0.2 // 80% 機率在線
			const currentData = isOnline ? generateRealtimeData(sensorType) : null
			const workTimeSegments = generateWorkTimeSegments()
			const machineStatus = isOnline ? getMachineStatus(workTimeSegments) : 'offline'

			// 計算支數
			let count = 0
			if (currentData) {
				if (sensorType === 'heading') {
					count = parseInt(String(currentData.cnt || '0'), 10)
				} else if (sensorType === 'threading') {
					count = Number(currentData.cnt) || 0
				}
			}

			// 產生最近數據（最近 10 筆）
			const recentData: SensorData[] = []
			if (isOnline) {
				for (let i = 0; i < 10; i++) {
					const data = generateRealtimeData(sensorType)
					if (data) {
						data.timestamp = new Date(Date.now() - i * 60 * 1000).toISOString()
						recentData.push(data)
					}
				}
			}

			return {
				Response: 'success',
				Data: {
					sensor_id: sensorId,
					sensor_name: sensorName,
					sensor_type: sensorType,
					is_online: isOnline,
					machine_status: machineStatus,
					current_data: currentData,
					recent_data: recentData,
					work_time_segments: workTimeSegments,
					count: count,
				},
			}
		},
	},

	// GET /TSC/1.0/sensors/:type/:id/history - 取得感測器歷史數據
	{
		url: /\/mock\/api\/TSC\/1\.0\/sensors\/(heading|threading|heat_treatment)\/[\w_]+\/history/,
		method: 'get',
		response: (options: { url: string; query?: Record<string, string> }) => {
			const url = options.url
			const match = url.match(
				/\/mock\/api\/TSC\/1\.0\/sensors\/(heading|threading|heat_treatment)\/([\w_]+)\/history/
			)
			if (!match) {
				return {
					Response: 'error',
					message: 'Invalid request',
					Data: null,
				}
			}

			const sensorType = match[1] as SensorType
			const sensorId = match[2]
			const typeNames: Record<SensorType, string> = {
				heading: '打頭機',
				threading: '輾牙機',
				heat_treatment: '熱處理機',
			}

			// 產生感測器名稱
			let sensorName: string
			if (sensorId.endsWith('_demo')) {
				sensorName = `${typeNames[sensorType]} Demo`
			} else {
				const num = sensorId.split('_').pop() || ''
				sensorName = `${typeNames[sensorType]} ${num}`
			}

			// 處理分頁參數 - 兼容 vite-plugin-mock 和 Mock.js
			const urlParams = new URLSearchParams(url.split('?')[1] || '')
			const query = options.query || {}
			const page = parseInt(query.page || urlParams.get('page') || '1')
			const limit = parseInt(query.limit || urlParams.get('limit') || '20')
			const totalRecords = 500 // 假設有 500 筆歷史數據

			// 產生歷史數據
			const allData = generateHistoryData(sensorType, totalRecords)
			const startIndex = (page - 1) * limit
			const endIndex = startIndex + limit
			const paginatedData = allData.slice(startIndex, endIndex)

			return {
				Response: 'success',
				Data: {
					sensor_id: sensorId,
					sensor_name: sensorName,
					sensor_type: sensorType,
					data: paginatedData,
					pagination: {
						current_page: page,
						total_pages: Math.ceil(totalRecords / limit),
						total_records: totalRecords,
						page_size: limit,
					},
				},
			}
		},
	},
] as MockMethod[]
