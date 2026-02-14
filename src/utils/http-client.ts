import { useUserAuthStore } from '@/stores/userAuth.store'
import { ApiResult, ApiResponse, APIsParams } from '@/types/common'
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios'
import { storeToRefs } from 'pinia'
import { errorAuthHandling } from '@/utils/common.utils'
import { API_SYSTEM } from '@/constants/api.constants'

/**
 * Request options with content type support
 */
interface RequestOptions extends AxiosRequestConfig {
	contentType?: 'json' | 'form-urlencoded' | 'multipart'
}

// Environment configuration
const shouldUseMock =
	import.meta.env.VITE_USE_MOCK === 'FF'
		? false
		: import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV
const apiSource = import.meta.env.VITE_API_SOURCE || 'php'

/**
 * Get the appropriate base URL based on environment configuration
 */
const getBaseUrl = (): string => {
	console.log(shouldUseMock)
	console.log(apiSource)
	if (shouldUseMock) {
		// When using mock, return empty string since vite-plugin-mock handles the requests
		return '/mock/api'
	}

	// Get current protocol (http or https)
	const currentProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:'
	const currentOrigin =
		typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
	const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

	if (apiSource === 'php') {
		// Use current origin + /php/modules.php (already includes correct protocol)
		return `${currentOrigin}/php/modules.php`
	} else if (apiSource === 'api') {
		// Use configured API base URL with automatic protocol detection
		const configuredUrl =
			`${import.meta.env.VITE_API_IP === '' ? currentDomain : import.meta.env.VITE_API_IP}${import.meta.env.VITE_API_BASE_URL}` || 'localhost:3000'

		// Add current protocol to configured URL
		const apiUrl = `${import.meta.env.VITE_API_IP === '' ? currentProtocol : 'https:'}//${configuredUrl}`
		console.log(apiUrl)
		return apiUrl
	}

	// Fallback to current origin for PHP mode
	return `${currentOrigin}/php/modules.php`
}

// Flag to prevent multiple refresh token requests
let isRefreshing = false
// Queue of requests waiting for token refresh
let failedQueue: Array<{
	resolve: (value?: any) => void
	reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token)
		}
	})
	failedQueue = []
}

/**
 * Get user authentication data
 */
const getAuthToken = (): string | null => {
	try {
		const AuthStore = useUserAuthStore()
		const { userData } = storeToRefs(AuthStore)
		return userData.value.accessToken || null
	} catch {
		return null
	}
}

/**
 * Get refresh token
 */
const getRefreshToken = (): string | null => {
	try {
		const AuthStore = useUserAuthStore()
		const { userData } = storeToRefs(AuthStore)
		return userData.value.refreshToken || null
	} catch {
		return null
	}
}

/**
 * Helper function to format API responses consistently
 * Converts axios response to ApiResult format
 */
const formatApiResponse = <T = any>(response: AxiosResponse<T>, error?: AxiosError): ApiResult => {
	// Handle error response
	if (error) {
		console.log(error)
		let message = error.message || error.code || 'API Error'
		const errorData = error.response?.data as ApiResponse
		console.log(errorData)
		if (errorData) {
			message =
				errorData.ErrorDescription ?? errorData.Response ?? errorData.error ?? 'API Error'
			if (message == 'insufficient_permissions') {
				message = '缺少必要權限，無法執行此操作'
			}
		}
		// 網路錯誤已由 EventService 處理，標記為 handled
		const isNetworkError = error.code === 'ERR_NETWORK'
		return {
			status: 'error',
			message: message,
			data: null,
			handled: isNetworkError,
		}
	}
	console.log(response)
	// Handle success response
	const responseData = response.data as ApiResponse

	// Return standard ApiResult format
	return {
		status: 'success',
		message: responseData?.Response || 'Success',
		data: responseData,
	}
}

/**
 * Type-safe API request wrapper
 * Provides consistent error handling and response formatting
 */
const apiRequest = async <T = any>(
	request: () => Promise<AxiosResponse<T>>
): Promise<ApiResult> => {
	try {
		const response = await request()
		console.log(response)
		return formatApiResponse(response)
	} catch (error) {
		console.log(error)
		return formatApiResponse(null as any, error as AxiosError)
	}
}

/**
 * Convert data to URL encoded format
 */
const toUrlEncoded = (data: any): URLSearchParams => {
	const formData = new URLSearchParams()
	if (data) {
		Object.entries(data).forEach(([key, value]) => {
			formData.append(key, String(value))
		})
	}
	return formData
}

/**
 * Create standard axios instance with interceptors
 */
