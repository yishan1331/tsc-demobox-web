<template>
	<RouterView class="app-root" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted } from 'vue'

import { childRouter, findVerifiedRoute } from '@/router/childRouter'
import { useUserAuthStore } from '@/stores/userAuth.store'
import { eventService } from '@/services/EventService'

const router = useRouter()
const AuthStore = useUserAuthStore()
const { init: notify } = useToast()
const { t } = useI18n()

setTimeout(function () {
	// console.log(router.currentRoute.value);
	// console.log(sessionStorage.getItem("loginStatus"));
	// if (router.currentRoute.value.path != '/login') {
	//在頁面載入時讀取sessionStorage裡的狀態資訊並更新vuex資料，更新完成後remove sessionStorage
	if (
		sessionStorage.getItem('loginStatus') != null &&
		sessionStorage.getItem('loginStatus') != 'undefined'
	) {
		const obj = {
			userID: sessionStorage.getItem('loginUserID'),
			username: sessionStorage.getItem('loginUsername'),
			fullName: sessionStorage.getItem('loginFullName'),
			loginStatus: Boolean(sessionStorage.getItem('loginStatus')),
			loginTime: sessionStorage.getItem('loginTime'),
			roles: sessionStorage.getItem('loginRoles'),
			accessList: JSON.parse(sessionStorage.getItem('loginAccessList')),
		}
		const access = JSON.parse(sessionStorage.getItem('loginAccessList'))
		// console.log(access);
		AuthStore.setUserData(obj)
		AuthStore.setUserAuthToken(
			sessionStorage.getItem('accessToken'),
			sessionStorage.getItem('refreshToken')
		)
		const trueList = []
		Object.entries(access).forEach((element) => {
			if (element[1]['authority']) {
				if (Object.prototype.hasOwnProperty.call(element[1], 'children')) {
					Object.keys(element[1].children).map((item) => {
						if (element[1].children[item].authority) {
							trueList.push(element[0] + '/' + item)
						}
					})
				} else {
					trueList.push(element[0])
				}
			}
		})
		// console.log(trueList);
		AuthStore.setUserPageAccess(access)
		// 先deep copy
		const _childRouter = cloneDeep(childRouter)
		// 遍历 childRouter 数组，将每个路由配置对象添加到路由中
		_childRouter.forEach((route) => {
			if (route.children) {
				let _findVerifiedRoute = []
				_findVerifiedRoute = findVerifiedRoute(access, route.children)
				// console.log(_findVerifiedRoute);
				route.children = _findVerifiedRoute
			}
			const addedRoute = router.addRoute(route)
			AuthStore.setAddedRouteToRemove(addedRoute)
		})
		console.log(router.getRoutes())
		sessionStorage.removeItem('loginStatus')
		sessionStorage.removeItem('loginUserID')
		sessionStorage.removeItem('loginUsername')
		sessionStorage.removeItem('loginFullName')
		sessionStorage.removeItem('loginTime')
		sessionStorage.removeItem('accessToken')
		sessionStorage.removeItem('refreshToken')
		sessionStorage.removeItem('loginRoles')
		sessionStorage.removeItem('loginAccessList')
		router.push(router.currentRoute.value.path)
	} else {
		router.push({ name: 'login' })
	}
	// }
}, 0)

onMounted(() => {
	eventService.initServices(notify, t)
})

onUnmounted(() => {
	eventService.cleanup()
})
</script>

<style lang="scss">
@use '@/scss/variables' as *;

#app {
	font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

body {
	margin: 0;
	min-width: 20rem;
}

// === 根元素背景色 (適應 dark mode) ===
.app-root {
	background-color: #ffffff;
	min-height: 100vh;
	transition: background-color 0.2s ease;
}

// === Dark Mode 全域樣式 ===
body.dark-mode,
body.va-dark {
	.app-root {
		background-color: #0f172a;
	}
}

.va-modal__dialog {
	.va-modal__footer {
		.va-button--normal:not(.va-modal__default-cancel-button) {
			background: $tsc-blue !important;
			--va-background-color: $tsc-blue !important;
		}
	}
	.va-modal__header {
		.va-modal__title {
			color: var(--va-tscBlack) !important;
			font-size: 1.5rem;
		}
	}
}
</style>
