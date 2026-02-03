import { TOAST_LIFE_TIME } from '@/constants/common.constants'
import { authService } from '@/services/AuthService'

class EventService {
	private static instance: EventService
	private notify: any
	private t: any

	private constructor() {
		// 初始化事件監聽
		this.initEventListeners()
	}

	public static getInstance(): EventService {
		if (!EventService.instance) {
			EventService.instance = new EventService()
		}
		return EventService.instance
	}

	public initServices(notify: any, t: any) {
		this.notify = notify
		this.t = t
	}

	private initEventListeners() {
		window.addEventListener('session-expired', this.handleSessionExpired.bind(this))
		window.addEventListener('network-error', this.handleNetworkError.bind(this))
	}

	private handleSessionExpired() {
		if (this.notify && this.t) {
			this.notify({
				color: 'danger',
				message: this.t('auth.session_expired'),
				duration: TOAST_LIFE_TIME,
			})
			authService().logOut(true)
		}
		return
	}

	private handleNetworkError() {
		if (this.notify && this.t) {
			this.notify({
				color: 'danger',
				message: this.t('auth.network_error'),
				duration: TOAST_LIFE_TIME,
			})
		}
	}

	public cleanup() {
		window.removeEventListener('session-expired', this.handleSessionExpired.bind(this))
		window.removeEventListener('network-error', this.handleNetworkError.bind(this))
	}
}

export const eventService = EventService.getInstance()
