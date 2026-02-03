import { RouteRecordRaw } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'
import { type INavigationRoute } from '@/components/sidebar/NavigationRoutes'
import { type PageAccess } from '@/types'

import RouteViewComponent from '@/layouts/RouterBypass.vue'

export interface ChildRoute {
	name: string
	path: string
	meta: { needLogin: boolean }
	children?: ChildRoute[]
}

export const childRouter: Array<RouteRecordRaw> = [
	{
		path: '/:pathMatch(.*)*',
		redirect: { name: 'home' },
	},
	{
		name: 'index',
		path: '/',
		component: AppLayout,
		meta: {
			needLogin: true,
		},
		redirect: { name: 'home' },
		children: [
			{
				name: 'home',
				path: 'home',
				component: () => import('@/pages/Home.vue'),
				meta: {
					needLogin: true,
				},
			},
			{
				path: 'monitoring',
				component: RouteViewComponent,
				name: 'monitoring',
				meta: {
					needLogin: true,
				},
				children: [
					{
						path: 'overview',
						component: () => import('@/pages/monitoring/Overview.vue'),
						name: 'monitoringOverview',
						meta: {
							needLogin: true,
						},
					},
					{
						path: 'machine',
						component: () => import('@/pages/monitoring/Machine.vue'),
						name: 'monitoringMachine',
						meta: {
							needLogin: true,
						},
					},
				],
			},
			{
				path: 'history',
				name: 'history',
				component: () => import('@/pages/history/History.vue'),
				meta: {
					needLogin: true,
				}
			},
			{
				path: 'settings',
				component: RouteViewComponent,
				name: 'settings',
				meta: {
					needLogin: true,
				},
				children: [
					{
						path: 'users',
						component: () => import('@/pages/settings/users/UsersPage.vue'),
						name: 'settingsAccounts',
						meta: {
							needLogin: true,
						},
					},
				],
			},
		],
	},
]

//Ethan@20240412 多層router解析
export const findVerifiedRoute = (
	accessList: object,
	routes: RouteRecordRaw[] | INavigationRoute[]
) => {
	const _pageAccess = accessList as any
	const result = [] as RouteRecordRaw[] | INavigationRoute[]
	const traverse = (
		routers: RouteRecordRaw[] | INavigationRoute[],
		pageAccess: any,
		result: RouteRecordRaw[] | INavigationRoute[]
	): RouteRecordRaw[] | INavigationRoute[] => {
		for (const router of routers) {
			const _routerName = router.name as keyof PageAccess
			if (router?.children) {
				if (_routerName in pageAccess && 'children' in pageAccess[_routerName]) {
					const childResult = [] as RouteRecordRaw[] | INavigationRoute[]
					const childRouterBack = traverse(
						router.children,
						pageAccess[_routerName].children,
						childResult
					)
					router.children = childRouterBack
					if (_routerName in pageAccess && pageAccess[_routerName].authority) {
						result.push(router as any)
					}
				}
			} else {
				if (router.name === 'home') {
					result.push(router as any)
				}
				if (_routerName in pageAccess && pageAccess[_routerName].authority) {
					result.push(router as any)
				}
			}
		}
		return result
	}
	return traverse(routes, _pageAccess, result)
}
