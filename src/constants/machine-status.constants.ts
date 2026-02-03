/**
 * 機台狀態顏色常數
 * 統一管理所有狀態顏色，修改這裡會同步更新所有地方
 */

import type { MachineStatus, WorkTimeStatus } from '@/services/APIs/sensor.api'

// ===== 狀態顏色定義 =====
export const MACHINE_STATUS_COLORS: Record<MachineStatus, string> = {
	running: '#4CAF50', // 綠色 - 運轉
	idle: '#FFC107', // 黃色 - 待機
	error: '#F44336', // 紅色 - 異常
	offline: '#616161', // 深灰 - 關機
	unknown: '#9C27B0', // 紫色 - 未知
} as const

// 工時狀態顏色（與機台狀態一致）
export const WORK_TIME_STATUS_COLORS: Record<WorkTimeStatus, string> = MACHINE_STATUS_COLORS

// ===== 狀態名稱定義（中文） =====
export const MACHINE_STATUS_NAMES_ZH: Record<MachineStatus, string> = {
	running: '運轉',
	idle: '待機',
	error: '異常',
	offline: '關機',
	unknown: '未知',
} as const

// ===== 狀態名稱定義（英文） =====
export const MACHINE_STATUS_NAMES_EN: Record<MachineStatus, string> = {
	running: 'Running',
	idle: 'Idle',
	error: 'Error',
	offline: 'Offline',
	unknown: 'Unknown',
} as const

// ===== 狀態列表（用於 UI 渲染） =====
export const MACHINE_STATUS_LIST: Array<{
	key: MachineStatus
	color: string
}> = [
	{ key: 'running', color: MACHINE_STATUS_COLORS.running },
	{ key: 'idle', color: MACHINE_STATUS_COLORS.idle },
	{ key: 'error', color: MACHINE_STATUS_COLORS.error },
	{ key: 'offline', color: MACHINE_STATUS_COLORS.offline },
	{ key: 'unknown', color: MACHINE_STATUS_COLORS.unknown },
]

// ===== 輔助函數 =====

/**
 * 取得機台狀態顏色
 */
export const getMachineStatusColor = (status: MachineStatus): string => {
	return MACHINE_STATUS_COLORS[status] || MACHINE_STATUS_COLORS.unknown
}

/**
 * 取得工時狀態顏色
 */
export const getWorkTimeStatusColor = (status: WorkTimeStatus): string => {
	return WORK_TIME_STATUS_COLORS[status] || WORK_TIME_STATUS_COLORS.unknown
}
