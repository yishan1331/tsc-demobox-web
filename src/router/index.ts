import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: { name: 'login' },
	},
	{
		path: '/auth',
		component: AuthLayout,
		children: [
			{
				name: 'login',
				path: 'login',
				component: () => import('../pages/auth/Login.vue'),
			},
			{
				path: '',
				redirect: { name: 'login' },
			},
		],
	},
	{
		name: '404',
		path: '/404',
		component: () => import('../pages/404.vue'),
	},
]

const router = createRouter({
	// history: createWebHistory(import.meta.env.BASE_URL),
	history: createWebHashHistory(),
	scrollBehavior(to, _from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		}
		// For some reason using documentation example doesn't scroll on page navigation.
		if (to.hash) {
			return { el: to.hash, behavior: 'smooth' }
		} else {
			window.scrollTo(0, 0)
		}
	},
	routes,
})

export default router
