<template>
	<VaLayout
		:top="{ fixed: true, order: 2 }"
		:left="{
			fixed: true,
			absolute: breakpoints.mdDown,
			order: 1,
			overlay: breakpoints.mdDown && !isSidebarMinimized,
		}"
		class="app-layout"
		@leftOverlayClick="GlobalStore.toggleSidebar('app-layout1')"
	>
		<!-- 頂部導航欄 -->
		<template #top>
			<AppNavbar :is-mobile="isMobile" :is-tablet="isTablet" />
		</template>

		<!-- 左側側邊欄 -->
		<template #left>
			<AppSidebar
				:minimized="isSidebarMinimized"
				:animated="!isMobile"
				:mobile="isMobile"
				:tablet="isTablet"
				:userData="userData"
			/>
		</template>

		<!-- 主內容區 -->
		<template #content>
			<div
				:class="{ minimized: isSidebarMinimized }"
				class="app-layout__sidebar-wrapper"
			>
				<div v-if="isFullScreenSidebar" class="app-layout__close-btn">
					<VaButton preset="plain" icon="close" @click="onCloseSidebarButtonClick" />
				</div>
			</div>

			<main class="app-layout__main">
				<!-- 麵包屑導航 -->
				<AppLayoutNavigation
					v-if="!isMobile && router.currentRoute.value.path !== '/home'"
					class="app-layout__breadcrumb"
				/>

				<!-- 頁面內容 -->
				<article class="app-layout__content">
					<RouterView :is-mobile="isMobile" />
				</article>
			</main>
		</template>
	</VaLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref, computed } from 'vue'
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

const handleRealResize = () => {
	GlobalStore.toggleSidebar(breakpoints.mdDown)
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
		GlobalStore.toggleSidebar(true)
	}
})

const isFullScreenSidebar = computed(() => isTablet.value && !isSidebarMinimized.value)

const onCloseSidebarButtonClick = () => {
	GlobalStore.toggleSidebar(true)
}

// 頁面重整時保存登入狀態
const handleBeforeUnload = () => {
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
		if (router.currentRoute.value.path !== '/auth/login') {
			authService().logOut()
		}
	}
}

window.addEventListener('beforeunload', handleBeforeUnload)

onUnmounted(() => {
	window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style lang="scss" scoped>
// === AppLayout - Light Mode 預設樣式 ===
.app-layout {
	min-height: 100vh;
	background: #f8fafc;

	// === 側邊欄包裝器 ===
	&__sidebar-wrapper {
		&.minimized {
			// 最小化時的樣式
		}
	}

	&__close-btn {
		display: flex;
		justify-content: flex-end;
		padding: 1rem;
	}

	// === 主內容區 ===
	&__main {
		display: flex;
		flex-direction: column;
		min-height: calc(100vh - 64px);
		padding: 0;
		background: #f8fafc;
	}

	// === 麵包屑導航 ===
	&__breadcrumb {
		padding: 1rem 1.5rem 0;
	}

	// === 頁面內容 ===
	&__content {
		flex: 1;
		padding: 1rem 1.5rem 1.5rem;
		max-width: 100%;
		overflow-x: hidden;
	}
}

// === 響應式調整 ===
@media screen and (max-width: 768px) {
	.app-layout {
		&__breadcrumb {
			padding: 0.75rem 1rem 0;
		}

		&__content {
			padding: 0.75rem 1rem 1rem;
		}
	}
}
</style>

<style lang="scss">
// === AppLayout - Dark Mode 樣式 (非 scoped) ===
body.dark-mode,
body.va-dark {
	.app-layout {
		background: #0f172a !important;
	}

	.app-layout__main {
		background: #0f172a !important;
	}
}
</style>

<style lang="scss">
// === 全域側邊欄修正 ===
.va-sidebar {
	width: unset !important;
	min-width: unset !important;
}

// === 全域 Layout 調整 ===
.va-layout {
	&__area--top {
		z-index: 100;
	}

	&__area--left {
		z-index: 99;
	}
}
</style>
