<template>
	<VaSidebar
		v-model="writableVisible"
		:width="sidebarWidth"
		:minimized="$props.minimized"
		minimized-width="0"
		class="app-sidebar"
	>
		<!-- 使用者資訊區塊 -->
		<div class="app-sidebar__user">
			<div class="app-sidebar__user-avatar">
				<VaIcon name="person" size="20px" color="textInverse" />
			</div>
			<div v-if="!$props.minimized" class="app-sidebar__user-info">
				<span class="app-sidebar__user-name">
					{{ userData ? userData.fullName : '' }}
				</span>
				<span class="app-sidebar__user-id">
					@{{ userData ? userData.username : '' }}
				</span>
			</div>
		</div>

		<!-- 登入時間 -->
		<div v-if="!$props.minimized && userData?.loginTime" class="app-sidebar__login-time">
			<VaIcon name="schedule" size="14px" color="textMuted" />
			<span>{{ userData.loginTime }}</span>
		</div>

		<VaDivider class="app-sidebar__divider" />

		<!-- 導航選單 -->
		<nav class="app-sidebar__nav">
			<VaAccordion v-model="routingMenuStatus" multiple>
				<AppSidebarItems
					v-for="(route, index) in navigationVerifiedRoutes"
					:key="index"
					:navigationRoute="route"
					:mobile="isMobile"
				/>
			</VaAccordion>
		</nav>

		<VaSpacer />

		<!-- 底部版本資訊 -->
		<div class="app-sidebar__footer">
			<span class="app-sidebar__version">v{{ VERSION }}</span>
		</div>
	</VaSidebar>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'

import AppSidebarItems from './AppSidebarItems.vue'
import { useUserAuthStore } from '@/stores/userAuth.store'
import { findVerifiedRoute } from '@/router/childRouter'
import { VERSION } from '@/constants'
import { NavigationRoutes, routeHasActiveChild, type INavigationRoute } from './NavigationRoutes'

export default defineComponent({
	name: 'Sidebar',
	props: {
		visible: { type: Boolean, default: true },
		minimized: { type: Boolean, default: false },
		mobile: { type: Boolean, default: false },
		tablet: { type: Boolean, default: false },
		userData: { type: Object, required: true },
	},
	emits: ['update:visible'],
	components: {
		AppSidebarItems,
	},

	setup: (props, { emit }) => {
		const nowRoute = useRoute()

		const routingMenuStatus = ref<boolean[]>([])

		const { pageAccess } = storeToRefs(useUserAuthStore())

		const writableVisible = computed({
			get: () => props.visible,
			set: (v: boolean) => emit('update:visible', v),
		})

		const setActiveExpand = () => {
			routingMenuStatus.value = navigationVerifiedRoutes.value.map(
				(route: INavigationRoute) => routeHasActiveChild(nowRoute, route)
			)
		}

		const isMobile = computed(() => props.mobile)
		const sidebarWidth = computed(() => (props.mobile ? '100vw' : '260px'))

		const navigationVerifiedRoutes = computed((): INavigationRoute[] => {
			const verifiedRoute = findVerifiedRoute(
				pageAccess.value,
				cloneDeep(NavigationRoutes.routes)
			) as INavigationRoute[]
			return verifiedRoute
		})

		watch(() => nowRoute.fullPath, setActiveExpand, { immediate: true })

		return {
			VERSION,
			writableVisible,
			sidebarWidth,
			routingMenuStatus,
			navigationVerifiedRoutes,
			isMobile,
			AppSidebarItems,
		}
	},
})
</script>

<style lang="scss" scoped>
// === Sidebar - Light Mode 預設樣式 ===
.app-sidebar {
	background: #ffffff !important;
	border-right: 1px solid #e2e8f0;

	// === 使用者區塊 ===
	&__user {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
	}

	&__user-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
		border-radius: 10px;
		flex-shrink: 0;
	}

	&__user-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	&__user-name {
		font-size: 0.9375rem;
		font-weight: 600;
		color: #0f172a;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__user-id {
		font-size: 0.75rem;
		color: #475569;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// === 登入時間 ===
	&__login-time {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 1rem 1rem;
		font-size: 0.75rem;
		color: #64748b;
	}

	// === 分隔線 ===
	&__divider {
		margin: 0 1rem;
		background: #e2e8f0 !important;
	}

	// === 導航區塊 ===
	&__nav {
		flex: 1;
		padding: 0.5rem 0;
		overflow-y: auto;
		overflow-x: hidden;

		// 滾動條樣式
		&::-webkit-scrollbar {
			width: 4px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: #e2e8f0;
			border-radius: 2px;

			&:hover {
				background: #94a3b8;
			}
		}
	}

	// === 底部區塊 ===
	&__footer {
		padding: 1rem;
		border-top: 1px solid #e2e8f0;
	}

	&__version {
		font-size: 0.75rem;
		color: #64748b;
		font-weight: 500;
	}
}

// === 覆蓋 Vuestic Sidebar 預設樣式 ===
:deep(.va-sidebar) {
	background: #ffffff !important;
}

:deep(.va-sidebar__menu) {
	padding: 0;
}
</style>

<style lang="scss">
// === Sidebar - Dark Mode 樣式 (非 scoped) ===
body.dark-mode,
body.va-dark {
	.app-sidebar {
		background: #0f172a !important;
		border-right-color: rgba(255, 255, 255, 0.08) !important;
	}

	.app-sidebar__user-name {
		color: #f8fafc !important;
	}

	.app-sidebar__user-id {
		color: #94a3b8 !important;
	}

	.app-sidebar__login-time {
		color: #64748b !important;
	}

	.app-sidebar__divider {
		background: rgba(255, 255, 255, 0.08) !important;
	}

	.app-sidebar__footer {
		border-top-color: rgba(255, 255, 255, 0.08) !important;
	}

	.app-sidebar__version {
		color: #64748b !important;
	}

	.app-sidebar__nav {
		&::-webkit-scrollbar-thumb {
			background: rgba(255, 255, 255, 0.1) !important;

			&:hover {
				background: rgba(255, 255, 255, 0.2) !important;
			}
		}
	}

	// 覆蓋 Vuestic Sidebar
	.va-sidebar {
		background: #0f172a !important;
	}
}
</style>
