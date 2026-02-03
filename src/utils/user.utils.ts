import { UserRole, AccessPermission } from '@/types'

const roleColors: Record<UserRole, string> = {
	admin: 'success',
	manager: 'warning',
	user: 'info',
	guest: 'danger',
}
const roleLabel: Record<UserRole, string> = {
	admin: '系統管理者',
	manager: '部門主管',
	user: '一般使用者',
	guest: '訪客',
}

const getPermissionColor = (data: AccessPermission) => {
	if (data) {
		let authorityNum = 0
		const accessList = JSON.parse(data.accessList as string)
		const type_admin_num = Object.keys(accessList).length
		Object.values(accessList).map((e: any) => {
			if (e.authority) authorityNum += 1
		})
		const roleType: UserRole =
			authorityNum === type_admin_num ? 'admin' : authorityNum <= 1 ? 'guest' : 'user'
		return roleColors[roleType]
	}
}

export { roleColors, roleLabel, getPermissionColor }
