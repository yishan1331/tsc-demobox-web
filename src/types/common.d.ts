export type Pagination = {
	page: number
	limit: number
	total: number
	total_pages: number
}

export type Sorting = {
	sortBy: string
	sortingOrder: 'asc' | 'desc' | null
}

export type BaseFilters = {
	category: string[]
	fuzzy: boolean
	search: string
}

export type QualityFilters = BaseFilters & {
	orderNo?: string
	workOrderNo?: string[]
	startDate?: Date
	endDate?: Date
}

export type MaterialIssuanceFilters = BaseFilters & {
	workOrderNo?: string
	processSteps?: string[]
	products?: string[]
}

// Default Filters type for backward compatibility
export type Filters = BaseFilters

/**
 * Standard API response interface
 */
export interface ApiResponse<T = unknown> {
	APIS: string
	BytesTransferred: number
	NowTime: string
	OperationTime: string
	Response: string
	System: string
	Data?: T
	ErrorDescription?: string
	error?: string
}

/**
 * Standard API response interface
 */
export interface ApiResult<T = unknown> {
	data: T
	message?: string
	status: 'success' | 'error'
	/** 標記錯誤是否已由 EventService 處理（如網路錯誤、會話過期） */
	handled?: boolean
}

/**
 * Paginated API response interface
 */
export interface PaginatedApiResult<T = unknown> extends ApiResult<T[]> {
	pagination: {
		page: number
		limit: number
		total: number
	}
}

/**
 * Legacy API response interface for axiosAPI
 */
export interface APIsResponse {
	statusCode: number
	content: {
		APIS: string
		BytesTransferred: number
		NowTime: string
		OperationTime: string
		System: string
		Response: string
		ErrorDescription?: string
		responseData?: any[]
		responseData2?: any[]
	}
	pagination?: {
		page: number
		limit: number
		total: number
	}
}

/**
 * Legacy API parameters interface for axiosAPI
 */
export interface APIsParams {
	methods?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
	whichFunction?: string
	userID?: number
	modifierUserID?: number
	creatorUserID?: number
	table?: string
	[key: string]: any
}

import { UnifiedWorkOrderStatus } from '@/constants'

export type UnifiedWorkOrderStatusType =
	(typeof UnifiedWorkOrderStatus)[keyof typeof UnifiedWorkOrderStatus]
