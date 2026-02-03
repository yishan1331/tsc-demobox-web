<template>
	<VaNavbar class="app-layout-navbar py-2 px-0 h-16" color="backgroundTsc">
		<template #left>
			<div class="left">
				<Transition
					v-if="isMobile || (isTablet && router.currentRoute.value.path === '/home')"
					name="icon-fade"
					mode="out-in"
				>
					<VaIcon
						size="24px"
						:component="VaIconComponent"
						:icon="isSidebarMinimized ? 'menu' : 'close'"
						@click="GlobalStore.toggleSidebar()"
					/>
				</Transition>
				<div class="logo">
					<img
						alt="logo"
						src="@/assets/tsc_logo.png"
						style="width: 100%; max-width: 100px"
					/>
				</div>
			</div>
		</template>
		<template #right>
			<AppNavbarActions class="app-navbar__actions" :is-mobile="isMobile" />
		</template>
	</VaNavbar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useGlobalStore } from '@/stores/global.store'
import AppNavbarActions from './components/AppNavbarActions.vue'
import VaIconComponent from '@/components/icons/VaIconComponent.vue'

defineProps({
	isMobile: { type: Boolean, default: false },
	isTablet: { type: Boolean, default: false },
})

const router = useRouter()

const GlobalStore = useGlobalStore()
const { isSidebarMinimized } = storeToRefs(GlobalStore)
</script>

<style lang="scss" scoped>
.va-navbar {
	z-index: 2;
	@media screen and (max-width: 950px) {
		.left {
			width: 100%;
		}

		.app-navbar__actions {
			display: flex;
			justify-content: space-between;
		}
	}
}

.left {
	display: flex;
	align-items: center;
	margin-left: 1rem;

	& > * {
		margin-right: 1rem;
	}

	& > *:last-child {
		margin-right: 0;
	}
}

.icon-fade-enter-active,
.icon-fade-leave-active {
	transition: transform 0.5s ease;
}

.icon-fade-enter,
.icon-fade-leave-to {
	transform: scale(0.5);
}
</style>
