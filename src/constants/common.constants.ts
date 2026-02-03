export const API_STATUS_CODES = {
	SUCCESS: 200,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
} as const

export const REFRESH_TIME = 10000

export const DEBOUNCE_DELAY = 300

export const VERSION = '1.0'

export const DATA_TABLE_HEIGHT = 550

export const TOAST_LIFE_TIME = 5000

export const UnifiedWorkOrderStatus = {
	DRAFT: 'Draft',
	RELEASED: 'Released',
	SCHEDULED: 'SCHEDULED',
	IN_PROGRESS: 'In_Progress',
	PAUSED: 'Paused',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled',
} as const

/**
 * 暫停類型常量
 * - NORMAL: 一般暫停（不計入工時）
 * - MACHINE_DOWN: 停機（計入工時）
 * - MAINTENANCE: 維護（不計入工時）
 */
export const PauseType = {
	NORMAL: 'NORMAL',
	MACHINE_DOWN: 'MACHINE_DOWN',
	MAINTENANCE: 'MAINTENANCE',
} as const

export type PauseTypeValue = (typeof PauseType)[keyof typeof PauseType]
