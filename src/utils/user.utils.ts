import { UserRole, AccessPermission } from '@/types'

const roleColors: Record<UserRole, string> = {
	admin: 'success',
	manager: 'warning',
	operator: 'info',
	quality_inspector: 'info',
	warehouse_staff: 'info',
	scheduler: 'info',
	guest: 'danger',
}
const roleLabel: Record<UserRole, string> = {
	admin: '系統管理者',
	manager: '部門主管',
	operator: '作業員',
	quality_inspector: '品檢人員',
	warehouse_staff: '倉管人員',
	scheduler: '排程拆單人員',
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
			authorityNum === type_admin_num ? 'admin' : authorityNum <= 1 ? 'guest' : 'operator'
		return roleColors[roleType]
	}
}

export { roleColors, roleLabel, getPermissionColor }
