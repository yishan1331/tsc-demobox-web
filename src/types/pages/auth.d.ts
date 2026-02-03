export interface Auth {
	access_token: string
	refresh_token: string
	token_type: string
	login_time: string
}

export interface UserData {
	userID: number
	username: string
	fullName: string
	loginStatus: boolean
	accessToken: string
	refreshToken: string
	roles: string[]
	loginTime: string
	accessList: object
}

// UserSessions 定義在 user.d.ts 中，避免重複定義