const createApiClient = (): AxiosInstance => {
	const BASE_URL = getBaseUrl()
	const client = axios.create({
		baseURL: BASE_URL,
		timeout: 30000,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	// Request interceptor - add auth token
	client.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			const token = getAuthToken()
			if (token) {
				config.headers.Authorization = `Bearer ${token}`
			}

			// Log request in development
			if (import.meta.env.DEV) {
				console.log('🚀 API Request:', {
					method: config.method?.toUpperCase(),
					url: config.url,
					params: config.params,
					data: config.data,
				})
			}

			return config
		},
		(error: AxiosError) => {
			console.error('❌ Request interceptor error:', error)
			return Promise.reject(error)
		}
	)

	// Response interceptor - handle common errors
	client.interceptors.response.use(
		(response: AxiosResponse) => {
			// Log response in development
			if (import.meta.env.DEV) {
				console.log('✅ API Response:', {
					status: response.status,
					url: response.config.url,
					data: response.data,
				})
			}
			return response
		},
		async (error: AxiosError) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & {
				_retry?: boolean
			}
			console.log(originalRequest)

			console.error('❌ API Error:', {
				status: error.response?.status,
				url: error.config?.url,
				message: error.message,
				data: error.response?.data,
			})

			// Handle network errors - dispatch event and reject with error
			if (error.code === 'ERR_NETWORK') {
				window.dispatchEvent(new Event('network-error'))
				// Reject the promise so that finally blocks can execute
				return Promise.reject(error)
			}

			// Handle 401 unauthorized
			if (
				error.response?.status === 401 &&
				!originalRequest._retry &&
				!originalRequest.url?.includes('auth/login') &&
				!originalRequest.url?.includes('auth/token') &&
				!originalRequest.url?.includes('auth/logout') &&
				!originalRequest.url?.includes('auth/refresh')
			) {
				if (isRefreshing) {
					// If already refreshing, queue this request
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject })
					})
						.then((token) => {
							originalRequest.headers.Authorization = `Bearer ${token}`
							return client(originalRequest)
						})
						.catch((err) => {
							return Promise.reject(err)
						})
				}

				originalRequest._retry = true
				isRefreshing = true

				const refreshTokenValue = getRefreshToken()

				if (!refreshTokenValue) {
					// No refresh token available, logout immediately
					isRefreshing = false
					window.dispatchEvent(new Event('session-expired'))
					return Promise.reject(error)
				}

				try {
					// Make refresh token request directly to avoid circular dependency
					const response = await axios.post(
						`${BASE_URL}/${API_SYSTEM}/1.0/auth/refresh`,
						{},
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${refreshTokenValue}`,
							},
						}
					)

					if (response.status === 200 && response.data && response.data.Data) {
						const newTokenData = response.data.Data
						const AuthStore = useUserAuthStore()

						// Update tokens in store
						AuthStore.setUserAuthToken(
							newTokenData.access_token,
							newTokenData.refresh_token || refreshTokenValue
						)

						// Process queued requests with new token
						processQueue(null, newTokenData.access_token)

						// Retry original request with new token
						originalRequest.headers.Authorization = `Bearer ${newTokenData.access_token}`
						return client(originalRequest)
					} else {
						throw new Error('Failed to refresh token')
					}
				} catch (refreshError) {
					// Refresh failed, logout user
					processQueue(refreshError, null)
					window.dispatchEvent(new Event('session-expired'))
					// Return a promise that never resolves to completely stop the chain
					return new Promise(() => {})
				} finally {
					isRefreshing = false
				}
			}

			return Promise.reject(error)
		}
	)

	return client
}

/**
 * Default API client instance
 */
const apiClient = createApiClient()

/**
 * Utility functions for common HTTP methods with ApiResult format
 */
export const api = {
	get: async <T = any>(url: string, config?: RequestOptions): Promise<ApiResult> => {
		return apiRequest(() => apiClient.get<T>(url, config))
	},

	post: async <T = any>(
		url: string,
		data?: any,
		options?: RequestOptions
	): Promise<ApiResult> => {
		const config: AxiosRequestConfig = { ...options }
		console.log(url, data, config)
		// Handle different content types
		if (options?.contentType === 'form-urlencoded') {
			config.headers = {
				...config.headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			}
			data = toUrlEncoded(data)
		} else if (options?.contentType === 'multipart') {
			// For multipart/form-data, let axios set the boundary automatically
			const formData = new FormData()
			if (data) {
				Object.entries(data).forEach(([key, value]) => {
					formData.append(key, value as any)
				})
			}
			data = formData
		}
		// Default is 'json' which is already set in createApiClient
		return apiRequest(() => apiClient.post<T>(url, data, config))
	},

	put: async <T = any>(url: string, data?: any, options?: RequestOptions): Promise<ApiResult> => {
		const config: AxiosRequestConfig = { ...options }

		// Handle different content types (same as post)
		if (options?.contentType === 'form-urlencoded') {
			config.headers = {
				...config.headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			}
			data = toUrlEncoded(data)
		} else if (options?.contentType === 'multipart') {
			const formData = new FormData()
			if (data) {
				Object.entries(data).forEach(([key, value]) => {
					formData.append(key, value as any)
				})
			}
			data = formData
		}

		return apiRequest(() => apiClient.put<T>(url, data, config))
	},

	patch: async <T = any>(
		url: string,
		data?: any,
		options?: RequestOptions
	): Promise<ApiResult> => {
		const config: AxiosRequestConfig = { ...options }

		// Handle different content types (same as post)
		if (options?.contentType === 'form-urlencoded') {
			config.headers = {
				...config.headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			}
			data = toUrlEncoded(data)
		} else if (options?.contentType === 'multipart') {
			const formData = new FormData()
			if (data) {
				Object.entries(data).forEach(([key, value]) => {
					formData.append(key, value as any)
				})
			}
			data = formData
		}

		return apiRequest(() => apiClient.patch<T>(url, data, config))
	},

	delete: async <T = any>(url: string, config?: RequestOptions): Promise<ApiResult> => {
		return apiRequest(() => apiClient.delete<T>(url, config))
	},
}

/**
 * Create business API client for legacy API format
 * Handles the whichFunction parameter and format
 */
const createBusinessApiClient = (): AxiosInstance => {
	const client = axios.create({
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	// Request interceptor
	client.interceptors.request.use(
		(config) => {
			const token = getAuthToken()
			if (token) {
				config.headers.Authorization = `Bearer ${token}`
			}

			console.log('Business API Request:', config)
			return config
		},
		(error) => {
			console.error('Business API Request Error:', error)
			return Promise.reject(error)
		}
	)

	// Response interceptor
	client.interceptors.response.use(
		(response: AxiosResponse) => {
			console.log('Business API Response:', response)
			return response.data
		},
		(error: AxiosError) => {
			console.error('Business API Error:', error)

			// Handle network errors - dispatch event and reject with error
			if (error.code === 'ERR_NETWORK') {
				window.dispatchEvent(new Event('network-error'))
				return Promise.reject(error)
			}

			return Promise.reject(error)
		}
	)

	return client
}

/**
 * Business API call function (compatible with legacy AxiosService)
 * Handles the special whichFunction format and returns legacy format for backward compatibility
 */
export const businessApiCall = async <T = unknown>(params: Partial<APIsParams>): Promise<any> => {
	const client = createBusinessApiClient()
	const baseUrl = getBaseUrl()

	// Default response structure (legacy format)
	const result: any = {
		statusCode: 200,
		content: {
			response: 'ok',
			responseData: [],
			responseData2: [],
		},
		pagination: {
			page: 0,
			limit: 0,
			total: 0,
		},
	}

	try {
		// Prepare API URL
		const apiUrl = shouldUseMock ? `${baseUrl}/${params.whichFunction}` : baseUrl
		console.log(apiUrl)

		// Prepare request data
		const requestData = {
			...params,
			method: params.methods?.toLowerCase() || 'get',
			whichFunction: params.whichFunction || '',
		}
		delete requestData.methods

		console.log('Business API Call:', { url: apiUrl, data: requestData })

		// Make API call
		const response: AxiosResponse<T> = await client.post<T>(apiUrl, requestData)
		console.log(response)
		// Handle response
		result.statusCode = response.status

		if (response.status !== 200) {
			const responseData = response.data as any
			result.content.response =
				responseData.ErrorDescription ??
				responseData.Response ??
				responseData.error ??
				'API Error'

			// Handle 401 unauthorized
			if (
				response.status === 401 &&
				result.content.response === 'Unauthorized access' &&
				params.whichFunction !== 'Logout'
			) {
				errorAuthHandling()
				return result
			}

			return result
		}

		// Handle successful response
		const responseData = response.data as any
		result.content.response = responseData.Response || 'ok'

		// Handle different response data formats
		if ('returnDataKey' in params) {
			const returnDataKey = params['returnDataKey'] as string
			result.content.responseData = responseData[returnDataKey] || []
		} else {
			// For mock data, QueryTableData might be nested in data property
			result.content.responseData =
				responseData.QueryTableData || responseData.data?.QueryTableData || []
		}

		// Handle additional response data
		if ('QueryRedisData' in responseData) {
			result.content.responseData2 = responseData.QueryRedisData
		}
		if ('Sessions' in responseData) {
			result.content.responseData2 = responseData.Sessions
		}
		if ('DataCUDStatus' in responseData) {
			result.content.responseData2 = responseData.DataCUDStatus
		}

		// Handle pagination
		result.pagination.total =
			'FilterCounts' in responseData
				? responseData.FilterCounts
				: Array.isArray(result.content.responseData)
					? result.content.responseData.length
					: 1

		console.log('Business API Result:', result)
		return result
	} catch (error) {
		console.error('Business API Error:', error)

		const axiosError = error as AxiosError<T>
		result.statusCode = axiosError.response?.status ?? 500
		result.content.response = 'Internal Server Error'

		if (axiosError.response?.data) {
			result.content.responseData = Array.isArray(axiosError.response.data)
				? axiosError.response.data
				: [axiosError.response.data]
		}

		return result
	}
}

/**
 * Legacy compatibility export - maps to businessApiCall
 * This maintains backward compatibility with existing AxiosService
 */
export const axiosAPI = businessApiCall
