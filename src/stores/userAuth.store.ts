import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'

import { UserData } from '@/types/pages/auth'

export const useUserAuthStore = defineStore('user', {
	state: () => {
		return {
			loginDetails: {
				userID: 1,
				username: '',
				fullName: '',
				loginStatus: false,
				accessToken: '',
				refreshToken: '',
				roles: [],
				loginTime: '',
				accessList: {},
			} as UserData,

			defaultLoginDetails: {
				userID: 1,
				username: '',
				fullName: '',
				loginTime: '',
				loginStatus: false,
				accessToken: '',
				refreshToken: '',
				roles: [],
				accessList: {},
			} as UserData,
			_pageAccess: {},
			defaultPageAccess: {
				settings: {
					authority: false,
					children: {
						settingsUsers: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						// settingsPermission: {
						// 	authority: false,
						// 	function: {
						// 		delete: false,
						// 		export: false,
						// 		read: false,
						// 		write: false,
						// 	},
						// },
						settingsPiecework: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						settingsErpUpdate: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
					},
				},
				monitoring: {
					authority: false,
					children: {
						monitoringFactoryOpStatus: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						monitoringProdBoard: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						monitoringMachineMgmt: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
					},
				},
				prodReporting: {
					authority: false,
					children: {
						prodReportingProdLine: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						prodReportingOutsourcing: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						prodReportingWorkorder: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						prodReportingReport: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						prodReportingOrderBkdwn: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						prodReportingProcessBkdwn: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
					},
				},
				warehouse: {
					authority: false,
					children: {
						warehouseReceiving: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						warehouseIssuance: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						warehouseTransfer: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						warehouseQuery: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
					},
				},
				qualityControl: {
					authority: false,
					children: {
						qualityControlFirstArticle: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						qualityControlPatrol: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						qualityControlFinal: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						qualityControlReport: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
					},
				},
				scheduling: {
					authority: false,
					children: {
						schedulingOperation: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						schedulingAdjustment: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						schedulingQuery: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
						schedulingProgress: {
							authority: false,
							function: {
								delete: false,
								export: false,
								read: false,
								write: false,
							},
						},
					},
				},
			},
			_addedRouteToRemove: [] as any[],
			// is2FAEnabled: false,
		}
	},

	getters: {
		getDefaultPageAccess: (state) => state.defaultPageAccess,
		pageAccess: (state) => state._pageAccess,
		userData: (state) => {
			return {
				userID: state.loginDetails.userID,
				username: state.loginDetails.username,
				fullName: state.loginDetails.fullName,
				loginTime: state.loginDetails.loginTime,
				status: state.loginDetails.loginStatus,
				accessToken: state.loginDetails.accessToken,
				refreshToken: state.loginDetails.refreshToken,
				roles: state.loginDetails.roles,
				accessList: state.loginDetails.accessList,
			}
		},
		addedRouteToRemove: (state) => state._addedRouteToRemove,
	},

	actions: {
		// toggle2FA() {
		//   this.is2FAEnabled = !this.is2FAEnabled
		// },
		setUserData(obj: Omit<UserData, 'accessToken' | 'refreshToken'>) {
			if (obj?.userID) this.loginDetails.userID = obj.userID
			if (obj?.username) this.loginDetails.username = obj.username
			if (obj?.fullName) this.loginDetails.fullName = obj.fullName
			if (obj?.loginTime) this.loginDetails.loginTime = obj.loginTime
			if (obj?.loginStatus) this.loginDetails.loginStatus = obj.loginStatus
			if (obj?.roles) this.loginDetails.roles = obj.roles
			if (obj?.accessList) this.loginDetails.accessList = obj.accessList
		},

		setUserAuthToken(accessToken: string, refreshToken: string) {
			this.loginDetails.accessToken = accessToken
			this.loginDetails.refreshToken = refreshToken
		},

		resetUserData() {
			this.loginDetails = cloneDeep(this.defaultLoginDetails)
		},

		setUserPageAccess(obj: object) {
			console.log(obj)
			this._pageAccess = obj
		},

		setAddedRouteToRemove(func: any) {
			this._addedRouteToRemove.push(func)
		},
	},
})
