<template>
	<VaLayout
		:top="{ fixed: true, order: 2 }"
		:left="{
			fixed: true,
			absolute: breakpoints.mdDown,
			order: 1,
			overlay: breakpoints.mdDown && !isSidebarMinimized,
		}"
		class="bg-white"
		@leftOverlayClick="GlobalStore.toggleSidebar('app-layout1')"
	>
		<template #top>
			<AppNavbar :is-mobile="isMobile" :is-tablet="isTablet" />
		</template>

		<template #left>
			<AppSidebar
				:minimized="isSidebarMinimized"
				:animated="!isMobile"
				:mobile="isMobile"
				:tablet="isTablet"
				:userData="userData"
			/>
		</template>

		<template #content>
			<div
				:class="{ minimized: isSidebarMinimized }"
				class="app-layout__sidebar-wrapper bg-white"
			>
				<div v-if="isFullScreenSidebar" class="flex justify-end">
					<VaButton
						class="px-4 py-4"
						icon="md_close"
						preset="plain"
						@click="onCloseSidebarButtonClick"
					/>
				</div>
			</div>
			<main class="pt-0" style="height: calc(100vh - 4rem)">
				<AppLayoutNavigation
					v-if="!isMobile && router.currentRoute.value.path != '/home'"
					class="p-4"
				/>
				<article>
					<RouterView class="p-4" :is-mobile="isMobile" style="margin: 0 auto" />
				</article>
			</main>
		</template>
	</VaLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteUpdate } from 'vue-router'
import { useBreakpoint } from 'vuestic-ui'

import { useGlobalStore } from '../stores/global.store'
import { useUserAuthStore } from '@/stores/userAuth.store'

import AppLayoutNavigation from '../components/app-layout-navigation/AppLayoutNavigation.vue'
import AppNavbar from '../components/navbar/AppNavbar.vue'
import AppSidebar from '../components/sidebar/AppSidebar.vue'
import { authService } from '@/services/AuthService'
import { useKeyboardAwareResize } from '@/utils/useKeyboardAwareResize'

const router = useRouter()
const AuthStore = useUserAuthStore()

const GlobalStore = useGlobalStore()

const breakpoints = useBreakpoint()

const sidebarWidth = ref('16rem')
const sidebarMinimizedWidth = ref(undefined)

const isMobile = ref(false)
const isTablet = ref(false)
const { isSidebarMinimized } = storeToRefs(GlobalStore)

const { userData } = storeToRefs(AuthStore)

const handleRealResize = (w, h) => {
	console.log('Real resize!', w, h)
	GlobalStore.toggleSidebar(breakpoints.mdDown)
	// isSidebarMinimized.value = breakpoints.mdDown
	isMobile.value = breakpoints.smDown
	isTablet.value = breakpoints.mdDown
	sidebarMinimizedWidth.value = isMobile.value ? '0' : '4.5rem'
	sidebarWidth.value = isTablet.value ? '100%' : '16rem'
	if (isMobile.value || isTablet.value) {
		GlobalStore.toggleSidebar(true)
	}
	GlobalStore.setDataTableHeight(breakpoints.height / 2)
}
useKeyboardAwareResize(
	{
		onRealResize: handleRealResize,
	},
	{
		keyboardHeightThreshold: 120,
		keyboardHeightRatio: 0.25,
		debounce: 100,
		useVisualViewport: true,
	}
)

onMounted(() => {
	handleRealResize()
})

onBeforeRouteUpdate(() => {
	if (breakpoints.mdDown) {
		// Collapse sidebar after route change for Mobile
		GlobalStore.toggleSidebar(true)
	}
})

const isFullScreenSidebar = computed(() => isTablet.value && !isSidebarMinimized.value)

const onCloseSidebarButtonClick = () => {
	GlobalStore.toggleSidebar(true)
}

//在頁面重新整理時將vuex裡的資訊儲存到localStorage裡
window.addEventListener('beforeunload', () => {
	if (userData.value.status === true) {
		sessionStorage.setItem('loginStatus', Boolean(userData.value.status))
		sessionStorage.setItem('loginUserID', userData.value.userID)
		sessionStorage.setItem('loginUsername', userData.value.username)
		sessionStorage.setItem('loginFullName', userData.value.fullName)
		sessionStorage.setItem('loginTime', userData.value.loginTime)
		sessionStorage.setItem('accessToken', userData.value.accessToken)
		sessionStorage.setItem('refreshToken', userData.value.refreshToken)
		sessionStorage.setItem('loginRoles', userData.value.roles)
		sessionStorage.setItem('loginAccessList', JSON.stringify(userData.value.accessList))
	} else {
		// console.log('@@@@@@@@')
		// console.log(router.currentRoute.value)
		if (router.currentRoute.value.path != '/auth/login') {
			authService().logOut()
		}
	}
})
</script>

<style lang="scss" scope>
// Prevent icon jump on animation
.va-sidebar {
	width: unset !important;
	min-width: unset !important;
}
</style>
