<template>
	<VaNavbar class="app-navbar" color="navbarBg">
		<template #left>
			<div class="app-navbar__left">
				<!-- 手機/平板漢堡選單 -->
				<VaButton
					v-if="isMobile || isTablet"
					preset="plain"
					class="app-navbar__menu-btn"
					@click="GlobalStore.toggleSidebar()"
				>
					<VaIcon
						size="24px"
						:name="isSidebarMinimized ? 'menu' : 'close'"
						color="navbarText"
					/>
				</VaButton>

				<!-- Logo -->
				<RouterLink to="/home" class="app-navbar__logo" aria-label="返回首頁">
					<img alt="TSC Logo" src="@/assets/tsc_logo.png" class="app-navbar__logo-img" />
				</RouterLink>

				<!-- 系統名稱 (桌面版顯示) -->
				<div v-if="!isMobile" class="app-navbar__title">
					<span class="app-navbar__title-text">DemoBox</span>
					<span class="app-navbar__title-badge">Monitor</span>
				</div>
			</div>
		</template>

		<template #right>
			<div class="app-navbar__right">
				<!-- 主題切換 -->
				<ThemeSwitcher class="app-navbar__theme-switcher" />

				<!-- 登出按鈕 -->
				<VaButton
					preset="plain"
					class="app-navbar__logout-btn"
					color="navbarTextSecondary"
					@click="goLogout"
				>
					<VaIcon name="logout" size="20px" class="mr-2" />
					<span v-if="!isMobile">{{ t('navbar.logout') }}</span>
				</VaButton>
			</div>
		</template>
	</VaNavbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useGlobalStore } from '@/stores/global.store'
import { authService } from '@/services/AuthService'
import ThemeSwitcher from '@/components/theme-switcher/ThemeSwitcher.vue'

defineProps({
	isMobile: { type: Boolean, default: false },
	isTablet: { type: Boolean, default: false },
})

const { t } = useI18n()

const GlobalStore = useGlobalStore()
const { isSidebarMinimized } = storeToRefs(GlobalStore)

const goLogout = () => {
	authService().logOut()
}
</script>

<style lang="scss" scoped>
// === Navbar - Light Mode 預設樣式 ===
.app-navbar {
	z-index: 100;
	height: 64px;
	padding: 0 1rem;
	border-bottom: 1px solid #e2e8f0;
	background: #ffffff !important;

	// === 左側區塊 ===
	&__left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	&__menu-btn {
		padding: 0.5rem;
		border-radius: 8px;
		transition: background-color 0.15s ease;

		&:hover {
			background-color: #f1f5f9;
		}
	}

	&__logo {
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	&__logo-img {
		height: 32px;
		width: auto;
		object-fit: contain;
	}

	&__title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: 0.5rem;
		padding-left: 1rem;
		border-left: 1px solid #e2e8f0;
	}

	&__title-text {
		font-size: 1.125rem;
		font-weight: 600;
		color: #0f172a;
		letter-spacing: -0.025em;
	}

	&__title-badge {
		font-size: 0.75rem;
		font-weight: 500;
		color: #0ea5e9;
		background: rgba(14, 165, 233, 0.1);
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
	}

	// === 右側區塊 ===
	&__right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	&__theme-switcher {
		margin-right: 0.5rem;
	}

	&__logout-btn {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 500;
		color: #475569;
		transition: all 0.15s ease;

		&:hover {
			background-color: #f1f5f9;
			color: #ef4444;
		}
	}
}

// === 響應式調整 ===
@media screen and (max-width: 768px) {
	.app-navbar {
		padding: 0 0.75rem;

		&__title {
			display: none;
		}

		&__right {
			gap: 0.5rem;
		}

		&__logout-btn {
			padding: 0.5rem;
		}
	}
}
</style>

<style lang="scss">
// === Navbar - Dark Mode 樣式 (非 scoped) ===
body.dark-mode,
body.va-dark {
	.app-navbar {
		background: #1e293b !important;
		border-bottom-color: #334155 !important;
	}

	.app-navbar__menu-btn:hover {
		background-color: #334155 !important;
	}

	.app-navbar__title {
		border-left-color: #475569 !important;
	}

	.app-navbar__title-text {
		color: #f8fafc !important;
	}

	.app-navbar__title-badge {
		color: #38bdf8 !important;
		background: rgba(56, 189, 248, 0.15) !important;
	}

	.app-navbar__logout-btn {
		color: #94a3b8 !important;

		&:hover {
			background-color: #334155 !important;
			color: #f87171 !important;
		}
	}
}
</style>
