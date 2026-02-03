import { BaseFilters } from '../common'

type User = {
	user_id: number
	username: string
	full_name: string
	email: string | null
	phone: string | null
	address: string | null
	position: string | null
	dep_id: number | null
	dep_code: string | null
	ac_type: number
	is_active: boolean
	password_hash: string
	last_login: string | null
	login_attempts: number | null
	locked_until: string | null
	created_at: string
	modified_at: string
	roles: string[]
}

type AccessPermission = {
	levelNo: number
	levelName: string
	accessList: object | string
	levelInfo: string
	remark: string
	creatorNo: number
	modifierNo: number
	createTime: Date
	updateTime: Date
}

type UserFilters = BaseFilters & {
	status?: string
}

type UserRole =
	| 'admin'
	| 'manager'
	| 'user'
	| 'guest'

type UserSessions = {
	user_id: number
	username: string
	fullname: string
	login_time: string
	user_roles: string[]
	permissions: object
	tokens: {
		access_token: string
		refresh_token: string
	}
}

type PageAccess = {
	authority: boolean
	children?: {
		[key: string]: {
			authority: boolean
		}
	}
}

export { User, AccessPermission, UserFilters, UserRole, UserSessions, PageAccess }
